import React, { useState, useEffect } from 'react';
import { ComicStory, ComicPanel } from '../../types/comic';
import { ComicArtPanel } from '../ComicArtPanel';
import { SpeechBubble, SFXDecal, NarrationBox } from '../ComicBubble';
import { ChevronLeft, ChevronRight, Play, Volume2, VolumeX, X, Maximize2, Loader2 } from 'lucide-react';
import { playPcmAudio, stopCurrentAudio } from '../../utils/audioPlayer';

interface CinematicReaderProps {
  comic: ComicStory;
  initialPanelIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePanelImage: (panelNumber: number, imageUrl: string) => void;
}

export const CinematicReader: React.FC<CinematicReaderProps> = ({
  comic,
  initialPanelIndex = 0,
  isOpen,
  onClose,
  onUpdatePanelImage,
}) => {
  if (!isOpen) return null;

  const [currentIndex, setCurrentIndex] = useState(initialPanelIndex);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(false);

  const panel: ComicPanel = comic.panels[currentIndex] || comic.panels[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, comic.panels.length]);

  const handleNext = () => {
    stopCurrentAudio();
    setIsPlayingAudio(false);
    if (currentIndex < comic.panels.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    stopCurrentAudio();
    setIsPlayingAudio(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handlePlayVoiceover = async () => {
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
          comicTitle: comic.title,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.audioBase64) {
        throw new Error(data.error || 'Failed to narrate');
      }

      setIsPlayingAudio(true);
      await playPcmAudio(data.audioBase64, 24000, () => {
        setIsPlayingAudio(false);
        if (autoAdvance && currentIndex < comic.panels.length - 1) {
          handleNext();
        }
      });
    } catch (err: any) {
      console.warn('Voice narration fallback:', err.message);
      if ('speechSynthesis' in window) {
        const text = `${panel.narration || ''} ${panel.dialogues.map((d) => `${d.speaker} says: ${d.text}`).join('. ')}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => {
          setIsPlayingAudio(false);
          if (autoAdvance && currentIndex < comic.panels.length - 1) {
            handleNext();
          }
        };
        setIsPlayingAudio(true);
        window.speechSynthesis.speak(utterance);
      }
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const getCharacterColor = (speakerName: string): string => {
    const char = comic.characters.find(
      (c) => c.name.toLowerCase() === speakerName.toLowerCase() || speakerName.toLowerCase().includes(c.name.toLowerCase())
    );
    return char?.signatureColor || '#3b82f6';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-3 sm:p-6 backdrop-blur-md">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between z-20 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="font-bangers text-2xl text-amber-400 tracking-wider">
            {comic.title}
          </span>
          <span className="hidden sm:inline-block text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
            {comic.issueNumber}
          </span>
          <span className="text-xs font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-500/40">
            Panel {currentIndex + 1} of {comic.panels.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayVoiceover}
            disabled={isLoadingAudio}
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-full border-2 border-black comic-shadow flex items-center gap-1.5 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isLoadingAudio ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : isPlayingAudio ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-amber-300" />
                <span>Stop Voiceover</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>Play Voiceover</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              stopCurrentAudio();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Cinematic Panel Viewport */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        <div className="relative w-full max-w-4xl h-full max-h-[75vh] bg-slate-900 border-4 border-black comic-shadow-lg flex flex-col justify-between overflow-hidden">
          {/* Top Narration */}
          {panel.narration && (
            <div className="absolute top-4 left-6 right-6 z-20 pointer-events-none">
              <NarrationBox text={panel.narration} />
            </div>
          )}

          {/* Visual Artwork */}
          <div className="absolute inset-0 z-0">
            <ComicArtPanel
              panel={panel}
              artStyle={comic.artStyle}
              onUpdateImage={(url) => onUpdatePanelImage(panel.panelNumber, url)}
            />
          </div>

          {/* Sound Effect */}
          {panel.sfx && <SFXDecal sfx={panel.sfx} />}

          {/* Floating Dialogue Speech Balloons */}
          <div className="relative z-20 mt-auto p-4 sm:p-6 flex flex-col gap-3 pointer-events-none">
            {panel.dialogues &&
              panel.dialogues.map((dlg, idx) => {
                const alignClass = dlg.balloonPosition?.includes('right')
                  ? 'self-end items-end text-right'
                  : 'self-start items-start text-left';
                return (
                  <div key={idx} className={`pointer-events-auto flex flex-col ${alignClass}`}>
                    <SpeechBubble
                      dialogue={dlg}
                      speakerColor={getCharacterColor(dlg.speaker)}
                    />
                  </div>
                );
              })}
          </div>
        </div>

        {/* Prev / Next Floating Arrows */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="absolute left-2 sm:left-6 z-30 p-2.5 sm:p-3 rounded-full bg-black/80 hover:bg-black text-amber-400 border-2 border-black comic-shadow disabled:opacity-20 transition-transform active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === comic.panels.length - 1}
          className="absolute right-2 sm:right-6 z-30 p-2.5 sm:p-3 rounded-full bg-black/80 hover:bg-black text-amber-400 border-2 border-black comic-shadow disabled:opacity-20 transition-transform active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Timeline Strip & Controls */}
      <div className="z-20 pt-2 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-[70vw]">
          {comic.panels.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                stopCurrentAudio();
                setIsPlayingAudio(false);
                setCurrentIndex(idx);
              }}
              className={`px-3 py-1 text-xs font-bangers rounded border-2 transition-all cursor-pointer ${
                idx === currentIndex
                  ? 'bg-amber-400 text-black border-black scale-105 comic-shadow'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              #{p.panelNumber}
            </button>
          ))}
        </div>

        <div className="text-[11px] text-slate-400 hidden sm:block font-mono">
          Press <kbd className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">Space</kbd> or <kbd className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">→</kbd> to advance
        </div>
      </div>
    </div>
  );
};
