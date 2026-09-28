import React from 'react';
import { ComicStory, ComicPanel } from '../../types/comic';
import { ComicPanelCard } from '../ComicPanelCard';
import { Smartphone, ArrowDown } from 'lucide-react';

interface WebtoonReaderProps {
  comic: ComicStory;
  onEditPanel: (panel: ComicPanel) => void;
  onUpdatePanelImage: (panelNumber: number, imageUrl: string) => void;
}

export const WebtoonReader: React.FC<WebtoonReaderProps> = ({
  comic,
  onEditPanel,
  onUpdatePanelImage,
}) => {
  return (
    <div className="max-w-2xl mx-auto py-4">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 bg-cyan-950/80 text-cyan-300 text-xs px-3 py-1 rounded-full border border-cyan-500/30 mb-2">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Webtoon Vertical Mode</span>
        </div>
        <p className="text-xs text-slate-400 font-comic">
          Scroll down continuously to experience the story sequence
        </p>
      </div>

      <div className="space-y-8">
        {comic.panels.map((panel) => (
          <div key={panel.panelNumber} className="relative">
            <div className="w-full">
              <ComicPanelCard
                panel={panel}
                artStyle={comic.artStyle}
                characters={comic.characters}
                comicTitle={comic.title}
                onEditPanel={onEditPanel}
                onUpdatePanelImage={onUpdatePanelImage}
              />
            </div>
            {panel.panelNumber < comic.panels.length && (
              <div className="flex justify-center py-4 text-slate-600">
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center py-8 border-t-2 border-slate-800 mt-12">
        <span className="font-bangers text-2xl text-amber-400 tracking-wider">
          TO BE CONTINUED IN ISSUE #{parseInt(comic.issueNumber?.match(/\d+/)?.[0] || '1', 10) + 1}...
        </span>
      </div>
    </div>
  );
};
