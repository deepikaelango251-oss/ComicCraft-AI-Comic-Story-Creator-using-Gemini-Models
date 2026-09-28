import React, { useState } from 'react';
import { ComicStory } from '../../types/comic';
import { Copy, Check, FileText, Download } from 'lucide-react';

interface ScriptStoryboardViewProps {
  comic: ComicStory;
}

export const ScriptStoryboardView: React.FC<ScriptStoryboardViewProps> = ({ comic }) => {
  const [copied, setCopied] = useState(false);

  const generateMarkdownScript = (): string => {
    let md = `# ${comic.title.toUpperCase()}\n`;
    md += `## ${comic.issueNumber} | ${comic.genre}\n`;
    md += `**Tagline:** "${comic.tagline}"\n\n`;
    md += `**Art Style:** ${comic.artStyle}\n\n`;
    md += `### SYNOPSIS\n${comic.synopsis}\n\n`;
    md += `---\n\n`;
    md += `### DRAMATIS PERSONAE (CHARACTERS)\n`;
    comic.characters.forEach((char) => {
      md += `* **${char.name}** (${char.role})\n`;
      md += `  - Visual: ${char.visualDescription}\n`;
      md += `  - Personality: ${char.personality}\n`;
      if (char.catchphrase) md += `  - Catchphrase: "${char.catchphrase}"\n`;
    });
    md += `\n---\n\n`;
    md += `### SCRIPT BREAKDOWN\n\n`;

    comic.panels.forEach((p) => {
      md += `#### PANEL ${p.panelNumber} [${p.layoutSpan?.toUpperCase() || 'SINGLE'}]\n`;
      md += `* **ANGLE / SHOT:** ${p.cameraAngle}\n`;
      md += `* **SETTING & TIME:** ${p.setting} (${p.timeOfDay})\n`;
      md += `* **CHARACTERS PRESENT:** ${p.charactersPresent?.join(', ') || 'None'}\n`;
      md += `* **ACTION / STAGING:** ${p.actionDescription}\n`;
      if (p.narration) {
        md += `* **CAPTION (NARRATION):** ${p.narration}\n`;
      }
      if (p.sfx) {
        md += `* **SFX:** ${p.sfx.text} (${p.sfx.style} - ${p.sfx.position})\n`;
      }
      if (p.dialogues && p.dialogues.length > 0) {
        md += `* **DIALOGUE:**\n`;
        p.dialogues.forEach((d) => {
          md += `  - **${d.speaker.toUpperCase()}** (${d.type}): "${d.text}"\n`;
        });
      }
      md += `* **ART DIRECTOR PROMPT:** \`${p.imagePrompt}\`\n\n`;
    });

    return md;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdownScript());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = generateMarkdownScript();
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${comic.title.replace(/\s+/g, '_')}_Script.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-950 border-4 border-black comic-shadow-lg p-4 sm:p-8 text-slate-200">
      {/* Script Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b-2 border-slate-800">
        <div>
          <h2 className="font-bangers text-2xl text-amber-400 tracking-wider flex items-center gap-2">
            <FileText className="w-5 h-5" /> Production Script & Storyboard Breakdown
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Standard Comic Screenplay Format for Writers, Inkers & Colorists
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold px-3 py-1.5 rounded border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Script!' : 'Copy Markdown'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold px-3 py-1.5 rounded border-2 border-black comic-shadow flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .MD</span>
          </button>
        </div>
      </div>

      {/* Script Content */}
      <div className="space-y-8 font-mono text-sm leading-relaxed max-w-4xl">
        {/* Cover & Overview */}
        <div className="bg-black/60 p-4 rounded border border-slate-800 space-y-2">
          <div className="text-lg font-bold text-amber-400">
            TITLE: {comic.title.toUpperCase()}
          </div>
          <div className="text-xs text-cyan-300">
            {comic.issueNumber} | GENRE: {comic.genre.toUpperCase()} | STYLE: {comic.artStyle}
          </div>
          <div className="text-xs text-slate-300 italic pt-1">
            TAGLINE: "{comic.tagline}"
          </div>
          <div className="text-xs text-slate-400 pt-2 border-t border-slate-800">
            SYNOPSIS: {comic.synopsis}
          </div>
        </div>

        {/* Panel Breakdown */}
        <div className="space-y-6">
          {comic.panels.map((p) => (
            <div
              key={p.panelNumber}
              className="bg-slate-900/90 border-2 border-slate-800 rounded p-4 space-y-3 hover:border-amber-400/50 transition-colors"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bangers text-lg text-amber-400 tracking-wide">
                  PANEL {p.panelNumber} [{p.layoutSpan?.toUpperCase() || 'SINGLE'}]
                </span>
                <span className="text-xs text-slate-400 bg-black/60 px-2 py-0.5 rounded border border-slate-800">
                  {p.cameraAngle} • {p.timeOfDay}
                </span>
              </div>

              <div className="text-xs text-slate-300">
                <strong className="text-slate-400">SETTING: </strong>
                {p.setting}
              </div>

              <div className="text-xs text-slate-200 bg-black/40 p-2.5 rounded border-l-2 border-amber-400">
                <strong className="text-amber-400 block mb-1 uppercase text-[10px] tracking-wider">
                  Action & Staging:
                </strong>
                {p.actionDescription}
              </div>

              {p.narration && (
                <div className="text-xs text-amber-300 bg-amber-950/40 p-2 rounded border-l-2 border-amber-500">
                  <strong className="text-amber-400 uppercase text-[10px] block mb-0.5">
                    Caption Box (Voiceover):
                  </strong>
                  "{p.narration}"
                </div>
              )}

              {p.sfx && (
                <div className="text-xs text-rose-400">
                  <strong>SFX: </strong>
                  <span className="font-bangers text-sm text-yellow-400 px-1.5 py-0.5 bg-black rounded border border-rose-500/40">
                    {p.sfx.text}
                  </span>{' '}
                  ({p.sfx.style} - positioned {p.sfx.position})
                </div>
              )}

              {p.dialogues && p.dialogues.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                    Dialogue Cues:
                  </span>
                  {p.dialogues.map((d, dIdx) => (
                    <div key={dIdx} className="text-xs bg-slate-950 p-2 rounded flex flex-col gap-0.5">
                      <span className="font-bold text-cyan-300 uppercase text-[11px]">
                        {d.speaker} ({d.type}):
                      </span>
                      <span className="text-white italic font-comic">"{d.text}"</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500">
                <span className="text-slate-400 font-bold block mb-0.5">Artist Gen Prompt:</span>
                <p className="bg-black/70 p-2 rounded text-slate-400 select-all font-mono text-[10px]">
                  {p.imagePrompt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
