import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '20mb' }));

// Initialize GoogleGenAI client according to SKILL.md specs
const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// POST /api/comic/generate
// Complete 2-Stage Gemini Pipeline:
// Stage 1 (Gemini Flash Outline) -> Stage 2 (Story & Dialogue Expansion + Stable Diffusion Prompts)
app.post('/api/comic/generate', async (req: Request, res: Response) => {
  try {
    const {
      prompt,
      characterName,
      setting = 'Metropolitan Alleyway',
      genre = 'Sci-Fi Action',
      artStyle = 'Modern Graphic Novel',
      tone = 'Cinematic & Thrilling',
      panelCount = 5,
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Please provide a story prompt or idea.' });
    }

    const ai = getGenAIClient();

    // Stage 1 & Stage 2 Execution:
    // Gemini Flash synthesizes the structured 5-panel story arc, then fleshes out narration,
    // character dialogues, sound effects, and Stable Diffusion prompts.
    const systemInstruction = `You are ComicCraft's dual-stage AI comic director powered by Google Gemini.
Execute the following workflow:
[STAGE 1: COMIC OUTLINE ENGINE (Gemini Flash)]
1. Analyze user inputs: Story Prompt ("${prompt}"), Main Character ("${characterName || 'Hero'}"), Setting ("${setting}"), Tone ("${tone}"), Art Style ("${artStyle}").
2. Establish a structured ${panelCount}-panel story arc:
   - Panel 1: Act 1 - The Setup (Introduction of character in setting)
   - Panel 2: Act 2 - Inciting Incident (The complication or surprise)
   - Panel 3: Act 3 - Rising Action (Conflict escalates)
   - Panel 4: Act 4 - The Climax (Peak dramatic action or punchline)
   - Panel 5: Act 5 - The Resolution / Cliffhanger (Consequence or twist)

[STAGE 2: STORY & DIALOGUE REFINEMENT (Gemini Script Engine)]
3. Craft evocative Narration for each panel (yellow caption voiceover).
4. Write distinctive, snappy dialogues for each character with speaker name, dialogue text, balloon type (speech, thought, shout, whisper), and balloon position.
5. Create dynamic sound effects (SFX onomatopoeia like "KRA-KOW!", "BZZZT!", "WHAM!").
6. Generate production-ready Stable Diffusion image prompts specifically tailored for comic illustrators and diffusers (specifying art style: ${artStyle}, inks, cell shading, dynamic comic framing, camera angles, color grading).`;

    const userContent = `Create a complete 5-panel comic story for ComicCraft:
Story Prompt: "${prompt}"
Main Character: "${characterName || 'Hero'}"
Setting: "${setting}"
Tone: "${tone}"
Art Style: "${artStyle}"
Genre: "${genre}"
Panels: ${panelCount} panels`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userContent,
      config: {
        systemInstruction,
        temperature: 0.85,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Iconic comic book title' },
            issueNumber: { type: Type.STRING, description: 'e.g. Issue #1: The Awakening' },
            tagline: { type: Type.STRING, description: 'Punchy cover tagline' },
            synopsis: { type: Type.STRING, description: 'Narrative summary of the comic story' },
            genre: { type: Type.STRING },
            artStyle: { type: Type.STRING },
            setting: { type: Type.STRING },
            tone: { type: Type.STRING },
            mainCharacterName: { type: Type.STRING },
            moodColor: { type: Type.STRING, description: 'Hex color representation (e.g. #FF5500)' },
            characters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                  visualDescription: { type: Type.STRING },
                  personality: { type: Type.STRING },
                  signatureColor: { type: Type.STRING },
                  catchphrase: { type: Type.STRING },
                },
                required: ['name', 'role', 'visualDescription', 'personality', 'signatureColor'],
              },
            },
            coverArtPrompt: { type: Type.STRING },
            panels: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  panelNumber: { type: Type.INTEGER },
                  beatTitle: { type: Type.STRING, description: 'e.g. Act 1: The Setup' },
                  layoutSpan: { type: Type.STRING, description: 'single, wide, tall, splash' },
                  cameraAngle: { type: Type.STRING },
                  timeOfDay: { type: Type.STRING },
                  setting: { type: Type.STRING },
                  actionDescription: { type: Type.STRING },
                  charactersPresent: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  narration: { type: Type.STRING },
                  sfx: {
                    type: Type.OBJECT,
                    properties: {
                      text: { type: Type.STRING },
                      style: { type: Type.STRING },
                      position: { type: Type.STRING },
                    },
                    required: ['text', 'style', 'position'],
                  },
                  dialogues: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        speaker: { type: Type.STRING },
                        text: { type: Type.STRING },
                        type: { type: Type.STRING },
                        balloonPosition: { type: Type.STRING },
                      },
                      required: ['speaker', 'text', 'type'],
                    },
                  },
                  imagePrompt: { type: Type.STRING, description: 'Prompt for Stable Diffusion or Gemini image model' },
                  sceneMood: {
                    type: Type.OBJECT,
                    properties: {
                      primaryColor: { type: Type.STRING },
                      secondaryColor: { type: Type.STRING },
                      lightingTone: { type: Type.STRING },
                      keyPropOrFeature: { type: Type.STRING },
                    },
                    required: ['primaryColor', 'secondaryColor', 'lightingTone', 'keyPropOrFeature'],
                  },
                },
                required: [
                  'panelNumber',
                  'cameraAngle',
                  'setting',
                  'actionDescription',
                  'charactersPresent',
                  'dialogues',
                  'imagePrompt',
                  'sceneMood',
                ],
              },
            },
          },
          required: [
            'title',
            'issueNumber',
            'tagline',
            'synopsis',
            'genre',
            'artStyle',
            'setting',
            'tone',
            'mainCharacterName',
            'characters',
            'panels',
            'coverArtPrompt',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Gemini model returned an empty response.');
    }

    const comicData = JSON.parse(text);
    return res.json({
      success: true,
      comic: {
        id: 'comic_' + Date.now(),
        createdAt: new Date().toISOString(),
        pipelineStage: 'completed',
        ...comicData,
      },
    });
  } catch (err: any) {
    console.error('Error in ComicCraft pipeline:', err);
    return res.status(500).json({
      error: err.message || 'Failed to generate comic story.',
    });
  }
});

// POST /api/comic/generate-panel-image
// Generates comic illustrations using image generation model
app.post('/api/comic/generate-panel-image', async (req: Request, res: Response) => {
  try {
    const { prompt, artStyle = 'Comic book illustration', aspectRatio = '4:3' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Image prompt is required' });
    }

    const ai = getGenAIClient();

    const fullPrompt = `Comic book illustration, graphic novel art masterpiece, style: ${artStyle}. ${prompt}. Detailed lineart, bold ink outlines, vibrant cell shading, cinematic comic framing.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [{ text: fullPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as '1:1' | '3:4' | '4:3' | '9:16' | '16:9',
        },
      },
    });

    let imageUrl = '';
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        const mimeType = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      return res.status(422).json({
        success: false,
        error: 'No image data returned from model.',
      });
    }

    return res.json({
      success: true,
      imageUrl,
    });
  } catch (err: any) {
    console.warn('Image generation error (falling back to dynamic graphic vector art):', err.message);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to generate panel image.',
    });
  }
});

// POST /api/comic/narrate-panel
// Audio voiceover using gemini-3.8-flash-lite-tts
app.post('/api/comic/narrate-panel', async (req: Request, res: Response) => {
  try {
    const { narrationText, dialogues = [], comicTitle } = req.body;

    let scriptToRead = '';
    if (narrationText) {
      scriptToRead += `Narrator: ${narrationText} `;
    }
    if (dialogues && dialogues.length > 0) {
      dialogues.forEach((d: { speaker: string; text: string }) => {
        scriptToRead += `${d.speaker} says: "${d.text}" `;
      });
    }

    if (!scriptToRead.trim()) {
      return res.status(400).json({ error: 'No narration or dialogue text provided to narrate.' });
    }

    const ai = getGenAIClient();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: scriptToRead,
              speechMetadata: {
                style: 'Dramatic, dynamic comic book narrator voiceover with energetic pauses and flair',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Zephyr' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return res.status(500).json({ error: 'TTS audio was not generated.' });
    }

    return res.json({
      success: true,
      audioBase64: base64Audio,
      mimeType: 'audio/pcm;rate=24000',
    });
  } catch (err: any) {
    console.error('TTS error:', err);
    return res.status(500).json({
      error: err.message || 'Failed to generate voice narration.',
    });
  }
});

// Dev & Production frontend serving
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`ComicCraft server running on http://0.0.0.0:${PORT}`);
});
