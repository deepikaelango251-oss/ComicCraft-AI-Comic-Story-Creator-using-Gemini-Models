export type DialogueType = 'speech' | 'thought' | 'shout' | 'whisper';
export type BalloonPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

export interface Dialogue {
  speaker: string;
  text: string;
  type: DialogueType;
  balloonPosition?: BalloonPosition;
}

export interface SoundEffect {
  text: string;
  style: 'explosive' | 'zap' | 'impact' | 'ambient' | 'punch';
  position: 'top-right' | 'top-left' | 'center' | 'bottom-right' | 'bottom-left';
}

export interface SceneMood {
  primaryColor: string;
  secondaryColor: string;
  lightingTone: string;
  keyPropOrFeature: string;
}

export interface ComicPanel {
  panelNumber: number;
  beatTitle?: string; // e.g. "Act 1: The Setup", "Act 4: The Climax"
  layoutSpan?: 'single' | 'wide' | 'tall' | 'splash';
  cameraAngle: string;
  timeOfDay: string;
  setting: string;
  actionDescription: string;
  charactersPresent: string[];
  narration?: string;
  sfx?: SoundEffect;
  dialogues: Dialogue[];
  imagePrompt: string;
  imageUrl?: string;
  sceneMood: SceneMood;
}

export interface CharacterProfile {
  name: string;
  role: string;
  visualDescription: string;
  personality: string;
  signatureColor: string;
  catchphrase?: string;
}

export interface ComicStory {
  id: string;
  title: string;
  issueNumber: string;
  tagline: string;
  synopsis: string;
  genre: string;
  artStyle: string;
  setting: string;
  tone: string;
  mainCharacterName: string;
  moodColor: string;
  characters: CharacterProfile[];
  panels: ComicPanel[];
  coverArtPrompt: string;
  coverImageUrl?: string;
  createdAt: string;
  pipelineStage?: 'completed' | 'outline' | 'dialogue' | 'images';
}

export interface ComicGenerateParams {
  prompt: string;
  characterName?: string;
  setting?: string;
  genre?: string;
  artStyle: string;
  tone: string;
  panelCount?: number;
  autoGenerateImages?: boolean;
}

