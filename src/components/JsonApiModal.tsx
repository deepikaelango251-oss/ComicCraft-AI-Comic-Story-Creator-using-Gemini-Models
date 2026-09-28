import React, { useState } from 'react';
import { X, Play, Copy, Check, Terminal, FileCode, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { ComicStory } from '../types/comic';

interface JsonApiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadGeneratedComic: (comic: ComicStory) => void;
}

const DEFAULT_SAMPLE_JSON = JSON.stringify(
  {
    prompt: "A cyborg detective solves an impossible bank vault robbery using clues from street cats",
    characterName: "Detective Ren",
    setting: "Neon Alleyways of Neo-Tokyo",
    tone: "Dark & Mysterious",
    artStyle: "Anime",
    panelCount: 5
  },
  null,
  2
);

export const JsonApiModal: React.FC<JsonApiModalProps> = ({
  isOpen,
  onClose,
  onLoadGeneratedComic,
}) => {
  if (!isOpen) return null;

  const [activeEndpoint, setActiveEndpoint] = useState<'generate' | 'image' | 'narrate'>('generate');
  const [requestBody, setRequestBody] = useState(DEFAULT_SAMPLE_JSON);
  const [responseOutput, setResponseOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const getCurlSnippet = () => {
    return `curl -X POST "${window.location.origin}/api/comic/generate" \\
  -H "Content-Type: application/json" \\
  -d '${requestBody.replace(/\n/g, '').replace(/\s+/g, ' ')}'`;
  };

  const handleSendRequest = async () => {
    setIsLoading(true);
    setResponseOutput(null);
    setStatusCode(null);
    setResponseTime(null);
    const startTime = performance.now();

    try {
      const parsedBody = JSON.parse(requestBody);
      const res = await fetch('/api/comic/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedBody),
      });

      const elapsed = Math.round(performance.now() - startTime);
      setResponseTime(elapsed);
      setStatusCode(res.status);

      const data = await res.json();
      setResponseOutput(JSON.stringify(data, null, 2));

      if (data.success && data.comic) {
        // Option to load into app
      }
    } catch (err: any) {
      setStatusCode(500);
      setResponseOutput(JSON.stringify({ error: err.message || 'JSON parsing or network error' }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(getCurlSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadResultIntoViewer = () => {
    if (!responseOutput) return;
    try {
      const parsed = JSON.parse(responseOutput);
      if (parsed.comic) {
        onLoadGeneratedComic(parsed.comic);
        onClose();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border-4 border-black comic-shadow-lg text-white my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-amber-400 border-b-4 border-black text-black">
          <div className="flex items-center gap-2">
            <FileCode className="w-6 h-6" />
            <span className="font-bangers text-2xl tracking-wide">
              JSON API DEVELOPER CONSOLE
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-black hover:text-white rounded transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Endpoints Tab */}
        <div className="flex flex-wrap border-b-2 border-slate-700 bg-slate-950 px-4 text-xs font-bold">
          <button
            onClick={() => setActiveEndpoint('generate')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeEndpoint === 'generate' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400'
            }`}
          >
            <span className="bg-emerald-700 text-white px-1.5 py-0.2 rounded text-[10px]">POST</span>
            <span>/api/comic/generate</span>
          </button>
          <button
            onClick={() => setActiveEndpoint('image')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeEndpoint === 'image' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400'
            }`}
          >
            <span className="bg-emerald-700 text-white px-1.5 py-0.2 rounded text-[10px]">POST</span>
            <span>/api/comic/generate-panel-image</span>
          </button>
          <button
            onClick={() => setActiveEndpoint('narrate')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeEndpoint === 'narrate' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400'
            }`}
          >
            <span className="bg-emerald-700 text-white px-1.5 py-0.2 rounded text-[10px]">POST</span>
            <span>/api/comic/narrate-panel</span>
          </button>
        </div>

        {/* Console Workspace */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <p className="text-slate-300 font-comic">
              Test and integrate ComicCraft's JSON API directly. Build automated pipelines or custom apps.
            </p>
            <button
              onClick={handleCopyCurl}
              className="bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 rounded border border-slate-700 flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied cURL!' : 'Copy cURL'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Request Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400">Request JSON Body:</span>
                <button
                  onClick={() => setRequestBody(DEFAULT_SAMPLE_JSON)}
                  className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Reset Template
                </button>
              </div>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                rows={13}
                className="w-full bg-black/90 p-3 font-mono text-xs text-amber-200 border-2 border-slate-800 focus:border-amber-400 rounded outline-none leading-relaxed"
              />
              <button
                onClick={handleSendRequest}
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bangers text-lg tracking-wider py-2 rounded border-2 border-black comic-shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Executing Request...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Execute JSON Request</span>
                  </>
                )}
              </button>
            </div>

            {/* Response Viewer */}
            <div className="space-y-2 flex flex-col">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-cyan-400">Response Output:</span>
                {statusCode && (
                  <div className="flex items-center gap-2 font-mono">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        statusCode === 200 ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-rose-950 text-rose-400'
                      }`}
                    >
                      Status: {statusCode}
                    </span>
                    {responseTime && (
                      <span className="text-slate-400 text-[10px]">{responseTime}ms</span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex-1 min-h-[260px] bg-black/90 p-3 font-mono text-xs text-emerald-400 border-2 border-slate-800 rounded overflow-y-auto max-h-[320px]">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2 py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                    <span>Waiting for Gemini API response...</span>
                  </div>
                ) : responseOutput ? (
                  <pre className="whitespace-pre-wrap">{responseOutput}</pre>
                ) : (
                  <span className="text-slate-600 italic">
                    Press "Execute JSON Request" to test the endpoint live.
                  </span>
                )}
              </div>

              {responseOutput && statusCode === 200 && (
                <button
                  onClick={handleLoadResultIntoViewer}
                  className="bg-amber-400 hover:bg-amber-300 text-black font-bangers text-sm tracking-wide py-1.5 rounded border-2 border-black comic-shadow flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                >
                  <CheckCircle2 className="w-4 h-4" /> Load Response Directly Into Comic Viewer
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t-2 border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
          >
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
};
