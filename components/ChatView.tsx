
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { geminiService } from '../services/geminiService';

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am Nexus. How can I assist you in your creative journey today?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await geminiService.chat(input);
      setMessages(prev => [...prev, { role: 'model', text: response || 'No response', timestamp: Date.now() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Error connecting to Gemini. Please check your network or API key.', timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 max-w-4xl mx-auto w-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pr-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-5 py-4 ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'bg-slate-800 border border-slate-700 text-slate-100 shadow-xl'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              <span className="text-[10px] opacity-40 mt-2 block text-right">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 shadow-xl flex gap-2 items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask me anything..."
          className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-6 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-100 resize-none shadow-2xl"
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="absolute right-4 bottom-3 p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:opacity-50 text-white rounded-xl transition-all shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatView;
