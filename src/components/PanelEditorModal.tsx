import React, { useState } from 'react';
import { ComicPanel, Dialogue, DialogueType, SoundEffect, CharacterProfile } from '../types/comic';
import { X, Plus, Trash2, Sparkles, Image, Check, Volume2 } from 'lucide-react';

interface PanelEditorModalProps {
  panel: ComicPanel;
  characters: CharacterProfile[];
  artStyle: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPanel: ComicPanel) => void;
}

export const PanelEditorModal: React.FC<PanelEditorModalProps> = ({
  panel,
  characters,
  artStyle,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [panelData, setPanelData] = useState<ComicPanel>({ ...panel });
  const [activeTab, setActiveTab] = useState<'dialogue' | 'art' | 'staging'>('dialogue');

  const handleAddDialogue = () => {
    const defaultSpeaker = characters[0]?.name || 'Hero';
    const newDialogue: Dialogue = {
      speaker: defaultSpeaker,
      text: 'New line of dialogue...',
      type: 'speech',
      balloonPosition: 'top-left',
    };
    setPanelData({
      ...panelData,
      dialogues: [...panelData.dialogues, newDialogue],
    });
  };

  const handleUpdateDialogue = (index: number, updated: Partial<Dialogue>) => {
    const list = [...panelData.dialogues];
    list[index] = { ...list[index], ...updated };
    setPanelData({ ...panelData, dialogues: list });
  };

  const handleDeleteDialogue = (index: number) => {
    const list = panelData.dialogues.filter((_, i) => i !== index);
    setPanelData({ ...panelData, dialogues: list });
  };

  const handleSave = () => {
    onSave(panelData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border-4 border-black comic-shadow-lg text-white rounded-none my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 bg-amber-400 border-b-4 border-black text-black">
          <div className="flex items-center gap-2">
            <span className="font-bangers text-2xl tracking-wide">
              PANEL DIRECTOR #{panelData.panelNumber}
            </span>
            <span className="text-xs font-mono font-bold bg-black text-amber-400 px-2 py-0.5 rounded">
              {panelData.cameraAngle}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-black hover:text-white rounded transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b-2 border-slate-700 bg-slate-950 px-4">
          <button
            onClick={() => setActiveTab('dialogue')}
            className={`py-2.5 px-4 font-bold text-xs sm:text-sm tracking-wide border-b-2 transition-colors cursor-pointer ${
              activeTab === 'dialogue'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Speech Bubbles & Narration
          </button>
          <button
            onClick={() => setActiveTab('art')}
            className={`py-2.5 px-4 font-bold text-xs sm:text-sm tracking-wide border-b-2 transition-colors cursor-pointer ${
              activeTab === 'art'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Visual Art & AI Prompt
          </button>
          <button
            onClick={() => setActiveTab('staging')}
            className={`py-2.5 px-4 font-bold text-xs sm:text-sm tracking-wide border-b-2 transition-colors cursor-pointer ${
              activeTab === 'staging'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Layout & Staging
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'dialogue' && (
            <div className="space-y-5">
              {/* Narration Box Edit */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                  Narration / Caption Box Text
                </label>
                <textarea
                  value={panelData.narration || ''}
                  onChange={(e) => setPanelData({ ...panelData, narration: e.target.value })}
                  placeholder="Enter narration voiceover or leave blank..."
                  rows={2}
                  className="w-full bg-slate-950 border-2 border-slate-700 focus:border-amber-400 p-2.5 text-sm rounded font-comic text-amber-100 outline-none"
                />
              </div>

              {/* Sound Effect (SFX) */}
              <div className="bg-slate-950/80 p-3.5 border-2 border-slate-800 rounded">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Sound Effect (SFX / Onomatopoeia)
                  </label>
                  {panelData.sfx ? (
                    <button
                      onClick={() => setPanelData({ ...panelData, sfx: undefined })}
                      className="text-xs text-rose-400 hover:underline"
                    >
                      Remove SFX
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        setPanelData({
                          ...panelData,
                          sfx: { text: 'BAM!', style: 'explosive', position: 'top-right' },
                        })
                      }
                      className="text-xs text-cyan-400 hover:underline"
                    >
                      + Add SFX
                    </button>
                  )}
                </div>

                {panelData.sfx && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={panelData.sfx.text}
                      onChange={(e) =>
                        setPanelData({
                          ...panelData,
                          sfx: { ...panelData.sfx!, text: e.target.value },
                        })
                      }
                      placeholder="e.g. KRA-KOW!"
                      className="bg-slate-900 border border-slate-700 p-2 text-sm font-bangers rounded uppercase"
                    />
                    <select
                      value={panelData.sfx.style}
                      onChange={(e) =>
                        setPanelData({
                          ...panelData,
                          sfx: { ...panelData.sfx!, style: e.target.value as any },
                        })
                      }
                      className="bg-slate-900 border border-slate-700 p-2 text-xs rounded text-white"
                    >
                      <option value="explosive">Explosive (Red/Yellow)</option>
                      <option value="zap">Electric Zap (Cyan/Purple)</option>
                      <option value="impact">Impact Punch (Rose/Amber)</option>
                      <option value="ambient">Ambient (Black/Gold)</option>
                    </select>
                    <select
                      value={panelData.sfx.position}
                      onChange={(e) =>
                        setPanelData({
                          ...panelData,
                          sfx: { ...panelData.sfx!, position: e.target.value as any },
                        })
                      }
                      className="bg-slate-900 border border-slate-700 p-2 text-xs rounded text-white"
                    >
                      <option value="top-right">Top Right</option>
                      <option value="top-left">Top Left</option>
                      <option value="center">Center Burst</option>
                      <option value="bottom-right">Bottom Right</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Dialogues List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Character Dialogues ({panelData.dialogues.length})
                  </label>
                  <button
                    onClick={handleAddDialogue}
                    className="bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Balloon
                  </button>
                </div>

                <div className="space-y-3">
                  {panelData.dialogues.map((dlg, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950 p-3.5 border-2 border-slate-800 rounded flex flex-col gap-2 relative"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 font-mono">Speaker:</span>
                          <select
                            value={dlg.speaker}
                            onChange={(e) => handleUpdateDialogue(idx, { speaker: e.target.value })}
                            className="bg-slate-900 border border-slate-700 text-xs px-2 py-1 rounded text-amber-300 font-bold"
                          >
                            {characters.map((c, cIdx) => (
                              <option key={cIdx} value={c.name}>
                                {c.name} ({c.role})
                              </option>
                            ))}
                            <option value="Other">Other / Off-Panel</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={dlg.type}
                            onChange={(e) =>
                              handleUpdateDialogue(idx, { type: e.target.value as DialogueType })
                            }
                            className="bg-slate-900 border border-slate-700 text-xs px-2 py-1 rounded text-cyan-300"
                          >
                            <option value="speech">Normal Speech</option>
                            <option value="shout">Shout (Spiky)</option>
                            <option value="thought">Thought Bubble</option>
                            <option value="whisper">Whisper</option>
                          </select>

                          <button
                            onClick={() => handleDeleteDialogue(idx)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <textarea
                        value={dlg.text}
                        onChange={(e) => handleUpdateDialogue(idx, { text: e.target.value })}
                        rows={2}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 p-2 text-sm rounded font-comic text-white outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'art' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                  AI Image Generation Prompt (Gemini Art Prompt)
                </label>
                <textarea
                  value={panelData.imagePrompt}
                  onChange={(e) => setPanelData({ ...panelData, imagePrompt: e.target.value })}
                  rows={4}
                  className="w-full bg-slate-950 border-2 border-slate-700 focus:border-amber-400 p-3 text-xs sm:text-sm font-mono rounded text-slate-200 outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                  Custom Panel Image URL (Optional)
                </label>
                <input
                  type="text"
                  value={panelData.imageUrl || ''}
                  onChange={(e) => setPanelData({ ...panelData, imageUrl: e.target.value })}
                  placeholder="https://example.com/art.png or data:image/png;base64,..."
                  className="w-full bg-slate-950 border border-slate-700 p-2.5 text-xs rounded font-mono text-cyan-300"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800 text-xs text-slate-300 space-y-1">
                <p className="font-bold text-amber-300">Style Guidelines for this Comic:</p>
                <p className="italic text-slate-400">{artStyle}</p>
                <p className="text-[11px] text-slate-500">
                  Tip: Gemini creates stunning comic art when given clear camera angles, lighting notes, and character tags.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'staging' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                    Layout Frame Span
                  </label>
                  <select
                    value={panelData.layoutSpan || 'single'}
                    onChange={(e) =>
                      setPanelData({ ...panelData, layoutSpan: e.target.value as any })
                    }
                    className="w-full bg-slate-950 border border-slate-700 p-2.5 text-xs rounded text-white"
                  >
                    <option value="single">Single (Standard 1x1)</option>
                    <option value="wide">Wide Panoramic (2x1)</option>
                    <option value="tall">Tall Vertical (1x2)</option>
                    <option value="splash">Splash Panel (2x2 Feature)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                    Camera Angle
                  </label>
                  <input
                    type="text"
                    value={panelData.cameraAngle}
                    onChange={(e) => setPanelData({ ...panelData, cameraAngle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 p-2 text-xs rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                    Setting / Location
                  </label>
                  <input
                    type="text"
                    value={panelData.setting}
                    onChange={(e) => setPanelData({ ...panelData, setting: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 p-2 text-xs rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                    Time of Day
                  </label>
                  <input
                    type="text"
                    value={panelData.timeOfDay}
                    onChange={(e) => setPanelData({ ...panelData, timeOfDay: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 p-2 text-xs rounded text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                  Action & Staging Description
                </label>
                <textarea
                  value={panelData.actionDescription}
                  onChange={(e) => setPanelData({ ...panelData, actionDescription: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 p-2 text-xs rounded text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-4 bg-slate-950 border-t-2 border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-amber-400 hover:bg-amber-300 text-black font-bangers text-base tracking-wide px-5 py-2 border-2 border-black comic-shadow flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
