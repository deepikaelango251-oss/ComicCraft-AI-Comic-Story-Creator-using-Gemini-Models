import React, { useState } from 'react';
import { ComicPanel } from '../types/comic';
import { Sparkles, Loader2, ImagePlus, RefreshCw, ZoomIn } from 'lucide-react';

interface ComicArtPanelProps {
  panel: ComicPanel;
  artStyle: string;
  onUpdateImage: (imageUrl: string) => void;
  isCover?: boolean;
}

export const ComicArtPanel: React.FC<ComicArtPanelProps> = ({
  panel,
  artStyle,
  onUpdateImage,
  isCover = false,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPromptDetails, setShowPromptDetails] = useState(false);

  const handleGenerateArt = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/comic/generate-panel-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: panel.imagePrompt,
          artStyle,
          aspectRatio: panel.layoutSpan === 'wide' ? '16:9' : panel.layoutSpan === 'tall' ? '3:4' : '4:3',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Could not generate panel image.');
      }

      onUpdateImage(data.imageUrl);
    } catch (err: any) {
      console.warn('Image generation notification:', err.message);
      setErrorMsg(err.message || 'Image generation limit reached. Using dynamic graphic art.');
    } finally {
      setIsGenerating(false);
    }
  };

  const primaryColor = panel.sceneMood?.primaryColor || '#1e1b4b';
  const secondaryColor = panel.sceneMood?.secondaryColor || '#f97316';
  const keyProp = panel.sceneMood?.keyPropOrFeature || panel.setting;

  return (
    <div className="relative w-full h-full min-h-[220px] overflow-hidden select-none bg-slate-900 group">
      {panel.imageUrl ? (
        <div className="relative w-full h-full">
          <img
            src={panel.imageUrl}
            alt={panel.actionDescription}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Subtle Halftone Overlay for authentic print feel */}
          <div className="absolute inset-0 halftone-bg opacity-25 pointer-events-none" />
        </div>
      ) : (
        /* Stylized Dynamic Comic Illustration Composition (SVG + CSS Vector Art) */
        <div
          className="relative w-full h-full flex flex-col justify-between p-4"
          style={{
            background: `radial-gradient(ellipse at 50% 30%, ${secondaryColor}33 0%, ${primaryColor} 100%)`,
          }}
        >
          {/* Comic Speed Lines / Sunburst */}
          <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={`burst-${panel.panelNumber}`} width="100%" height="100%" patternUnits="userSpaceOnUse">
                {Array.from({ length: 16 }).map((_, i) => (
                  <line
                    key={i}
                    x1="50%"
                    y1="50%"
                    x2={`${50 + 60 * Math.cos((i * Math.PI) / 8)}%`}
                    y2={`${50 + 60 * Math.sin((i * Math.PI) / 8)}%`}
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeDasharray="4 8"
                  />
                ))}
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#burst-${panel.panelNumber})`} />
          </svg>

          {/* Halftone texture */}
          <div className="absolute inset-0 halftone-bg opacity-20 pointer-events-none" />

          {/* Setting, Beat Title & Camera Badge */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5">
              <span className="bg-black/80 backdrop-blur-xs text-amber-300 border border-amber-400/40 text-[10px] font-mono px-2 py-0.5 rounded tracking-wide uppercase">
                {panel.cameraAngle}
              </span>
              {panel.beatTitle && (
                <span className="bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 text-[9px] font-mono px-1.5 py-0.5 rounded">
                  {panel.beatTitle}
                </span>
              )}
            </div>
            <span className="text-[10px] font-mono text-slate-300 bg-slate-950/70 px-2 py-0.5 rounded border border-white/10">
              {artStyle} • {panel.timeOfDay || 'Scene'}
            </span>
          </div>

          {/* Central Dramatic Visual Scene Staging */}
          <div className="relative z-10 my-auto text-center flex flex-col items-center justify-center p-2">
            {/* Dramatic Hero Silhouette & Lighting */}
            <div className="relative my-2">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-black comic-shadow"
                style={{ backgroundColor: secondaryColor }}
              >
                <span className="text-2xl font-bangers text-white drop-shadow">
                  {panel.panelNumber}
                </span>
              </div>
              <div className="absolute -inset-2 rounded-full blur-md opacity-40 -z-10" style={{ backgroundColor: secondaryColor }} />
            </div>

            <p className="text-xs font-bold text-white max-w-xs line-clamp-2 drop-shadow font-comic mt-1">
              "{keyProp}"
            </p>
            <p className="text-[11px] text-slate-300 italic max-w-sm line-clamp-2 mt-0.5 leading-snug">
              {panel.actionDescription}
            </p>
          </div>

          {/* Characters Present Footnote */}
          {panel.charactersPresent && panel.charactersPresent.length > 0 && (
            <div className="relative z-10 flex flex-wrap gap-1 items-center justify-center mt-1">
              {panel.charactersPresent.map((char, idx) => (
                <span
                  key={idx}
                  className="bg-black/70 text-slate-200 text-[9px] font-medium px-1.5 py-0.2 rounded border border-white/10"
                >
                  {char}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Action Overlay (Generate Art / View Prompt) */}
      <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleGenerateArt}
          disabled={isGenerating}
          title="Generate AI Illustration for this panel using Gemini"
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 border-2 border-black comic-shadow transition-transform active:scale-95 disabled:opacity-60 cursor-pointer"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Inking...</span>
            </>
          ) : panel.imageUrl ? (
            <>
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Redraw</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-slate-900" />
              <span>Generate Art</span>
            </>
          )}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowPromptDetails(!showPromptDetails);
          }}
          title="View art director prompt"
          className="bg-slate-900/80 hover:bg-slate-950 text-white text-[11px] p-1.5 rounded-full border border-white/20 transition-colors"
        >
          <ZoomIn className="w-3 h-3" />
        </button>
      </div>

      {/* Art Prompt Drawer Modal/Card */}
      {showPromptDetails && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-0 bg-slate-950/95 backdrop-blur-md p-4 z-30 flex flex-col justify-between text-left overflow-y-auto animate-fade-in"
        >
          <div>
            <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-2">
              <span className="font-bangers text-amber-400 tracking-wider text-sm flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Art Director Prompt
              </span>
              <button
                onClick={() => setShowPromptDetails(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded bg-slate-800"
              >
                Close
              </button>
            </div>
            <p className="text-xs text-slate-200 font-mono leading-relaxed bg-black/60 p-2.5 rounded border border-slate-800">
              {panel.imagePrompt}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-slate-400">
              <span className="bg-slate-800 px-2 py-0.5 rounded">Style: {artStyle}</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded">Angle: {panel.cameraAngle}</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded">Lighting: {panel.sceneMood?.lightingTone}</span>
            </div>
          </div>
          <button
            onClick={handleGenerateArt}
            disabled={isGenerating}
            className="w-full mt-3 bg-amber-400 hover:bg-amber-300 text-black font-bold py-1.5 rounded text-xs comic-border"
          >
            {isGenerating ? 'Generating Illustration...' : 'Render with Gemini Flash'}
          </button>
        </div>
      )}

      {/* Error notification badge */}
      {errorMsg && (
        <div className="absolute bottom-2 left-2 right-2 bg-rose-950/90 text-rose-200 text-[10px] p-1.5 rounded border border-rose-500/50 flex items-center justify-between z-20">
          <span className="truncate">{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="ml-2 font-bold hover:text-white">✕</button>
        </div>
      )}
    </div>
  );
};
