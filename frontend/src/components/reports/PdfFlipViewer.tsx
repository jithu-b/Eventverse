import { useEffect, useState } from "react";
import { X, Download, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState(0);

  // Render each PDF page to a high-resolution image (boosted for Retina
  // screens, exported as lossless PNG) so it displays sharp at full size.
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
        const pixelRatio = window.devicePixelRatio || 1;

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 2.5 * pixelRatio });

          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d")!;

          await page.render({ canvasContext: ctx, viewport, canvas }).promise;
          renderedPages.push(canvas.toDataURL("image/png"));
        }

        if (!cancelled) {
          setPages(renderedPages);
          setCurrentPage(0);
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

  // Keyboard navigation + close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) onClose();
      if (e.key === "ArrowRight") setCurrentPage((p) => Math.min(p + 1, pages.length - 1));
      if (e.key === "ArrowLeft") setCurrentPage((p) => Math.max(p - 1, 0));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, pages.length]);

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

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex items-center justify-center max-w-full max-h-[80vh]"
      >
        {loading && <div className="text-white">Loading report…</div>}

        {error && !loading && (
          <div className="text-white text-center max-w-md">
            <p className="mb-3">Could not load this report: {error}</p>
            <a href={pdfUrl} download className="underline">
              Try downloading it instead
            </a>
          </div>
        )}

        {!loading && !error && pages.length > 0 && (
          <>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
              disabled={currentPage === 0}
              className="absolute left-2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white disabled:opacity-20 transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={pages[currentPage]}
              alt={`${displayTitle} — page ${currentPage + 1}`}
              className="max-w-full max-h-[80vh] rounded-lg shadow-2xl bg-white"
            />

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, pages.length - 1))}
              disabled={currentPage === pages.length - 1}
              className="absolute right-2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white disabled:opacity-20 transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {!loading && !error && pages.length > 0 && (
        <div className="mt-3 text-white text-sm font-mono">
          {currentPage + 1} / {pages.length}
        </div>
      )}
    </div>
  );
}
