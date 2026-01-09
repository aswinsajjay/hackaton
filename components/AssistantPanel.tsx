
import React, { useState, useEffect, useRef } from 'react';
import { getVivaExplanation, chatWithAssistant } from '../services/geminiService';
import { VivaFact, ChatMessage } from '../types';

const AssistantPanel: React.FC = () => {
  const [vivaFact, setVivaFact] = useState<VivaFact | null>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInitialExplanation = async () => {
    setLoading(true);
    const fact = await getVivaExplanation("CSS 3D Transforms and Spherical Projections");
    setVivaFact(fact);
    setLoading(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const response = await chatWithAssistant(input, messages);
      const assistantMsg: ChatMessage = { role: 'model', text: response };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: 'Error contacting assistant.' }]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-slate-800 bg-slate-800/30 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold">
          AI
        </div>
        <div>
          <h3 className="font-bold text-sm">Aura Technical Assistant</h3>
          <p className="text-[10px] text-slate-400">Ready for Viva prep</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !vivaFact && (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center text-2xl">
              💡
            </div>
            <p className="text-sm text-slate-400 px-6">
              Ask me anything about how this 3D sphere works, CSS mathematics, or computer graphics.
            </p>
            <button 
              onClick={handleInitialExplanation}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Get Technical Overview
            </button>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500"></div>
          </div>
        )}

        {vivaFact && (
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
            <h4 className="font-bold text-cyan-400 text-sm mb-2 uppercase tracking-tighter">{vivaFact.topic}</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">{vivaFact.explanation}</p>
            {vivaFact.codeSnippet && (
              <pre className="text-[10px] bg-black/40 p-3 rounded-xl overflow-x-auto text-cyan-200 border border-white/5">
                <code>{vivaFact.codeSnippet}</code>
              </pre>
            )}
          </div>
        )}

        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-slate-800 text-slate-200 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 bg-slate-800/30 border-t border-slate-800 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a question..."
          className="flex-1 bg-slate-900/50 border border-slate-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
        />
        <button 
          type="submit"
          className="w-10 h-10 bg-cyan-600 hover:bg-cyan-500 rounded-full flex items-center justify-center transition-transform active:scale-95"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default AssistantPanel;
