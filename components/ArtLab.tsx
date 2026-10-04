
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { GeneratedImage } from '../types';

const ArtLab: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "4:3" | "16:9" | "9:16">("1:1");
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const url = await geminiService.generateImage(prompt, aspectRatio);
      setHistory(prev => [{ url, prompt, timestamp: Date.now() }, ...prev]);
    } catch (error) {
      console.error(error);
      alert("Failed to generate image. Ensure your prompt is valid and within safety guidelines.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl h-fit">
          <h3 className="text-lg font-bold text-slate-100 mb-4">Creation Controls</h3>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic city with purple neon lights..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none resize-none h-32"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Aspect Ratio</label>
            <div className="grid grid-cols-2 gap-2">
              {(["1:1", "4:3", "16:9", "9:16"] as const).map(ratio => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`py-2 text-xs rounded-lg border transition-all ${
                    aspectRatio === ratio 
                      ? 'bg-blue-600 border-blue-500 text-white' 
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : 'Generate Masterpiece'}
          </button>
        </div>

        {/* Gallery */}
        <div className="lg:col-span-3 space-y-6">
          {history.length === 0 && !isLoading && (
            <div className="h-96 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-500 gap-4">
              <svg className="w-16 h-16 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-lg">Your creations will appear here</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading && (
              <div className="aspect-square bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center animate-pulse overflow-hidden">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full mx-auto flex items-center justify-center">
                    <div className="w-6 h-6 bg-blue-500 rounded-full animate-ping"></div>
                  </div>
                  <p className="text-sm text-slate-400">Rendering Pixels...</p>
                </div>
              </div>
            )}
            {history.map((img, idx) => (
              <div key={idx} className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all hover:scale-[1.02]">
                <img src={img.url} alt={img.prompt} className="w-full h-auto object-cover aspect-square" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                  <p className="text-sm text-white font-medium line-clamp-2">{img.prompt}</p>
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = img.url;
                      link.download = `nexus-art-${Date.now()}.png`;
                      link.click();
                    }}
                    className="mt-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-white text-xs font-bold transition-all"
                  >
                    Download 4K
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtLab;
