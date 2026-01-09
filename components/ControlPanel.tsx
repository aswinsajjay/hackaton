
import React from 'react';
import { SphereSettings } from '../types';

interface ControlPanelProps {
  settings: SphereSettings;
  onUpdate: (newSettings: Partial<SphereSettings>) => void;
  onExplain: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ settings, onUpdate, onExplain }) => {
  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl h-full shadow-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white tracking-tight">Sphere Lab</h2>
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs uppercase font-semibold text-slate-400">Ring Density (Lat/Long)</label>
          <input 
            type="range" min="6" max="36" value={settings.rings} 
            onChange={(e) => onUpdate({ rings: parseInt(e.target.value), segments: Math.floor(parseInt(e.target.value) / 1.5) })}
            className="w-full accent-cyan-500 bg-slate-800 rounded-lg h-1.5 appearance-none cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase font-semibold text-slate-400">Glow Intensity</label>
          <input 
            type="range" min="0" max="30" value={settings.glowIntensity} 
            onChange={(e) => onUpdate({ glowIntensity: parseInt(e.target.value) })}
            className="w-full accent-cyan-500 bg-slate-800 rounded-lg h-1.5 appearance-none cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-2xl border border-slate-700/50">
          <span className="text-sm font-medium">Auto-Rotation</span>
          <button 
            onClick={() => onUpdate({ autoRotate: !settings.autoRotate })}
            className={`w-12 h-6 rounded-full transition-colors relative ${settings.autoRotate ? 'bg-cyan-500' : 'bg-slate-700'}`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.autoRotate ? 'translate-x-6' : ''}`} />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase font-semibold text-slate-400">Hologram Theme</label>
          <div className="flex gap-3">
            {[
              { label: 'Cyan', color: 'rgba(34, 211, 238, 0.4)' },
              { label: 'Violet', color: 'rgba(167, 139, 250, 0.4)' },
              { label: 'Amber', color: 'rgba(251, 191, 36, 0.4)' },
              { label: 'Emerald', color: 'rgba(52, 211, 153, 0.4)' }
            ].map((theme, i) => (
              <button
                key={i}
                onClick={() => onUpdate({ neonColor: theme.color })}
                className="w-8 h-8 rounded-full border-2 border-transparent hover:border-white transition-all shadow-lg"
                style={{ backgroundColor: theme.color.replace('0.4', '1') }}
                title={theme.label}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto space-y-3">
        <button 
          onClick={onExplain}
          className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-cyan-900/20 flex items-center justify-center gap-2 group"
        >
          <span>Viva Study Guide</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
        <p className="text-[10px] text-center text-slate-500 uppercase tracking-widest font-bold">
          Gemini 3 Pro Engine
        </p>
      </div>
    </div>
  );
};

export default ControlPanel;
