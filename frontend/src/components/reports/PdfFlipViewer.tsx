import { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface PdfFlipViewerProps {
  pdfUrl: string;
  eventTitle: string;
}

export default function PdfFlipViewer({ pdfUrl, eventTitle }: PdfFlipViewerProps) {
  const [pages, setPages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const flipBookRef = useRef<any>(null);
  const isFlipping = useRef(false);

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

  const handleWheel = (e: React.WheelEvent) => {
    if (isFlipping.current) return;
    isFlipping.current = true;

    const pageFlip = flipBookRef.current?.pageFlip();
    if (e.deltaY > 0) {
      pageFlip?.flipNext();
    } else {
      pageFlip?.flipPrev();
    }

    setTimeout(() => {
      isFlipping.current = false;
    }, 600);
  };

  if (loading) {
    return <div className="pdf-viewer-status">Loading report…</div>;
  }

  if (error) {
    return (
      <div className="pdf-viewer-status pdf-viewer-error">
        <p>Could not load this report: {error}</p>
        <a href={pdfUrl} download>
          Try downloading it instead
        </a>
      </div>
    );
  }

  return (
    <div className="pdf-flip-container" onWheel={handleWheel}>
      <HTMLFlipBook
        ref={flipBookRef}
        width={550}
        height={733}
        size="stretch"
        minWidth={315}
        maxWidth={1000}
        minHeight={420}
        maxHeight={1350}
        showCover={true}
        className="pdf-flip-book"
      >
        {pages.map((src, i) => (
          <div className="pdf-page" key={i}>
            <img src={src} alt={`${eventTitle} — page ${i + 1}`} />
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
}
