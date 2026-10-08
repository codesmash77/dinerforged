import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, X, Clock, Play, Pause, RotateCcw, Move, BellRing, Plus, Minus } from 'lucide-react';

export const SmartKitchenAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 380, y: window.innerHeight - 200 });
  const [isDragging, setIsDragging] = useState(false);
  
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
  });

  // Timer States
  const [timeLeft, setTimeLeft] = useState<number>(300); // default 5 mins in seconds
  const [initialDuration, setInitialDuration] = useState<number>(300);
  const [isRunning, setIsRunning] = useState(false);
  const [timerLabel, setTimerLabel] = useState('General Cooking');

  // Smooth RAF position tracking to prevent any layout jank
  const posRef = useRef(position);
  posRef.current = position;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: posRef.current.x,
      initialY: posRef.current.y,
    };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    setIsDragging(true);
    dragRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      initialX: posRef.current.x,
      initialY: posRef.current.y,
    };
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    
    const newX = Math.max(10, Math.min(window.innerWidth - 320, dragRef.current.initialX + dx));
    const newY = Math.max(10, Math.min(window.innerHeight - 100, dragRef.current.initialY + dy));
    
    requestAnimationFrame(() => {
      setPosition({ x: newX, y: newY });
    });
  }, [isDragging]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || e.touches.length === 0) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragRef.current.startX;
    const dy = touch.clientY - dragRef.current.startY;
    
    const newX = Math.max(10, Math.min(window.innerWidth - 320, dragRef.current.initialX + dx));
    const newY = Math.max(10, Math.min(window.innerHeight - 100, dragRef.current.initialY + dy));
    
    requestAnimationFrame(() => {
      setPosition({ x: newX, y: newY });
    });
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleDragEnd]);

  // Countdown Interval Effect
  useEffect(() => {
    let interval: any;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            try {
              // Subtle audio beep alert if supported
              const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.frequency.value = 587.33; // D5 note
              gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
              osc.start();
              osc.stop(audioCtx.currentTime + 0.5);
            } catch (e) {
              // Audio context blocked or unsupported
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const setPresetTimer = (seconds: number, label: string) => {
    setInitialDuration(seconds);
    setTimeLeft(seconds);
    setTimerLabel(label);
    setIsRunning(true);
  };

  const adjustTime = (amount: number) => {
    setTimeLeft((prev) => Math.max(0, prev + amount));
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainSecs = secs % 60;
    return `${mins}:${remainSecs < 10 ? '0' : ''}${remainSecs}`;
  };

  const progressPercentage = initialDuration > 0 ? ((initialDuration - timeLeft) / initialDuration) * 100 : 0;

  return (
    <div
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      className="fixed z-50 select-none will-change-transform"
    >
      {isOpen ? (
        <div className="w-80 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 space-y-4">
          
          {/* Draggable Header */}
          <div 
            className="flex items-center justify-between border-b pb-2.5 dark:border-slate-800 cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <div className="flex items-center gap-2 text-culinary-500 font-bold text-xs uppercase tracking-wide">
              <Move className="h-4 w-4 text-slate-400" />
              <Sparkles className="h-4 w-4" />
              <span>Smart Kitchen Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Active Timer Display & Ring */}
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-100 dark:border-slate-800 text-center space-y-3 relative overflow-hidden">
            
            {/* Progress background bar */}
            <div 
              className="absolute bottom-0 left-0 top-0 bg-culinary-500/10 dark:bg-culinary-500/20 transition-all duration-300 pointer-events-none"
              style={{ width: `${progressPercentage}%` }}
            />

            <div className="relative z-10">
              <div className="text-[11px] font-bold text-culinary-600 dark:text-culinary-400 uppercase tracking-wide">
                {timerLabel}
              </div>
              <div className="text-3xl font-mono font-extrabold text-slate-900 dark:text-white my-1">
                {formatTime(timeLeft)}
              </div>
              {timeLeft === 0 && (
                <div className="flex items-center justify-center gap-1 text-xs font-bold text-red-500 animate-bounce">
                  <BellRing className="h-3.5 w-3.5" /> Timer Complete!
                </div>
              )}
            </div>

            {/* Timer Controls */}
            <div className="relative z-10 flex items-center justify-center gap-2 pt-1">
              <button
                onClick={() => adjustTime(-60)}
                title="Subtract 1 minute"
                className="rounded-lg bg-slate-200 dark:bg-slate-700 px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition-colors"
              >
                -1m
              </button>
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="flex items-center gap-1.5 rounded-xl bg-culinary-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-culinary-400 transition-colors shadow-sm"
              >
                {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>{isRunning ? 'Pause' : 'Start'}</span>
              </button>
              <button
                onClick={() => {
                  setIsRunning(false);
                  setTimeLeft(initialDuration);
                }}
                title="Reset Timer"
                className="rounded-lg border border-slate-300 dark:border-slate-700 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => adjustTime(60)}
                title="Add 1 minute"
                className="rounded-lg bg-slate-200 dark:bg-slate-700 px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition-colors"
              >
                +1m
              </button>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Presets</span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setPresetTimer(180, 'Boiling Eggs')}
                className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-culinary-500/20 hover:text-culinary-400 transition-colors text-center"
              >
                🥚 3m Eggs
              </button>
              <button
                onClick={() => setPresetTimer(300, 'Steaming Veggies')}
                className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-culinary-500/20 hover:text-culinary-400 transition-colors text-center"
              >
                🥦 5m Steam
              </button>
              <button
                onClick={() => setPresetTimer(1200, 'Baking / Roasting')}
                className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-culinary-500/20 hover:text-culinary-400 transition-colors text-center"
              >
                🔥 20m Bake
              </button>
            </div>
          </div>

        </div>
      ) : (
        <button
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onClick={() => {
            // Only open if it was a click, not a drag movement
            setIsOpen(true);
          }}
          className="flex items-center gap-2.5 rounded-full bg-culinary-500 px-4 py-3 text-xs font-bold text-slate-950 shadow-2xl hover:bg-culinary-400 transition-all cursor-pointer border border-culinary-400/50 hover:scale-105"
        >
          <Sparkles className="h-4 w-4 animate-spin-slow" />
          <span>AI Assistant & Timers</span>
        </button>
      )}
    </div>
  );
};
