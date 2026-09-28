import React from 'react';
import { Dialogue, SoundEffect } from '../types/comic';

interface SpeechBubbleProps {
  dialogue: Dialogue;
  speakerColor?: string;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({ dialogue, speakerColor = '#3b82f6' }) => {
  const { speaker, text, type } = dialogue;

  if (type === 'shout') {
    return (
      <div className="relative inline-block max-w-[85%] z-20 animate-pulse-subtle filter drop-shadow-[2px_3px_0px_#000]">
        {/* Jagged / spiky background style for shouts */}
        <div className="bg-amber-300 border-2 border-black px-3 py-1.5 rounded-sm relative font-comic">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span
              className="text-[9px] font-black uppercase tracking-wider px-1 rounded text-white"
              style={{ backgroundColor: speakerColor }}
            >
              {speaker}
            </span>
            <span className="text-[9px] font-bold text-red-600 uppercase">SHOUT!</span>
          </div>
          <p className="text-xs sm:text-sm font-black text-black uppercase tracking-tight leading-tight">
            "{text}"
          </p>
        </div>
      </div>
    );
  }

  if (type === 'thought') {
    return (
      <div className="relative inline-block max-w-[85%] z-20">
        <div className="bg-sky-50 border-2 border-black rounded-3xl px-3.5 py-1.5 comic-shadow relative font-comic">
          <div className="flex items-center gap-1 mb-0.5">
            <span
              className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full text-white"
              style={{ backgroundColor: speakerColor }}
            >
              {speaker}
            </span>
            <span className="text-[9px] italic text-slate-500 font-sans">thinking...</span>
          </div>
          <p className="text-xs text-slate-800 italic leading-snug font-comic">
            "{text}"
          </p>
          {/* Cloud thought trailing circles */}
          <div className="absolute -bottom-2 left-4 w-2.5 h-2.5 bg-sky-50 border-2 border-black rounded-full" />
          <div className="absolute -bottom-3.5 left-2 w-1.5 h-1.5 bg-sky-50 border-2 border-black rounded-full" />
        </div>
      </div>
    );
  }

  if (type === 'whisper') {
    return (
      <div className="relative inline-block max-w-[85%] z-20">
        <div className="bg-slate-100/95 border-2 border-dashed border-slate-600 rounded-xl px-3 py-1 relative font-comic">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-[8px] font-semibold text-slate-600 uppercase">
              {speaker} (whispering)
            </span>
          </div>
          <p className="text-xs text-slate-600 italic leading-snug">
            "{text}"
          </p>
        </div>
      </div>
    );
  }

  // Standard Speech Balloon
  return (
    <div className="relative inline-block max-w-[85%] z-20">
      <div className="bg-white border-2 border-black rounded-2xl px-3 py-1.5 comic-shadow relative font-comic">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span
            className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded text-white"
            style={{ backgroundColor: speakerColor }}
          >
            {speaker}
          </span>
        </div>
        <p className="text-xs sm:text-[13px] text-black font-semibold leading-tight font-comic">
          "{text}"
        </p>

        {/* Comic speech bubble tail */}
        <div className="absolute -bottom-2 left-5 w-3 h-3 bg-white border-r-2 border-b-2 border-black transform rotate-45" />
      </div>
    </div>
  );
};

export const SFXDecal: React.FC<{ sfx: SoundEffect }> = ({ sfx }) => {
  const getStyleClass = () => {
    switch (sfx.style) {
      case 'explosive':
        return 'text-red-500 bg-yellow-400 rotate-[-8deg] scale-110';
      case 'zap':
        return 'text-cyan-400 bg-purple-900 rotate-[6deg]';
      case 'impact':
        return 'text-amber-300 bg-rose-900 rotate-[-12deg]';
      default:
        return 'text-yellow-400 bg-black/80 rotate-[3deg]';
    }
  };

  const getPositionClass = () => {
    switch (sfx.position) {
      case 'top-left':
        return 'top-2 left-2';
      case 'top-right':
        return 'top-2 right-2';
      case 'bottom-left':
        return 'bottom-2 left-2';
      case 'bottom-right':
        return 'bottom-2 right-2';
      case 'center':
      default:
        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
    }
  };

  return (
    <div className={`absolute z-20 pointer-events-none ${getPositionClass()}`}>
      <div
        className={`px-3 py-1 font-bangers text-lg sm:text-2xl tracking-wider border-2 border-black comic-shadow uppercase select-none transition-transform hover:scale-125 ${getStyleClass()}`}
        style={{
          textShadow: '2px 2px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000',
        }}
      >
        {sfx.text}
      </div>
    </div>
  );
};

export const NarrationBox: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="relative z-20 max-w-[90%]">
      <div className="bg-amber-100 border-2 border-black px-2.5 py-1.5 comic-shadow">
        <p className="text-[11px] sm:text-xs text-amber-950 font-bold font-comic tracking-wide leading-snug">
          {text}
        </p>
      </div>
    </div>
  );
};
