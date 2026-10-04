
import React, { useState } from 'react';
import { geminiService, decodeBase64, decodeAudioData } from '../services/geminiService';

const VoiceSynth: React.FC = () => {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState<'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr'>('Zephyr');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  
  const voices = [
    { name: 'Zephyr', gender: 'Balanced', description: 'Clear and sophisticated' },
    { name: 'Kore', gender: 'Feminine', description: 'Warm and inviting' },
    { name: 'Puck', gender: 'Masculine', description: 'Energetic and bright' },
    { name: 'Charon', gender: 'Deep', description: 'Authoritative and calm' },
    { name: 'Fenrir', gender: 'Deep', description: 'Mysterious and textured' },
  ];

  const handleSynthesize = async () => {
    if (!text.trim() || isSynthesizing) return;
    
    setIsSynthesizing(true);
    try {
      const base64Audio = await geminiService.generateSpeech(text, voice);
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const decodedData = decodeBase64(base64Audio);
      const audioBuffer = await decodeAudioData(decodedData, audioContext, 24000, 1);
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    } catch (error) {
      console.error(error);
      alert("Speech synthesis failed.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 items-center">
      <div className="max-w-2xl w-full space-y-8 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-white">Neural Voice Engine</h3>
          <p className="text-slate-400">Convert your scripts into high-fidelity AI speech.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Voice Character</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {voices.map((v) => (
                <button
                  key={v.name}
                  onClick={() => setVoice(v.name as any)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    voice === v.name 
                      ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-500/10' 
                      : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-bold ${voice === v.name ? 'text-blue-400' : 'text-slate-200'}`}>{v.name}</span>
                    <span className="text-[10px] bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded uppercase">{v.gender}</span>
                  </div>
                  <p className="text-xs text-slate-400">{v.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Input Script</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to speak..."
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-slate-100 focus:ring-2 focus:ring-blue-500/50 outline-none resize-none h-40 shadow-inner"
            />
          </div>

          <button
            onClick={handleSynthesize}
            disabled={isSynthesizing || !text.trim()}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
          >
            {isSynthesizing ? (
              <>
                <div className="flex gap-1">
                  <span className="w-1.5 h-6 bg-white animate-[bounce_1s_infinite]"></span>
                  <span className="w-1.5 h-6 bg-white animate-[bounce_1s_infinite_0.1s]"></span>
                  <span className="w-1.5 h-6 bg-white animate-[bounce_1s_infinite_0.2s]"></span>
                </div>
                <span>Synthesizing Audio...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                Speak Text
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceSynth;
