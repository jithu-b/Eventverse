import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import HTMLFlipBook from 'react-pageflip';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface PdfFlipViewerProps {
  pdfUrl: string;
  title: string;
  onClose: () => void;
}

const Page = React.forwardRef<HTMLDivElement, { imgSrc: string; pageNum: number }>(
  ({ imgSrc, pageNum }, ref) => (
    <div ref={ref} className="bg-white flex items-center justify-center overflow-hidden shadow-inner">
      <img src={imgSrc} alt={`Page ${pageNum}`} className="w-full h-full object-contain select-none" draggable={false} />
    </div>
  )
);

export const PdfFlipViewer: React.FC<PdfFlipViewerProps> = ({ pdfUrl, title, onClose }) => {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const bookRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      try {
        setLoading(true);
        setError('');
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const imgs: string[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) continue;
          await page.render({ canvasContext: ctx, viewport }).promise;
          imgs.push(canvas.toDataURL('image/jpeg', 0.85));
        }
        if (!cancelled) setPages(imgs);
      } catch (err) {
        console.error('Error rendering PDF:', err);
        if (!cancelled) setError('Could not load this report. Try downloading it instead.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    render();
    return () => {
      cancelled = true;
    };
  }, [pdfUrl]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl flex items-center justify-between mb-4">
        <h2 className="text-white font-bold text-lg truncate pr-4">{title}</h2>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={pdfUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-colors"
          >
            <Download className="w-4 h-4" /> Download
          </a>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-white flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white" />
          <p>Preparing report...</p>
        </div>
      )}

      {!loading && error && <p className="text-white">{error}</p>}

      {!loading && !error && pages.length > 0 && (
        <div className="flex items-center gap-2 sm:gap-4 w-full justify-center">
          <button
            onClick={() => bookRef.current?.pageFlip()?.flipPrev()}
            className="hidden sm:flex w-10 h-10 items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <HTMLFlipBook
            ref={bookRef}
            width={340}
            height={480}
            size="stretch"
            minWidth={280}
            maxWidth={520}
            minHeight={400}
            maxHeight={700}
            showCover={true}
            mobileScrollSupport={true}
            className="shadow-2xl"
          >
            {pages.map((src, i) => (
              <Page key={i} imgSrc={src} pageNum={i + 1} />
            ))}
          </HTMLFlipBook>

          <button
            onClick={() => bookRef.current?.pageFlip()?.flipNext()}
            className="hidden sm:flex w-10 h-10 items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white shrink-0"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
