import { useEffect, useRef, useState } from "react";
import { PageFlip } from "page-flip";
import { X, Download } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface PdfFlipViewerProps {
  pdfUrl: string;
  title?: string;
  eventTitle?: string;
  onClose?: () => void;
}

export default function PdfFlipViewer({ pdfUrl, title, eventTitle, onClose }: PdfFlipViewerProps) {
  const displayTitle = title || eventTitle || "Report";
  const [pages, setPages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const bookHostRef = useRef<HTMLDivElement>(null);
  const pageFlipRef = useRef<PageFlip | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPdf() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(pdfUrl);
        if (!res.ok) {
          throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
        }
        const arrayBuffer = await res.arrayBuffer();

        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const renderedPages: string[] = [];

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1.5 });

          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d")!;

          await page.render({ canvasContext: ctx, viewport, canvas }).promise;
          renderedPages.push(canvas.toDataURL());
        }

        if (!cancelled) {
          setPages(renderedPages);
          setLoading(false);
        }
      } catch (err: any) {
        console.error("PDF load error:", err);
        if (!cancelled) {
          setError(err.message || "Could not load this report.");
          setLoading(false);
        }
      }
    }

    loadPdf();
    return () => {
      cancelled = true;
    };
  }, [pdfUrl]);

  useEffect(() => {
    if (loading || pages.length === 0 || !bookHostRef.current) return;

    if (pageFlipRef.current) {
      try {
        pageFlipRef.current.destroy();
      } catch {
        // ignore
      }
      pageFlipRef.current = null;
    }
    bookHostRef.current.innerHTML = "";

    const mountEl = document.createElement("div");
    bookHostRef.current.appendChild(mountEl);

    const flip = new PageFlip(mountEl, {
      width: 550,
      height: 733,
      size: "stretch",
      minWidth: 315,
      maxWidth: 1000,
      minHeight: 420,
      maxHeight: 1350,
      showCover: true,
      drawShadow: true,
      maxShadowOpacity: 0.7,
      flippingTime: 700,
      useMouseEvents: true,
      showPageCorners: true,
      mobileScrollSupport: true,
    });

    pageFlipRef.current = flip;
    flip.loadFromImages(pages);

    return () => {
      if (pageFlipRef.current) {
        try {
          pageFlipRef.current.destroy();
        } catch {
          // ignore
        }
        pageFlipRef.current = null;
      }
    };
  }, [pages, loading]);

  // Close on Escape key
  useEffect(() => {
    if (!onClose) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div className="flex items-center justify-between w-full max-w-4xl mb-4 px-2">
        <h2 className="text-white text-lg font-semibold truncate">{displayTitle}</h2>
        <div className="flex items-center gap-2">
          <a
            href={pdfUrl}
            download
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
          >
            <Download className="w-4 h-4" /> Download
          </a>
          {onClose && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div onClick={(e) => e.stopPropagation()} className="flex items-center justify-center max-w-full max-h-full">
        {loading && <div className="text-white">Loading report…</div>}

        {error && !loading && (
          <div className="text-white text-center max-w-md">
            <p className="mb-3">Could not load this report: {error}</p>
            <a href={pdfUrl} download className="underline">
              Try downloading it instead
            </a>
          </div>
        )}

        {!loading && !error && <div ref={bookHostRef} aria-label={`${displayTitle} report`} />}
      </div>
    </div>
  );
}
