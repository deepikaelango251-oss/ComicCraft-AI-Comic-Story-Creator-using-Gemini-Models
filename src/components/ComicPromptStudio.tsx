import React, { useState } from 'react';
import { ComicGenerateParams } from '../types/comic';
import { Sparkles, Wand2, Palette, Film, Users, Zap, Layers, Lightbulb, MapPin, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ComicPromptStudioProps {
  onGenerate: (params: ComicGenerateParams) => Promise<void>;
  isGenerating: boolean;
}

const INSPIRATION_PRESETS = [
  {
    title: 'Cat Detective Neo-Tokyo',
    prompt: 'A detective who can secretly hear the thoughts of stray alley cats to solve cyber-heists.',
    characterName: 'Detective Ren Vance',
    setting: 'Neo-Tokyo Alleyways & Ramen Bars',
    tone: 'Dark & Mysterious',
    artStyle: '90s Dark Comic Book (Inked & Gritty)',
    genre: 'Dark Noir Mystery',
  },
  {
    title: 'Dragon Bakery Paris',
    prompt: 'A giant clumsy dragon tries to open an artisanal pastry bakery without burning croissants.',
    characterName: 'Ignis the Dragon Chef',
    setting: '1920s Parisian Cobblestone Bakery',
    tone: 'Witty & Comedic',
    artStyle: 'Indie Webcomic',
    genre: 'Slice-of-Life Comedy',
  },
  {
    title: 'Chrono Barista',
    prompt: 'An espresso machine pulls temporal anomalies whenever pulled at exactly 15 bars of pressure.',
    characterName: 'Maya Vance',
    setting: 'The Rusty Portafilter Café, Lower Sector',
    tone: 'Cinematic & Thrilling',
    artStyle: 'Modern Graphic Novel',
    genre: 'Sci-Fi Cyberpunk',
  },
  {
    title: 'Superhero Elevator Trap',
    prompt: 'The city\'s greatest superhero and their arch-nemesis get trapped in a broken office elevator for 4 hours.',
    characterName: 'Apex & Dr. Malice',
    setting: 'Stuck Freight Elevator, 88th Floor',
    tone: 'Witty & Comedic',
    artStyle: 'Classic Silver Age 1960s (Ben-Day Dots)',
    genre: 'Superhero Action',
  },
  {
    title: 'Haunted 1999 Arcade',
    prompt: 'An arcade wizard discovers the final boss of a retro beat-em-up is a trapped digital soul.',
    characterName: 'Kira "Pixel" Tanaka',
    setting: 'Neon Arcade Alley, 1999',
    tone: 'Epic & Heroic',
    artStyle: 'Vibrant Japanese Manga / Anime',
    genre: 'Retro Pop-Art',
  },
];

const ART_STYLES = [
  'Comic Book',
  'Anime',
  'Pixel Art',
  'Realistic',
  'Modern Graphic Novel',
  'Noir Inked',
];

const TONES = [
  'Cinematic & Thrilling',
  'Witty & Comedic',
  'Dark & Mysterious',
  'Epic & Heroic',
  'Lighthearted & Cozy',
  'Surreal & Mind-Bending',
];

const SETTINGS_SUGGESTIONS = [
  'Neo-Tokyo Neon Cyber District',
  'Vintage 1920s Parisian Café',
  'Underground Secret Lab',
  'Cosmic Space Station on Titan',
  'Haunted Midnight Victorian Manor',
  'Bustling City Rooftops at Dusk',
];

const CREATION_STEPS = [
  'Stage 1: Gemini Flash generating structured 5-panel comic outline...',
  'Stage 2: Gemini Pro developing rich character dialogues & narration...',
  'Stage 3: Synthesizing Stable Diffusion comic illustration prompts...',
  'Stage 4: Organizing panels in layout builder with speech bubbles & SFX...',
  'Stage 5: Finalizing PDF export and printable comic preview...',
];

export const ComicPromptStudio: React.FC<ComicPromptStudioProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [setting, setSetting] = useState('');
  const [tone, setTone] = useState('Cinematic & Thrilling');
  const [artStyle, setArtStyle] = useState('Comic Book');
  const [genre, setGenre] = useState('Sci-Fi Cyberpunk');
  const [panelCount, setPanelCount] = useState<number>(5); // Default 5-panel comic outline
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  React.useEffect(() => {
    if (!isGenerating) {
      setLoadingStepIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStepIndex((prev) => (prev + 1) % CREATION_STEPS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      await onGenerate({
        prompt: prompt.trim(),
        characterName: characterName.trim() || undefined,
        setting: setting.trim() || undefined,
        genre,
        artStyle,
        tone,
        panelCount,
      });

      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ec4899', '#06b6d4', '#10b981'],
      });
    } catch {
      // Handled in parent
    }
  };

  const handleApplyPreset = (preset: typeof INSPIRATION_PRESETS[0]) => {
    setPrompt(preset.prompt);
    setCharacterName(preset.characterName);
    setSetting(preset.setting);
    setTone(preset.tone);
    setArtStyle(preset.artStyle);
    setGenre(preset.genre);
  };

  return (
    <div className="relative bg-slate-900 border-4 border-black comic-shadow-lg p-4 sm:p-7 text-white mb-8">
      {/* Halftone texture */}
      <div className="absolute inset-0 halftone-bg opacity-15 pointer-events-none" />

      {/* ComicCraft Architecture Pipeline Banner */}
      <div className="relative z-10 mb-6 bg-slate-950 p-3 sm:p-4 rounded border-2 border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bangers text-xs sm:text-sm text-amber-400 tracking-wider flex items-center gap-1.5 uppercase">
            <Zap className="w-3.5 h-3.5" /> Project Workflow Pipeline
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            Gemini Flash → Gemini Pro → Stable Diffusion → Layout → PDF
          </span>
        </div>

        {/* Visual Pipeline Flow */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-[10px] font-mono text-center">
          <div className="bg-slate-900 p-1.5 rounded border border-amber-400/40 text-amber-300">
            1. User Input
          </div>
          <div className="bg-slate-900 p-1.5 rounded border border-cyan-400/40 text-cyan-300">
            2. Gemini Flash (5-Panel Outline)
          </div>
          <div className="bg-slate-900 p-1.5 rounded border border-purple-400/40 text-purple-300">
            3. Gemini Pro (Story & Dialogue)
          </div>
          <div className="bg-slate-900 p-1.5 rounded border border-rose-400/40 text-rose-300">
            4. Stable Diffusion (Images)
          </div>
          <div className="bg-slate-900 p-1.5 rounded border border-emerald-400/40 text-emerald-300">
            5. Layout Builder
          </div>
          <div className="bg-slate-900 p-1.5 rounded border border-yellow-400/40 text-yellow-300">
            6. PDF Export
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-5 border-b-2 border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-amber-400 text-black border-2 border-black flex items-center justify-center font-bangers text-xl comic-shadow">
            CC
          </div>
          <div>
            <h2 className="font-bangers text-2xl sm:text-3xl text-amber-400 tracking-wider">
              COMIC STORY STUDIO
            </h2>
            <p className="text-xs text-slate-300 font-comic">
              Enter your prompt, character, setting, tone, and art style to generate a complete comic story
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-500/30 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          5-Panel Comic Outline System
        </span>
      </div>

      {/* Inspiration Quick-Fill Chips */}
      <div className="relative z-10 mb-5">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Quick Inspiration Presets:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {INSPIRATION_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-xs bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-amber-300 px-2.5 py-1 rounded border border-slate-700 hover:border-amber-400 transition-all cursor-pointer"
            >
              ⚡ {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Creation Form with 5 Key Inputs */}
      <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
        {/* 1. Story Prompt */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5 flex items-center gap-1.5">
            <span>1. Story Prompt / Premise</span>
            <span className="text-rose-400">*</span>
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            placeholder="e.g. A cybernetic cat detective who secretly overhears the thoughts of street alley cats to solve a bank heist..."
            rows={3}
            required
            className="w-full bg-slate-950 border-2 border-slate-700 focus:border-amber-400 p-3 sm:p-4 text-sm font-comic text-white rounded-none outline-none transition-colors disabled:opacity-50"
          />
        </div>

        {/* 2. Character Name & 3. Setting */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>2. Main Character Name</span>
            </label>
            <input
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              disabled={isGenerating}
              placeholder="e.g. Maya Vance, Inspector Barnaby, Dr. Malice"
              className="w-full bg-slate-950 border border-slate-700 p-2 text-xs rounded text-white focus:border-amber-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>3. Story Setting</span>
            </label>
            <input
              type="text"
              value={setting}
              onChange={(e) => setSetting(e.target.value)}
              disabled={isGenerating}
              placeholder="e.g. Rain-slicked Neo-Tokyo alleyway, Victorian airship"
              className="w-full bg-slate-950 border border-slate-700 p-2 text-xs rounded text-white focus:border-amber-400 outline-none"
            />
          </div>
        </div>

        {/* 4. Tone & 5. Art Style */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span>4. Tone</span>
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              disabled={isGenerating}
              className="w-full bg-slate-950 border border-slate-700 p-2 text-xs rounded text-white focus:border-amber-400 outline-none"
            >
              {TONES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              <span>5. Art Style</span>
            </label>
            <select
              value={artStyle}
              onChange={(e) => setArtStyle(e.target.value)}
              disabled={isGenerating}
              className="w-full bg-slate-950 border border-slate-700 p-2 text-xs rounded text-white focus:border-amber-400 outline-none"
            >
              {ART_STYLES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Story Arc Pacing</span>
            </label>
            <select
              value={panelCount}
              onChange={(e) => setPanelCount(parseInt(e.target.value, 10))}
              disabled={isGenerating}
              className="w-full bg-slate-950 border border-slate-700 p-2 text-xs rounded text-white focus:border-amber-400 outline-none"
            >
              <option value={5}>5-Panel Standard (Gemini Flash Arc)</option>
              <option value={4}>4-Panel Classic Strip</option>
              <option value={6}>6-Panel Graphic Page</option>
            </select>
          </div>
        </div>

        {/* Submit Button & Generation State */}
        <div className="pt-3">
          {isGenerating ? (
            <div className="bg-slate-950 border-2 border-amber-400 p-4 comic-shadow flex flex-col sm:flex-row items-center justify-between gap-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border-3 border-amber-400 border-t-transparent animate-spin" />
                <div>
                  <span className="font-bangers text-lg text-amber-400 tracking-wider">
                    RUNNING COMICCRAFT AI PIPELINE...
                  </span>
                  <p className="text-xs text-slate-300 font-comic italic">
                    {CREATION_STEPS[loadingStepIndex]}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-amber-300 bg-amber-950 px-2.5 py-1 rounded border border-amber-500/30">
                5-Panel Arc Synthesis
              </span>
            </div>
          ) : (
            <button
              type="submit"
              disabled={!prompt.trim() || isGenerating}
              className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bangers text-xl sm:text-2xl tracking-wider py-3.5 px-6 border-4 border-black comic-shadow-lg transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 group"
            >
              <Wand2 className="w-6 h-6 transition-transform group-hover:rotate-12" />
              <span>TRANSFORM PROMPT INTO 5-PANEL COMIC</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
