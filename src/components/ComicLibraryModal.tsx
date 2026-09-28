import React from 'react';
import { ComicStory } from '../types/comic';
import { X, BookOpen, Trash2, Calendar, Layers, Sparkles } from 'lucide-react';

interface ComicLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedComics: ComicStory[];
  currentComicId: string;
  onSelectComic: (comic: ComicStory) => void;
  onDeleteComic: (comicId: string) => void;
  onLoadSample: () => void;
}

export const ComicLibraryModal: React.FC<ComicLibraryModalProps> = ({
  isOpen,
  onClose,
  savedComics,
  currentComicId,
  onSelectComic,
  onDeleteComic,
  onLoadSample,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border-4 border-black comic-shadow-lg text-white my-8 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-amber-400 border-b-4 border-black text-black">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            <span className="font-bangers text-2xl tracking-wide">
              MY COMIC BOOK VAULT ({savedComics.length})
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
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-400 font-comic">
              All comics saved locally in your browser session.
            </p>
            <button
              onClick={onLoadSample}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
            >
              + Restore Chrono Barista Sample
            </button>
          </div>

          {savedComics.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-400">Your comic vault is empty.</p>
              <p className="text-xs text-slate-500 mt-1">
                Create a story using the generator to save it here!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedComics.map((comic) => {
                const isSelected = comic.id === currentComicId;
                return (
                  <div
                    key={comic.id}
                    onClick={() => {
                      onSelectComic(comic);
                      onClose();
                    }}
                    className={`bg-slate-950 p-4 border-2 comic-shadow rounded flex flex-col justify-between cursor-pointer group transition-all ${
                      isSelected
                        ? 'border-amber-400 ring-2 ring-amber-400/40'
                        : 'border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30 uppercase">
                          {comic.genre}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                          <Layers className="w-3 h-3" />
                          <span>{comic.panels.length} panels</span>
                        </div>
                      </div>

                      <h3 className="font-bangers text-xl text-white group-hover:text-amber-300 tracking-wide line-clamp-1 mb-1">
                        {comic.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-comic italic line-clamp-2 mb-3">
                        "{comic.tagline || comic.synopsis}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3" />
                        {new Date(comic.createdAt || Date.now()).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <span className="text-amber-400 font-bold text-[10px] uppercase">
                            Active
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteComic(comic.id);
                          }}
                          title="Delete comic from vault"
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t-2 border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-300 hover:text-white"
          >
            Close Vault
          </button>
        </div>
      </div>
    </div>
  );
};
