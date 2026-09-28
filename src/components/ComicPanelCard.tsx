import React, { useState } from 'react';
import { ComicPanel, CharacterProfile } from '../types/comic';
import { ComicArtPanel } from './ComicArtPanel';
import { SpeechBubble, SFXDecal, NarrationBox } from './ComicBubble';
import { Volume2, VolumeX, Edit3, Loader2 } from 'lucide-react';
import { playPcmAudio, stopCurrentAudio } from '../utils/audioPlayer';

interface ComicPanelCardProps {
  panel: ComicPanel;
  artStyle: string;
  characters: CharacterProfile[];
  comicTitle: string;
  onEditPanel: (panel: ComicPanel) => void;
  onUpdatePanelImage: (panelNumber: number, imageUrl: string) => void;
}

export const ComicPanelCard: React.FC<ComicPanelCardProps> = ({
  panel,
  artStyle,
  characters,
  comicTitle,
  onEditPanel,
  onUpdatePanelImage,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const getCharacterColor = (speakerName: string): string => {
    const char = characters.find(
      (c) => c.name.toLowerCase() === speakerName.toLowerCase() || speakerName.toLowerCase().includes(c.name.toLowerCase())
    );
    return char?.signatureColor || '#3b82f6';
  };

  const handlePlayVoiceover = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isPlayingAudio) {
      stopCurrentAudio();
      setIsPlayingAudio(false);
      return;
    }

    setIsLoadingAudio(true);
    try {
      const res = await fetch('/api/comic/narrate-panel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          narrationText: panel.narration,
          dialogues: panel.dialogues,
          comicTitle,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.audioBase64) {
        throw new Error(data.error || 'Failed to generate voiceover');
      }

      setIsPlayingAudio(true);
      await playPcmAudio(data.audioBase64, 24000, () => {
        setIsPlayingAudio(false);
      });
    } catch (err: any) {
      console.warn('Voice narration error:', err.message);
      // Fallback to browser SpeechSynthesis if Gemini TTS endpoint is unavailable or fails
      if ('speechSynthesis' in window) {
        const text = `${panel.narration || ''} ${panel.dialogues.map((d) => `${d.speaker} says: ${d.text}`).join('. ')}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsPlayingAudio(false);
        setIsPlayingAudio(true);
        window.speechSynthesis.speak(utterance);
      }
    } finally {
      setIsLoadingAudio(false);
    }
  };

  // Determine grid span class
  const getSpanClass = () => {
    switch (panel.layoutSpan) {
      case 'wide':
        return 'md:col-span-2 md:row-span-1 min-h-[320px]';
      case 'tall':
        return 'md:col-span-1 md:row-span-2 min-h-[460px]';
      case 'splash':
        return 'md:col-span-2 md:row-span-2 min-h-[420px]';
      case 'single':
      default:
        return 'md:col-span-1 md:row-span-1 min-h-[300px]';
    }
  };

  return (
    <div
      onClick={() => onEditPanel(panel)}
      className={`relative bg-white border-4 border-black comic-shadow flex flex-col justify-between overflow-hidden cursor-pointer group hover:border-amber-400 transition-colors ${getSpanClass()}`}
    >
      {/* Panel Number Corner Tab */}
      <div className="absolute top-0 left-0 z-30 bg-black text-white text-[11px] font-black font-bangers px-2.5 py-0.5 border-r-2 border-b-2 border-white/20 tracking-wider">
        #{panel.panelNumber}
      </div>

      {/* Top Narration Caption Box if present */}
      {panel.narration && (
        <div className="absolute top-2 left-10 right-16 z-20 pointer-events-none">
          <NarrationBox text={panel.narration} />
        </div>
      )}

      {/* Visual Artwork Background */}
      <div className="absolute inset-0 z-0">
        <ComicArtPanel
          panel={panel}
          artStyle={artStyle}
          onUpdateImage={(url) => onUpdatePanelImage(panel.panelNumber, url)}
        />
      </div>

      {/* Sound Effect Decal */}
      {panel.sfx && <SFXDecal sfx={panel.sfx} />}

      {/* Dialogue Speech Bubbles (Floating in lower / mid area) */}
      <div className="relative z-20 mt-auto p-3 flex flex-col gap-2 pointer-events-none">
        {panel.dialogues &&
          panel.dialogues.map((dialogue, idx) => {
            const alignClass =
              dialogue.balloonPosition?.includes('right')
                ? 'self-end items-end text-right'
                : 'self-start items-start text-left';
            return (
              <div key={idx} className={`pointer-events-auto flex flex-col ${alignClass}`}>
                <SpeechBubble
                  dialogue={dialogue}
                  speakerColor={getCharacterColor(dialogue.speaker)}
                />
              </div>
            );
          })}
      </div>

      {/* Hover Action Bar: Voiceover & Edit */}
      <div className="absolute bottom-2 right-2 z-30 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handlePlayVoiceover}
          disabled={isLoadingAudio}
          title="Play comic voiceover narration (Gemini TTS)"
          className="bg-purple-600 hover:bg-purple-500 text-white p-1.5 rounded-full border-2 border-black comic-shadow transition-transform active:scale-90 disabled:opacity-50"
        >
          {isLoadingAudio ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : isPlayingAudio ? (
            <VolumeX className="w-3.5 h-3.5 text-amber-300" />
          ) : (
            <Volume2 className="w-3.5 h-3.5" />
          )}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEditPanel(panel);
          }}
          title="Direct panel (Edit dialogue, narration, SFX, prompts)"
          className="bg-amber-400 hover:bg-amber-300 text-black p-1.5 rounded-full border-2 border-black comic-shadow transition-transform active:scale-90"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
