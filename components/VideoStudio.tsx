
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { GeneratedVideo } from '../types';

const VideoStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [history, setHistory] = useState<GeneratedVideo[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    setProgress("Connecting to Veo clusters...");
    
    try {
      const url = await geminiService.generateVideo(prompt, (status) => setProgress(status));
      setHistory(prev => [{ url, prompt, timestamp: Date.now(), status: 'completed' }, ...prev]);
    } catch (error) {
      console.error(error);
      alert("Video generation failed. Please try again with a different prompt.");
    } finally {
      setIsGenerating(false);
      setProgress("");
    }
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-2">Cinematic Video Creation</h3>
            <p className="text-slate-400 mb-6">Describe a scene, and our AI will bring it to life with 720p cinematic motion.</p>
            
            <div className="space-y-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A drone shot of a misty mountain range during sunrise, with eagles soaring through the clouds..."
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-slate-100 focus:ring-2 focus:ring-blue-500/50 outline-none resize-none h-32 text-lg shadow-inner"
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-xl shadow-purple-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-3 text-lg"
              >
                {isGenerating ? (
                   <>
                    <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{progress}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Generate Video
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        </div>

        {/* Video History */}
        <div className="space-y-6">
          <h4 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <span>Recent Generations</span>
            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md">{history.length}</span>
          </h4>
          
          <div className="grid grid-cols-1 gap-8">
            {history.map((video, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <video 
                  src={video.url} 
                  controls 
                  className="w-full aspect-video bg-black"
                  poster="https://picsum.photos/seed/video/1280/720"
                />
                <div className="p-6">
                  <p className="text-slate-200 font-medium italic">"{video.prompt}"</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-500">{new Date(video.timestamp).toLocaleString()}</span>
                    <a 
                      href={video.url} 
                      download="nexus-video.mp4"
                      className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest"
                    >
                      Export MP4
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoStudio;
