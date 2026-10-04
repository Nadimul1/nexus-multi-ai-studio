
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  // 1. Text Chat
  async chat(message: string, history: {role: string, parts: {text: string}[]}[] = []) {
    const ai = getAI();
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "You are Nexus, a helpful and sophisticated AI creative assistant. You provide concise, intelligent, and helpful responses across text, code, and creative tasks.",
      }
    });
    
    // In a real app we would feed the history, but for this demo we'll use simple generation
    // or properly formatted chat history if passed.
    const response = await chat.sendMessage({ message });
    return response.text;
  },

  // 2. Image Generation
  async generateImage(prompt: string, aspectRatio: "1:1" | "4:3" | "16:9" | "9:16" = "1:1") {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: { aspectRatio }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in response");
  },

  // 3. Video Generation (Veo)
  async generateVideo(prompt: string, onProgress: (status: string) => void) {
    const ai = getAI();
    onProgress("Initializing video generation engine...");
    
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    onProgress("Generating frames... This can take a minute.");
    
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 8000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
      onProgress("Applying textures and motion...");
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation failed");

    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await videoResponse.blob();
    return URL.createObjectURL(blob);
  },

  // 4. Voice Synthesis (TTS)
  async generateSpeech(text: string, voiceName: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr' = 'Zephyr') {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Speak naturally: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data received");
    return base64Audio;
  }
};

// Audio Utilities
export function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
