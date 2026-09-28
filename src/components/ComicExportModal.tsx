import React, { useState, useRef } from 'react';
import { ComicStory } from '../types/comic';
import { X, Printer, Download, Upload, Copy, Check, FileJson, FileText, FileDown } from 'lucide-react';
import { generateComicPdf } from '../utils/pdfGenerator';

interface ComicExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  comic: ComicStory;
  onImportComic: (comic: ComicStory) => void;
}

export const ComicExportModal: React.FC<ComicExportModalProps> = ({
  isOpen,
  onClose,
  comic,
  onImportComic,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadPdf = () => {
    setIsExportingPdf(true);
    try {
      generateComicPdf(comic);
    } catch (err: any) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(comic, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${comic.title.replace(/\s+/g, '_')}.comiccraft.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(comic, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.title || !parsed.panels) {
          throw new Error('Invalid ComicCraft story JSON file.');
        }
        onImportComic(parsed);
        onClose();
      } catch (err: any) {
        setImportError(err.message || 'Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border-4 border-black comic-shadow-lg text-white my-8 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-amber-400 border-b-4 border-black text-black">
          <div className="flex items-center gap-2">
            <Download className="w-6 h-6" />
            <span className="font-bangers text-2xl tracking-wide">
              PUBLISH & EXPORT COMIC
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-black hover:text-white rounded transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 flex-1">
          <p className="text-xs text-slate-300 font-comic">
            Export <strong className="text-amber-400 font-sans">{comic.title}</strong> for printing, sharing, or archiving.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Direct Downloadable PDF */}
            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="bg-amber-500/15 p-4 border-2 border-amber-400 hover:bg-amber-500/25 rounded flex flex-col items-center justify-center text-center gap-2.5 group transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-amber-400 text-black flex items-center justify-center border-2 border-black comic-shadow group-hover:scale-110 transition-transform">
                <FileDown className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bangers text-base tracking-wide text-amber-300 group-hover:text-amber-200 block">
                  {isExportingPdf ? 'Compiling PDF...' : 'Download Comic PDF'}
                </span>
                <span className="text-[11px] text-slate-300 font-comic">
                  Complete A4 issue with cover & panels
                </span>
              </div>
            </button>

            {/* Print / Save to PDF */}
            <button
              onClick={handlePrint}
              className="bg-slate-950 p-4 border-2 border-slate-700 hover:border-amber-400 rounded flex flex-col items-center justify-center text-center gap-2.5 group transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center border border-amber-400/30 group-hover:scale-110 transition-transform">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bangers text-base tracking-wide text-white group-hover:text-amber-300 block">
                  Print Layout
                </span>
                <span className="text-[11px] text-slate-400 font-comic">
                  Native browser print dialog
                </span>
              </div>
            </button>

            {/* Download JSON */}
            <button
              onClick={handleDownloadJson}
              className="bg-slate-950 p-4 border-2 border-slate-700 hover:border-cyan-400 rounded flex flex-col items-center justify-center text-center gap-2.5 group transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-cyan-400/10 text-cyan-400 flex items-center justify-center border border-cyan-400/30 group-hover:scale-110 transition-transform">
                <FileJson className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bangers text-base tracking-wide text-white group-hover:text-cyan-300 block">
                  Download Project JSON
                </span>
                <span className="text-[11px] text-slate-400 font-comic">
                  Full backup with scripts & prompts
                </span>
              </div>
            </button>

            {/* Copy JSON */}
            <button
              onClick={handleCopyJson}
              className="bg-slate-950 p-4 border-2 border-slate-700 hover:border-purple-400 rounded flex flex-col items-center justify-center text-center gap-2.5 group transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-purple-400/10 text-purple-400 flex items-center justify-center border border-purple-400/30 group-hover:scale-110 transition-transform">
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </div>
              <div>
                <span className="font-bangers text-base tracking-wide text-white group-hover:text-purple-300 block">
                  {copied ? 'Copied to Clipboard!' : 'Copy Comic JSON'}
                </span>
                <span className="text-[11px] text-slate-400 font-comic">
                  For sharing or API pipelines
                </span>
              </div>
            </button>

            {/* Import JSON */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-slate-950 p-4 border-2 border-slate-700 hover:border-emerald-400 rounded flex flex-col items-center justify-center text-center gap-2.5 group transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-400/10 text-emerald-400 flex items-center justify-center border border-emerald-400/30 group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bangers text-base tracking-wide text-white group-hover:text-emerald-300 block">
                  Import Comic Project
                </span>
                <span className="text-[11px] text-slate-400 font-comic">
                  Load .comiccraft.json file
                </span>
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {importError && (
            <p className="text-xs text-rose-400 bg-rose-950/70 p-2.5 rounded border border-rose-500/40">
              {importError}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t-2 border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-300 hover:text-white"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
