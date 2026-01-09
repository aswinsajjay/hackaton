
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { SphereSettings } from '../types';

interface SphereProps {
  settings: SphereSettings;
  onUpdateSettings: (newSettings: Partial<SphereSettings>) => void;
}

const Sphere: React.FC<SphereProps> = ({ settings, onUpdateSettings }) => {
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    lastPos.current = { x: clientX, y: clientY };
    onUpdateSettings({ autoRotate: false });
  };

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
    const deltaX = clientX - lastPos.current.x;
    const deltaY = clientY - lastPos.current.y;

    onUpdateSettings({
      rotationY: settings.rotationY + deltaX * 0.5,
      rotationX: settings.rotationX - deltaY * 0.5,
    });

    lastPos.current = { x: clientX, y: clientY };
  }, [isDragging, settings.rotationX, settings.rotationY, onUpdateSettings]);

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove]);

  useEffect(() => {
    let animationId: number;
    const animate = () => {
      if (settings.autoRotate && !isDragging) {
        onUpdateSettings({
          rotationY: settings.rotationY + 0.3,
          rotationX: settings.rotationX + 0.1,
        });
      }
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [settings.autoRotate, isDragging, settings.rotationX, settings.rotationY, onUpdateSettings]);

  // Generate Latitude Rings
  const latitudeRings = useMemo(() => {
    const rings = [];
    const count = settings.rings;
    for (let i = 0; i <= count; i++) {
      const angle = (180 / count) * i;
      // Calculate radius of the ring at this latitude
      const rad = (settings.size / 2) * Math.sin((angle * Math.PI) / 180);
      const zOffset = (settings.size / 2) * Math.cos((angle * Math.PI) / 180);
      
      rings.push(
        <div
          key={`lat-${i}`}
          className="absolute rounded-full border border-cyan-500/30 transition-all duration-300"
          style={{
            width: `${rad * 2}px`,
            height: `${rad * 2}px`,
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) translateZ(${zOffset}px)`,
            boxShadow: `0 0 ${settings.glowIntensity}px ${settings.neonColor} inset`,
            borderWidth: '1px',
          }}
        />
      );
    }
    return rings;
  }, [settings.size, settings.rings, settings.glowIntensity, settings.neonColor]);

  // Generate Longitude Rings
  const longitudeRings = useMemo(() => {
    const rings = [];
    const count = settings.segments;
    for (let i = 0; i < count; i++) {
      const angle = (180 / count) * i;
      rings.push(
        <div
          key={`long-${i}`}
          className="absolute rounded-full border border-cyan-500/20"
          style={{
            width: `${settings.size}px`,
            height: `${settings.size}px`,
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) rotateY(${angle}deg)`,
            boxShadow: `0 0 ${settings.glowIntensity / 2}px ${settings.neonColor}`,
            borderWidth: '1px',
          }}
        />
      );
    }
    return rings;
  }, [settings.size, settings.segments, settings.glowIntensity, settings.neonColor]);

  return (
    <div 
      className="relative flex items-center justify-center cursor-grab active:cursor-grabbing"
      style={{ perspective: '1200px', width: '100%', height: '100%' }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      onClick={() => onUpdateSettings({ autoRotate: !settings.autoRotate })}
    >
      <div
        className="relative preserve-3d"
        style={{
          width: `${settings.size}px`,
          height: `${settings.size}px`,
          transformStyle: 'preserve-3d',
          transform: `rotateX(${settings.rotationX}deg) rotateY(${settings.rotationY}deg)`,
        }}
      >
        {/* Core Glow */}
        <div 
          className="absolute inset-4 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none"
          style={{ transform: 'translateZ(0px)' }}
        />

        {/* Geometry Layers */}
        {latitudeRings}
        {longitudeRings}
      </div>

      {/* Static Atmospheric Rim */}
      <div 
        className="absolute rounded-full pointer-events-none transition-all duration-500"
        style={{ 
          width: `${settings.size + 40}px`, 
          height: `${settings.size + 40}px`,
          background: `radial-gradient(circle, transparent 60%, ${settings.neonColor} 100%)`,
          opacity: 0.1,
          filter: 'blur(20px)'
        }}
      />
    </div>
  );
};

export default Sphere;
