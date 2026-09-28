import React, { useState } from 'react';
import { ComicStory, CharacterProfile } from '../types/comic';
import { Users, BookOpen, Sparkles, ChevronDown, ChevronUp, Palette, RefreshCw, Zap } from 'lucide-react';

interface ComicHeaderBannerProps {
  comic: ComicStory;
  onUpdateComic: (updated: Partial<ComicStory>) => void;
  onRegenerateWithStyle?: (newStyle: string, newTone: string) => void;
  isGenerating?: boolean;
}

const QUICK_STYLES = ['Comic Book', 'Anime', 'Pixel Art', 'Realistic'];
const QUICK_TONES = ['Cinematic & Thrilling', 'Witty & Comedic', 'Dark & Mysterious', 'Epic & Heroic'];

export const ComicHeaderBanner: React.FC<ComicHeaderBannerProps> = ({
  comic,
  onUpdateComic,
  onRegenerateWithStyle,
  isGenerating = false,
}) => {
  const [showCharacters, setShowCharacters] = useState(true);
  const [showSynopsis, setShowSynopsis] = useState(false);
  const [showReskinBar, setShowReskinBar] = useState(false);

  return (
    <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border-4 border-black comic-shadow-lg p-4 sm:p-6 mb-8 text-white rounded-none">
      {/* Halftone texture */}
      <div className="absolute inset-0 halftone-bg opacity-15 pointer-events-none" />

      {/* Comic Header Top Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-700/80 pb-4 mb-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="bg-amber-400 text-black font-bangers text-sm sm:text-base px-3 py-0.5 border-2 border-black comic-shadow uppercase">
            {comic.issueNumber || 'ISSUE #1'}
          </span>
          <span className="bg-rose-600 text-white font-black text-xs px-2.5 py-0.5 border-2 border-black comic-shadow uppercase">
            {comic.genre}
          </span>
          <span className="bg-slate-800 text-cyan-300 font-mono text-xs px-2.5 py-0.5 border border-cyan-500/30 rounded flex items-center gap-1">
            <Palette className="w-3 h-3 text-cyan-400" />
            {comic.artStyle}
          </span>
          {comic.setting && (
            <span className="hidden lg:inline-block bg-slate-800 text-slate-300 font-mono text-xs px-2.5 py-0.5 border border-slate-700 rounded">
              📍 {comic.setting}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onRegenerateWithStyle && (
            <button
              onClick={() => setShowReskinBar(!showReskinBar)}
              className="text-xs bg-amber-400 hover:bg-amber-300 text-black font-bold px-2.5 py-1 rounded border-2 border-black comic-shadow flex items-center gap-1 transition-transform active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reskin / Custom Tone</span>
            </button>
          )}

          <button
            onClick={() => setShowSynopsis(!showSynopsis)}
            className="text-xs bg-slate-800/80 hover:bg-slate-700 px-3 py-1 rounded border border-slate-600 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Synopsis</span>
            {showSynopsis ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setShowCharacters(!showCharacters)}
            className="text-xs bg-slate-800/80 hover:bg-slate-700 px-3 py-1 rounded border border-slate-600 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cast ({comic.characters.length})</span>
            {showCharacters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Quick Reskin Drawer */}
      {showReskinBar && onRegenerateWithStyle && (
        <div className="relative z-10 mb-4 p-3 bg-black/80 rounded border-2 border-amber-400/50 animate-fade-in text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> One-Click Style & Tone Reskin (Regenerates comic with new aesthetic)
            </span>
            <button
              onClick={() => setShowReskinBar(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-mono text-[11px]">Styles:</span>
            {QUICK_STYLES.map((style) => (
              <button
                key={style}
                disabled={isGenerating}
                onClick={() => onRegenerateWithStyle(style, comic.tone || 'Cinematic & Thrilling')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  comic.artStyle === style
                    ? 'bg-amber-400 text-black border border-black comic-shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                {style}
              </button>
            ))}

            <span className="text-slate-400 font-mono text-[11px] ml-2">Tones:</span>
            {QUICK_TONES.map((tone) => (
              <button
                key={tone}
                disabled={isGenerating}
                onClick={() => onRegenerateWithStyle(comic.artStyle || 'Comic Book', tone)}
                className={`px-2 py-1 rounded text-xs transition-all cursor-pointer ${
                  comic.tone === tone
                    ? 'bg-cyan-400 text-black font-bold border border-black'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Comic Title & Tagline */}
      <div className="relative z-10 my-2">
        <h1
          className="font-bangers text-4xl sm:text-6xl md:text-7xl tracking-wider text-amber-400 uppercase leading-none drop-shadow-[4px_4px_0px_#000]"
          style={{
            WebkitTextStroke: '1px black',
          }}
        >
          {comic.title}
        </h1>
        <p className="font-comic text-base sm:text-xl text-slate-200 font-bold mt-2 italic drop-shadow max-w-4xl">
          "{comic.tagline}"
        </p>
      </div>

      {/* Expandable Synopsis Drawer */}
      {showSynopsis && (
        <div className="relative z-10 mt-4 p-3.5 bg-black/60 rounded border-2 border-amber-400/40 animate-fade-in font-comic">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Story Synopsis
          </h4>
          <p className="text-sm text-slate-200 leading-relaxed">
            {comic.synopsis}
          </p>
        </div>
      )}

      {/* Expandable Cast of Characters Drawer */}
      {showCharacters && (
        <div className="relative z-10 mt-5 pt-4 border-t-2 border-slate-700/60">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bangers text-lg tracking-wider text-cyan-400 uppercase flex items-center gap-1.5">
              <Users className="w-4 h-4" /> Dramatis Personae (Character Dossiers)
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Generated by Gemini Story Engine
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {comic.characters.map((char: CharacterProfile, idx: number) => (
              <div
                key={idx}
                className="bg-black/75 border-2 border-black p-3 comic-shadow flex flex-col justify-between rounded-sm relative group hover:border-cyan-400 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black"
                        style={{ backgroundColor: char.signatureColor || '#06b6d4' }}
                      />
                      <h4 className="font-black text-sm text-white uppercase tracking-wide">
                        {char.name}
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-500/30 uppercase">
                      {char.role}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-comic leading-snug mb-2">
                    <strong className="text-slate-400 font-mono text-[10px] uppercase">Appearance: </strong>
                    {char.visualDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px]">
                  <p className="text-slate-400 italic font-comic">
                    <strong className="text-slate-500 font-sans not-italic text-[10px]">Trait: </strong>
                    {char.personality}
                  </p>
                  {char.catchphrase && (
                    <p className="text-cyan-300 font-bold font-comic mt-1 text-[11px] border-l-2 border-cyan-400 pl-1.5">
                      "{char.catchphrase}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
