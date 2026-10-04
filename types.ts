
export enum AppTab {
  CHAT = 'CHAT',
  IMAGES = 'IMAGES',
  VIDEOS = 'VIDEOS',
  VOICE = 'VOICE'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  image?: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

export interface GeneratedVideo {
  url: string;
  prompt: string;
  timestamp: number;
  status: 'processing' | 'completed' | 'failed';
}
