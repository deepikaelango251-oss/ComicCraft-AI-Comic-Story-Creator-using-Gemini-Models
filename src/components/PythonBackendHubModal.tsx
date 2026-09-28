import React, { useState } from 'react';
import { X, Code2, Terminal, Copy, Check, Download, Layers, Sparkles, Cpu, BookOpen } from 'lucide-react';

interface PythonBackendHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FASTAPI_MAIN_CODE = `"""
ComicCraft - FastAPI Backend Service
Workflow: User Input -> Gemini Flash -> Gemini Pro -> Stable Diffusion -> Layout Builder -> FPDF
Run with: uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import List, Optional
import os
import google.generativeai as genai
from pdf_service import create_comic_pdf
from diffusion_pipeline import ComicDiffusionPipeline

app = FastAPI(title="ComicCraft AI Comic Creator", version="1.0.0")

# Configure Google Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# Initialize Stable Diffusion pipeline
diffuser = ComicDiffusionPipeline()

class StoryInput(BaseModel):
    story_prompt: str
    character_name: str
    setting: str
    tone: str
    art_style: str
    panel_count: int = 5

@app.post("/api/generate_outline")
async def generate_outline(data: StoryInput):
    """Stage 1: Gemini Flash generates structured 5-panel comic outline"""
    model = genai.GenerativeModel("gemini-3.8-flash")
    prompt = f"""
    Act as a comic book architect. Generate a structured 5-panel comic outline:
    Premise: {data.story_prompt}
    Main Character: {data.character_name}
    Setting: {data.setting}
    Tone: {data.tone}
    Return JSON with: title, tagline, synopsis, and 5 panel beat outlines (Act 1 Setup, Act 2 Spark, Act 3 Conflict, Act 4 Climax, Act 5 Resolution).
    """
    response = model.generate_content(prompt)
    return {"outline": response.text}

@app.post("/api/generate_story_and_dialogue")
async def generate_story_and_dialogue(outline_data: dict):
    """Stage 2: Gemini develops character dialogues, narration captions, SFX, and diffusion prompts"""
    model = genai.GenerativeModel("gemini-3.8-flash")
    prompt = f"Develop rich dialogues, narration boxes, SFX, and Stable Diffusion prompts for: {outline_data}"
    response = model.generate_content(prompt)
    return {"comic_script": response.text}

@app.post("/api/generate_panel_images")
async def generate_panel_images(prompts: List[str]):
    """Stage 3: Stable Diffusion creates panel illustrations"""
    image_paths = []
    for idx, prompt in enumerate(prompts):
        path = diffuser.generate_comic_panel(prompt, f"panel_{idx+1}.png")
        image_paths.append(path)
    return {"image_paths": image_paths}

@app.post("/api/export_pdf")
async def export_pdf(comic_data: dict):
    """Stage 4: FPDF converts the completed comic into a downloadable PDF"""
    pdf_path = create_comic_pdf(comic_data)
    return FileResponse(pdf_path, media_type="application/pdf", filename="comiccraft_story.pdf")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
`;

const FPDF_SERVICE_CODE = `"""
ComicCraft - FPDF PDF Generation Service
Converts structured comic panels, dialogues, and images into high-res comic books.
"""

from fpdf import FPDF
import os

class ComicPDF(FPDF):
    def header(self):
        self.set_font('Helvetica', 'B', 10)
        self.set_text_color(120, 120, 120)
        self.cell(0, 8, 'COMICCRAFT - AI STORY CREATOR', 0, 1, 'R')
        self.ln(2)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

def create_comic_pdf(comic_data: dict, output_filename="comic_story.pdf") -> str:
    pdf = ComicPDF(orientation='P', unit='mm', format='A4')
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # Page 1: Cover & Dramatis Personae
    pdf.add_page()
    pdf.set_fill_color(245, 158, 11) # Amber
    pdf.rect(10, 10, 190, 12, 'F')
    pdf.set_font('Helvetica', 'B', 16)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 12, comic_data.get('title', 'COMIC STORY').upper(), 0, 1, 'C')
    pdf.ln(5)
    
    # Panels Layout
    panels = comic_data.get('panels', [])
    for panel in panels:
        pdf.set_draw_color(0, 0, 0)
        pdf.set_line_width(0.8)
        # Render panel box, narration, and dialogues
        pdf.set_fill_color(254, 240, 138)
        pdf.rect(15, pdf.get_y(), 180, 10, 'F')
        pdf.set_font('Helvetica', 'B', 9)
        pdf.cell(0, 10, f"PANEL #{panel.get('panelNumber')}: {panel.get('cameraAngle', '')}", 0, 1, 'L')
        pdf.ln(40) # Space for image
        
    pdf.output(output_filename)
    return output_filename
`;

const DIFFUSION_CODE = `"""
ComicCraft - Stable Diffusion Illustration Engine
Uses Hugging Face diffusers to render comic-style illustrations.
"""

import torch
from diffusers import StableDiffusionPipeline
from PIL import Image

class ComicDiffusionPipeline:
    def __init__(self, model_id="runwayml/stable-diffusion-v1-5"):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.pipe = StableDiffusionPipeline.from_pretrained(
            model_id,
            torch_dtype=torch.float16 if self.device == "cuda" else torch.float32
        ).to(self.device)

    def generate_comic_panel(self, prompt: str, output_path: str, style="comic book art") -> str:
        enhanced_prompt = f"comic book art, graphic novel, highly detailed, clean lines, {style}, {prompt}"
        negative_prompt = "low quality, blurry, deformed, watermark, photorealistic"
        
        image = self.pipe(
            prompt=enhanced_prompt,
            negative_prompt=negative_prompt,
            num_inference_steps=25,
            guidance_scale=7.5
        ).images[0]
        
        image.save(output_path)
        return output_path
`;

const REQUIREMENTS_CODE = `fastapi>=0.100.0
uvicorn>=0.22.0
jinja2>=3.1.2
pydantic>=2.0.0
google-generativeai>=0.8.0
diffusers>=0.21.0
transformers>=4.30.0
torch>=2.0.0
accelerate>=0.20.0
fpdf2>=2.7.0
pillow>=10.0.0
`;

const README_CODE = `# ComicCraft - Python & FastAPI Architecture

## Overview
ComicCraft combines Google Gemini for 2-stage story creation and Stable Diffusion for panel illustrations.

## Project Workflow
User Input -> Gemini Flash (Outline) -> Gemini Pro (Story & Dialogue) -> Stable Diffusion (Images) -> Layout Builder -> FPDF (Downloadable PDF)

## Getting Started

1. Create and activate a Python virtual environment:
\`\`\`bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
\`\`\`

2. Install dependencies:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

3. Set your Google Gemini API key:
\`\`\`bash
export GEMINI_API_KEY="your_api_key_here"
\`\`\`

4. Run the FastAPI development server with Uvicorn:
\`\`\`bash
uvicorn main:app --reload --port 8000
\`\`\`

5. Open your browser at http://localhost:8000
`;

export const PythonBackendHubModal: React.FC<PythonBackendHubModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'workflow' | 'main' | 'fpdf' | 'diffusers' | 'readme'>('workflow');
  const [copied, setCopied] = useState(false);

  const getActiveCode = () => {
    switch (activeTab) {
      case 'main':
        return FASTAPI_MAIN_CODE;
      case 'fpdf':
        return FPDF_SERVICE_CODE;
      case 'diffusers':
        return DIFFUSION_CODE;
      case 'readme':
        return README_CODE;
      default:
        return FASTAPI_MAIN_CODE;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const filename =
      activeTab === 'main'
        ? 'main.py'
        : activeTab === 'fpdf'
        ? 'pdf_service.py'
        : activeTab === 'diffusers'
        ? 'diffusion_pipeline.py'
        : 'README.md';

    const blob = new Blob([getActiveCode()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border-4 border-black comic-shadow-lg text-white my-8 max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-amber-400 border-b-4 border-black text-black">
          <div className="flex items-center gap-2">
            <Terminal className="w-6 h-6" />
            <span className="font-bangers text-2xl tracking-wide">
              FASTAPI & PYTHON ARCHITECTURE HUB
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
        <div className="flex flex-wrap border-b-2 border-slate-700 bg-slate-950 px-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('workflow')}
            className={`py-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'workflow' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Pipeline Workflow
          </button>
          <button
            onClick={() => setActiveTab('main')}
            className={`py-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'main' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" /> main.py (FastAPI)
          </button>
          <button
            onClick={() => setActiveTab('fpdf')}
            className={`py-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'fpdf' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> pdf_service.py (FPDF)
          </button>
          <button
            onClick={() => setActiveTab('diffusers')}
            className={`py-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'diffusers' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> diffusion_pipeline.py
          </button>
          <button
            onClick={() => setActiveTab('readme')}
            className={`py-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'readme' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" /> README.md & Setup
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'workflow' ? (
            <div className="space-y-6">
              <div className="bg-slate-950 p-4 border-2 border-slate-800 rounded">
                <h3 className="font-bangers text-xl text-amber-400 tracking-wide mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" /> End-to-End Project Workflow
                </h3>
                <p className="text-xs text-slate-300 font-comic mb-4">
                  How ComicCraft transforms a simple user prompt into a publication-ready comic book and downloadable PDF.
                </p>

                {/* Workflow Diagram */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-900 p-3 rounded border border-amber-400/40">
                    <span className="font-bold text-amber-400 block mb-1">1. User Inputs</span>
                    <p className="text-slate-300">Prompt, Character Name, Setting, Tone, and Art Style.</p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded border border-cyan-400/40">
                    <span className="font-bold text-cyan-400 block mb-1">2. Gemini Flash</span>
                    <p className="text-slate-300">Generates structured 5-panel comic outline and dramatic story arc.</p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded border border-purple-400/40">
                    <span className="font-bold text-purple-400 block mb-1">3. Gemini Pro</span>
                    <p className="text-slate-300">Develops rich character dialogues, narration boxes, and SFX.</p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded border border-rose-400/40">
                    <span className="font-bold text-rose-400 block mb-1">4. Stable Diffusion</span>
                    <p className="text-slate-300">Generates styled comic illustrations for each panel.</p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded border border-emerald-400/40">
                    <span className="font-bold text-emerald-400 block mb-1">5. Layout Builder</span>
                    <p className="text-slate-300">Organizes panels into responsive comic grid and webtoon views.</p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded border border-yellow-400/40">
                    <span className="font-bold text-yellow-400 block mb-1">6. FPDF PDF Export</span>
                    <p className="text-slate-300">Compiles the complete story into a downloadable PDF comic.</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 border border-slate-800 rounded text-xs space-y-2 font-mono">
                <span className="font-bold text-amber-400 block">Core Tech Stack:</span>
                <p className="text-slate-300">
                  Python | FastAPI | Uvicorn | Jinja2 | Google Gemini | Stable Diffusion | Hugging Face Diffusers | PyTorch | FPDF | HTML/CSS | Git
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  Filename: {activeTab === 'main' ? 'main.py' : activeTab === 'fpdf' ? 'pdf_service.py' : activeTab === 'diffusers' ? 'diffusion_pipeline.py' : 'README.md'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                  <button
                    onClick={handleDownloadFile}
                    className="bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              <pre className="bg-black/90 p-4 rounded border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto max-h-[50vh] leading-relaxed">
                <code>{getActiveCode()}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t-2 border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
          >
            Close Hub
          </button>
        </div>
      </div>
    </div>
  );
};
