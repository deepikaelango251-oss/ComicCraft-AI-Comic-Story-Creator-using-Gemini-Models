import React from 'react';
import { ComicStory, ComicPanel } from '../../types/comic';
import { ComicPanelCard } from '../ComicPanelCard';
import { Sparkles, Plus } from 'lucide-react';

interface ComicGridSpreadProps {
  comic: ComicStory;
  onEditPanel: (panel: ComicPanel) => void;
  onUpdatePanelImage: (panelNumber: number, imageUrl: string) => void;
  onAddNewPanel: () => void;
}

export const ComicGridSpread: React.FC<ComicGridSpreadProps> = ({
  comic,
  onEditPanel,
  onUpdatePanelImage,
  onAddNewPanel,
}) => {
  return (
    <div className="relative">
      {/* Comic Book Page Container with Gutter Margins */}
      <div className="bg-amber-50/5 p-4 sm:p-6 md:p-8 border-4 border-black comic-shadow-lg relative overflow-hidden">
        {/* Halftone Page Background */}
        <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none" />

        {/* Comic Issue Footer Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-slate-700 text-xs font-mono text-slate-400">
          <span className="uppercase font-bold tracking-wider text-amber-400">
            {comic.title} • PAGE 1 OF 1
          </span>
          <span className="hidden sm:inline">
            COMICCRAFT PRESS • {comic.issueNumber}
          </span>
        </div>

        {/* Dynamic Responsive Comic Panels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative z-10">
          {comic.panels.map((panel) => (
            <ComicPanelCard
              key={panel.panelNumber}
              panel={panel}
              artStyle={comic.artStyle}
              characters={comic.characters}
              comicTitle={comic.title}
              onEditPanel={onEditPanel}
              onUpdatePanelImage={onUpdatePanelImage}
            />
          ))}
        </div>

        {/* Add Panel Action Footer */}
        <div className="mt-6 pt-4 border-t-2 border-slate-700/60 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 font-comic italic">
            * Click any panel to open the Director Suite and modify dialogues, SFX, or artwork.
          </div>
          <button
            onClick={onAddNewPanel}
            className="bg-slate-800 hover:bg-slate-700 text-amber-300 border-2 border-amber-400/50 hover:border-amber-400 text-xs font-bangers tracking-wider px-3.5 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Panel #{comic.panels.length + 1}
          </button>
        </div>
      </div>
    </div>
  );
};
