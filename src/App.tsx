import React, { useState, useEffect, useRef } from 'react';
import { ComicStory, ComicPanel, ComicGenerateParams } from './types/comic';
import { SAMPLE_COMIC } from './data/sampleComic';
import { Navbar, ViewMode } from './components/Navbar';
import { ComicPromptStudio } from './components/ComicPromptStudio';
import { ComicHeaderBanner } from './components/ComicHeaderBanner';
import { ComicGridSpread } from './components/ComicViewers/ComicGridSpread';
import { WebtoonReader } from './components/ComicViewers/WebtoonReader';
import { ScriptStoryboardView } from './components/ComicViewers/ScriptStoryboardView';
import { CinematicReader } from './components/ComicViewers/CinematicReader';
import { PanelEditorModal } from './components/PanelEditorModal';
import { ComicLibraryModal } from './components/ComicLibraryModal';
import { ComicExportModal } from './components/ComicExportModal';
import { PythonBackendHubModal } from './components/PythonBackendHubModal';
import { JsonApiModal } from './components/JsonApiModal';
import { generateComicPdf } from './utils/pdfGenerator';
import { AlertCircle, Sparkles, BookOpen, Layers } from 'lucide-react';

const STORAGE_SAVED_KEY = 'comiccraft_vault_v1';
const STORAGE_CURRENT_KEY = 'comiccraft_current_comic_v1';

export default function App() {
  const [comic, setComic] = useState<ComicStory>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_CURRENT_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return SAMPLE_COMIC;
  });

  const [savedComics, setSavedComics] = useState<ComicStory[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_SAVED_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return [SAMPLE_COMIC];
  });

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorNotification, setErrorNotification] = useState<string | null>(null);

  // Modals state
  const [selectedPanelForEdit, setSelectedPanelForEdit] = useState<ComicPanel | null>(null);
  const [isCinematicOpen, setIsCinematicOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isPythonHubOpen, setIsPythonHubOpen] = useState(false);
  const [isJsonApiOpen, setIsJsonApiOpen] = useState(false);

  const studioRef = useRef<HTMLDivElement>(null);
  const comicViewerRef = useRef<HTMLDivElement>(null);

  // Save current comic & vault to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CURRENT_KEY, JSON.stringify(comic));
    } catch (e) {
      console.warn('Failed to save current comic to localStorage', e);
    }
  }, [comic]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(savedComics));
    } catch (e) {
      console.warn('Failed to save vault to localStorage', e);
    }
  }, [savedComics]);

  const handleGenerateComic = async (params: ComicGenerateParams) => {
    setIsGenerating(true);
    setErrorNotification(null);

    try {
      const response = await fetch('/api/comic/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate comic story.');
      }

      const newComic: ComicStory = data.comic;
      setComic(newComic);

      // Add to saved comics if not already present
      setSavedComics((prev) => {
        const filtered = prev.filter((c) => c.id !== newComic.id);
        return [newComic, ...filtered];
      });

      // Smooth scroll down to the generated comic
      setTimeout(() => {
        comicViewerRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (err: any) {
      console.error('Comic generation error:', err);
      setErrorNotification(err.message || 'An error occurred while communicating with Gemini.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateWithStyle = async (newStyle: string, newTone: string) => {
    await handleGenerateComic({
      prompt: comic.synopsis || comic.tagline || comic.title,
      characterName: comic.mainCharacterName || comic.characters[0]?.name,
      setting: comic.setting,
      tone: newTone,
      artStyle: newStyle,
      genre: comic.genre,
      panelCount: comic.panels.length || 5,
    });
  };

  const handleUpdatePanelImage = (panelNumber: number, imageUrl: string) => {
    setComic((prev) => {
      const updatedPanels = prev.panels.map((p) =>
        p.panelNumber === panelNumber ? { ...p, imageUrl } : p
      );
      const updated = { ...prev, panels: updatedPanels };
      updateInVault(updated);
      return updated;
    });
  };

  const handleSavePanel = (updatedPanel: ComicPanel) => {
    setComic((prev) => {
      const updatedPanels = prev.panels.map((p) =>
        p.panelNumber === updatedPanel.panelNumber ? updatedPanel : p
      );
      const updated = { ...prev, panels: updatedPanels };
      updateInVault(updated);
      return updated;
    });
  };

  const handleAddNewPanel = () => {
    const nextNumber = comic.panels.length + 1;
    const defaultSpeaker = comic.characters[0]?.name || 'Hero';
    const newPanel: ComicPanel = {
      panelNumber: nextNumber,
      layoutSpan: 'single',
      cameraAngle: 'Medium Action Shot',
      timeOfDay: 'Moments later',
      setting: comic.panels[comic.panels.length - 1]?.setting || 'Action Scene',
      actionDescription: 'The story continues as the tension builds toward the next surprise.',
      charactersPresent: [defaultSpeaker],
      narration: 'Meanwhile, destiny had other plans...',
      sfx: {
        text: 'BOOM!',
        style: 'explosive',
        position: 'top-right',
      },
      dialogues: [
        {
          speaker: defaultSpeaker,
          text: 'We are just getting started!',
          type: 'speech',
          balloonPosition: 'top-left',
        },
      ],
      imagePrompt: `Comic book panel illustration, style ${comic.artStyle}. Dramatic continuation of ${comic.title}.`,
      sceneMood: {
        primaryColor: '#1e1b4b',
        secondaryColor: comic.moodColor || '#f97316',
        lightingTone: 'Dynamic comic lighting with saturated shadows',
        keyPropOrFeature: 'Heroic stance',
      },
    };

    setComic((prev) => {
      const updated = { ...prev, panels: [...prev.panels, newPanel] };
      updateInVault(updated);
      return updated;
    });
  };

  const updateInVault = (updated: ComicStory) => {
    setSavedComics((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  const handleSelectComic = (selected: ComicStory) => {
    setComic(selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteComic = (comicId: string) => {
    setSavedComics((prev) => {
      const remaining = prev.filter((c) => c.id !== comicId);
      if (comic.id === comicId) {
        setComic(remaining[0] || SAMPLE_COMIC);
      }
      return remaining;
    });
  };

  const handleLoadSample = () => {
    setComic(SAMPLE_COMIC);
    setSavedComics((prev) => {
      if (prev.some((c) => c.id === SAMPLE_COMIC.id)) return prev;
      return [SAMPLE_COMIC, ...prev];
    });
  };

  const handleImportComic = (imported: ComicStory) => {
    setComic(imported);
    setSavedComics((prev) => [imported, ...prev.filter((c) => c.id !== imported.id)]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        viewMode={viewMode}
        onSelectViewMode={setViewMode}
        onOpenCinematic={() => setIsCinematicOpen(true)}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenPythonHub={() => setIsPythonHubOpen(true)}
        onOpenJsonApi={() => setIsJsonApiOpen(true)}
        onDownloadPdf={() => generateComicPdf(comic)}
        onScrollToCreate={() => studioRef.current?.scrollIntoView({ behavior: 'smooth' })}
        savedComicsCount={savedComics.length}
      />

      {/* Error Alert Banner */}
      {errorNotification && (
        <div className="bg-rose-950/95 border-b-2 border-rose-500 text-rose-200 px-4 py-3 flex items-center justify-between z-30">
          <div className="flex items-center gap-2 max-w-4xl text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorNotification}</span>
          </div>
          <button
            onClick={() => setErrorNotification(null)}
            className="text-xs bg-rose-900 hover:bg-rose-800 text-white px-2 py-1 rounded"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8">
        {/* Creation Studio Section */}
        <div ref={studioRef} className="no-print">
          <ComicPromptStudio
            onGenerate={handleGenerateComic}
            isGenerating={isGenerating}
          />
        </div>

        {/* Comic Storyboard Display */}
        <div ref={comicViewerRef} className="mt-2">
          {/* Header Story Banner */}
          <ComicHeaderBanner
            comic={comic}
            onUpdateComic={(updated) => {
              setComic((prev) => ({ ...prev, ...updated }));
            }}
            onRegenerateWithStyle={handleRegenerateWithStyle}
            isGenerating={isGenerating}
          />

          {/* Active View Mode */}
          {viewMode === 'grid' && (
            <ComicGridSpread
              comic={comic}
              onEditPanel={(panel) => setSelectedPanelForEdit(panel)}
              onUpdatePanelImage={handleUpdatePanelImage}
              onAddNewPanel={handleAddNewPanel}
            />
          )}

          {viewMode === 'webtoon' && (
            <WebtoonReader
              comic={comic}
              onEditPanel={(panel) => setSelectedPanelForEdit(panel)}
              onUpdatePanelImage={handleUpdatePanelImage}
            />
          )}

          {viewMode === 'script' && (
            <ScriptStoryboardView comic={comic} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="no-print mt-16 border-t-4 border-black bg-black py-6 text-center text-xs text-slate-400 font-comic">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bangers text-lg text-amber-400">COMICCRAFT</span>
            <span>• Empowering creators with Google Gemini Models</span>
          </div>
          <p className="text-slate-500">
            Export comics, print issues, and generate scripts directly in your browser.
          </p>
        </div>
      </footer>

      {/* Modals */}
      {selectedPanelForEdit && (
        <PanelEditorModal
          panel={selectedPanelForEdit}
          characters={comic.characters}
          artStyle={comic.artStyle}
          isOpen={!!selectedPanelForEdit}
          onClose={() => setSelectedPanelForEdit(null)}
          onSave={handleSavePanel}
        />
      )}

      <CinematicReader
        comic={comic}
        isOpen={isCinematicOpen}
        onClose={() => setIsCinematicOpen(false)}
        onUpdatePanelImage={handleUpdatePanelImage}
      />

      <ComicLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        savedComics={savedComics}
        currentComicId={comic.id}
        onSelectComic={handleSelectComic}
        onDeleteComic={handleDeleteComic}
        onLoadSample={handleLoadSample}
      />

      <ComicExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        comic={comic}
        onImportComic={handleImportComic}
      />

      <PythonBackendHubModal
        isOpen={isPythonHubOpen}
        onClose={() => setIsPythonHubOpen(false)}
      />

      <JsonApiModal
        isOpen={isJsonApiOpen}
        onClose={() => setIsJsonApiOpen(false)}
        onLoadGeneratedComic={handleSelectComic}
      />
    </div>
  );
}
