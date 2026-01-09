
import React, { useState } from 'react';
import Sphere from './components/Sphere';
import ControlPanel from './components/ControlPanel';
import AssistantPanel from './components/AssistantPanel';
import { SphereSettings } from './types';

const App: React.FC = () => {
  const [settings, setSettings] = useState<SphereSettings>({
    rotationX: 20,
    rotationY: 30,
    autoRotate: true,
    size: 300,
    rings: 18,
    segments: 12,
    glowIntensity: 10,
    neonColor: 'rgba(34, 211, 238, 0.4)',
  });

  const updateSettings = (newSettings: Partial<SphereSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 overflow-hidden font-sans">
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-5" 
           style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/60 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)]">
              <svg className="w-6 h-6 text-slate-950" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight leading-none uppercase">Aura<span className="text-cyan-400">Sphere</span></h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Holographic Projection Lab</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase">Projection Method</p>
              <p className="text-sm font-mono text-cyan-400">CSS 3D Transforms</p>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase">Geometry</p>
              <p className="text-sm font-bold text-white tracking-tighter uppercase">Spherical Lattice</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row gap-6 p-6 mt-24 max-w-7xl mx-auto w-full items-stretch relative z-10">
        <aside className="w-full md:w-80 flex-shrink-0">
          <ControlPanel 
            settings={settings} 
            onUpdate={updateSettings}
            onExplain={() => {}}
          />
        </aside>

        <section className="flex-1 bg-slate-900/20 border border-white/5 rounded-[2rem] relative overflow-hidden flex items-center justify-center min-h-[500px] shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_70%)] pointer-events-none" />
          
          <Sphere settings={settings} onUpdateSettings={updateSettings} />

          {/* HUD Overlay Elements */}
          <div className="absolute top-6 right-6 font-mono text-[10px] text-cyan-500/40 space-y-1">
            <p>ROT_X: {settings.rotationX.toFixed(1)}°</p>
            <p>ROT_Y: {settings.rotationY.toFixed(1)}°</p>
            <p>FPS: 60.0</p>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 pointer-events-none shadow-xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)] animate-pulse" />
              Interaction: Mouse Drag • One-Object CSS 3D
            </p>
          </div>
        </section>

        <aside className="w-full md:w-96 flex-shrink-0">
          <AssistantPanel />
        </aside>
      </main>

      <footer className="p-8 text-center text-slate-600 relative z-10">
        <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-50">Scientific Visualization Prototype • Gemini AI Assistant Enabled</p>
      </footer>
    </div>
  );
};

export default App;
