
import React, { useState, useEffect } from 'react';
import { AppTab } from './types';
import ChatView from './components/ChatView';
import ArtLab from './components/ArtLab';
import VideoStudio from './components/VideoStudio';
import VoiceSynth from './components/VoiceSynth';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.CHAT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Check for API Key on mount - Note: API_KEY is expected from process.env
  // For Veo/Pro features, users might need to select a key if not already present.
  const handleKeySetup = async () => {
    // In this environment, we assume process.env.API_KEY is available.
    // If using Veo, instructions say to check window.aistudio
    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
      // Logic for key selection would go here if we were forcing Pro model usage
      // For this demo, we'll proceed as requested in the instructions
    }
  };

  useEffect(() => {
    handleKeySetup();
  }, []);

  const tabs = [
    { id: AppTab.CHAT, label: 'Assistant', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { id: AppTab.IMAGES, label: 'Art Lab', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: AppTab.VIDEOS, label: 'Video Studio', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { id: AppTab.VOICE, label: 'Voice Synth', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' }
  ];

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <span className="font-bold text-white">N</span>
          </div>
          {isSidebarOpen && <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">NEXUS AI</h1>}
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                activeTab === tab.id 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {isSidebarOpen && <span className="font-medium">{tab.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <svg className={`w-5 h-5 transition-transform ${isSidebarOpen ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <h2 className="text-lg font-semibold text-slate-200">
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-4">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Model Online</span>
          </div>
        </header>

        {/* View Port */}
        <div className="flex-1 overflow-auto relative">
          {activeTab === AppTab.CHAT && <ChatView />}
          {activeTab === AppTab.IMAGES && <ArtLab />}
          {activeTab === AppTab.VIDEOS && <VideoStudio />}
          {activeTab === AppTab.VOICE && <VoiceSynth />}
        </div>
      </main>
    </div>
  );
};

export default App;
