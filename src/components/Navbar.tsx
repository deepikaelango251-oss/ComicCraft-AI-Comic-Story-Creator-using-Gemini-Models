import React from 'react';
import { BookOpen, LayoutGrid, Smartphone, FileText, Download, Plus, Sparkles, FolderArchive, Play } from 'lucide-react';

export type ViewMode = 'grid' | 'webtoon' | 'script';

interface NavbarProps {
  viewMode: ViewMode;
  onSelectViewMode: (mode: ViewMode) => void;
  onOpenCinematic: () => void;
  onOpenLibrary: () => void;
  onOpenExport: () => void;
  onOpenPythonHub: () => void;
  onOpenJsonApi: () => void;
  onDownloadPdf: () => void;
  onScrollToCreate: () => void;
  savedComicsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  onSelectViewMode,
  onOpenCinematic,
  onOpenLibrary,
  onOpenExport,
  onOpenPythonHub,
  onOpenJsonApi,
  onDownloadPdf,
  onScrollToCreate,
  savedComicsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b-4 border-black comic-shadow px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onScrollToCreate}>
          <div className="relative">
            <div className="bg-amber-400 text-black font-bangers text-2xl px-2.5 py-0.5 border-2 border-black comic-shadow transform -rotate-3 hover:rotate-0 transition-transform">
              COMIC
            </div>
            <div className="absolute -bottom-1 -right-2 bg-rose-600 text-white font-bangers text-xs px-1.5 py-0.2 border border-black transform rotate-6">
              CRAFT
            </div>
          </div>
          <div>
            <h1 className="font-bangers text-xl sm:text-2xl text-white tracking-wider flex items-center gap-1.5">
              <span>COMICCRAFT</span>
              <span className="hidden md:inline-block text-[10px] font-mono font-normal text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/30">
                GEMINI AI
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-comic hidden sm:block">
              AI Story & Comic Book Studio
            </p>
          </div>
        </div>

        {/* View Layout Switcher */}
        <div className="flex items-center bg-slate-900 border-2 border-slate-700 p-0.5 rounded">
          <button
            onClick={() => onSelectViewMode('grid')}
            title="Classic Comic Page Grid"
            className={`px-2.5 py-1 text-xs font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-amber-400 text-black comic-shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Comic Page</span>
          </button>

          <button
            onClick={() => onSelectViewMode('webtoon')}
            title="Vertical Webtoon Scroll"
            className={`px-2.5 py-1 text-xs font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'webtoon'
                ? 'bg-amber-400 text-black comic-shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Webtoon</span>
          </button>

          <button
            onClick={() => onSelectViewMode('script')}
            title="Screenplay & Storyboard Breakdown"
            className={`px-2.5 py-1 text-xs font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'script'
                ? 'bg-amber-400 text-black comic-shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Script</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Cinematic Reader Button */}
          <button
            onClick={onOpenCinematic}
            title="Open Fullscreen Cinematic Reader"
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded border-2 border-black comic-shadow flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Cinematic Reader</span>
          </button>

          {/* Fast PDF Download */}
          <button
            onClick={onDownloadPdf}
            title="Download Complete Comic Book PDF"
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded border-2 border-black comic-shadow flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PDF</span>
          </button>

          {/* Python & FastAPI Hub */}
          <button
            onClick={onOpenPythonHub}
            title="View FastAPI, Stable Diffusion & FPDF Architecture"
            className="bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-mono font-bold px-2.5 py-1.5 rounded border border-amber-400/40 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="hidden lg:inline">FastAPI Hub</span>
            <span className="lg:hidden">API</span>
          </button>

          {/* JSON API Console for Developers */}
          <button
            onClick={onOpenJsonApi}
            title="Open JSON API Developer Playground"
            className="bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono font-bold px-2.5 py-1.5 rounded border border-cyan-400/40 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="hidden lg:inline">JSON API</span>
            <span className="lg:hidden">JSON</span>
          </button>

          {/* Library / Vault */}
          <button
            onClick={onOpenLibrary}
            title="Saved Comics Vault"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FolderArchive className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Vault</span>
            <span className="bg-slate-900 text-amber-400 px-1.5 py-0.2 rounded text-[10px] font-mono">
              {savedComicsCount}
            </span>
          </button>

          {/* Export / Print */}
          <button
            onClick={onOpenExport}
            title="Print or Export Comic"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Create New Story */}
          <button
            onClick={onScrollToCreate}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bangers text-sm sm:text-base tracking-wide px-3 sm:px-4 py-1 border-2 border-black comic-shadow flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>CREATE</span>
          </button>
        </div>
      </div>
    </header>
  );
};
