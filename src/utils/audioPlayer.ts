// Utility to decode raw 24kHz 16-bit PCM audio returned by Gemini TTS
let audioCtx: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;

export function stopCurrentAudio(): void {
  if (currentSource) {
    try {
      currentSource.stop();
      currentSource.disconnect();
    } catch {
      // Ignore if already stopped
    }
    currentSource = null;
  }
}

export async function playPcmAudio(base64Data: string, sampleRate = 24000, onEnded?: () => void): Promise<void> {
  stopCurrentAudio();

  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass({ sampleRate });
  }

  if (audioCtx.state === 'suspended') {
    await audioCtx.resume();
  }

  // Decode Base64 to binary
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Convert 16-bit signed PCM to float32 samples [-1.0, 1.0]
  const int16View = new Int16Array(bytes.buffer, bytes.byteOffset, bytes.byteLength / 2);
  const float32Samples = new Float32Array(int16View.length);
  for (let i = 0; i < int16View.length; i++) {
    float32Samples[i] = int16View[i] / 32768.0;
  }

  const audioBuffer = audioCtx.createBuffer(1, float32Samples.length, sampleRate);
  audioBuffer.copyToChannel(float32Samples, 0);

  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioCtx.destination);

  currentSource = source;
  source.onended = () => {
    if (currentSource === source) {
      currentSource = null;
    }
    onEnded?.();
  };

  source.start();
}
