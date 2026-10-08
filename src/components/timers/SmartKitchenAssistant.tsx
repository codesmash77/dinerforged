import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Clock, Play, Pause, RotateCcw, Move } from 'lucide-react';

export const SmartKitchenAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 380, y: window.innerHeight - 140 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
  });

  // Basic countdown timer state
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isRunning && timeLeft !== null && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  // Dragging Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    setIsDragging(true);
    dragRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      initialX: position.x,
      initialY: position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      
      const newX = Math.max(10, Math.min(window.innerWidth - 100, dragRef.current.initialX + dx));
      const newY = Math.max(10, Math.min(window.innerHeight - 100, dragRef.current.initialY + dy));
      
      setPosition({ x: newX, y: newY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length === 0) return;
      const touch = e.touches[0];
      const dx = touch.clientX - dragRef.current.startX;
      const dy = touch.clientY - dragRef.current.startY;
      
      const newX = Math.max(10, Math.min(window.innerWidth - 100, dragRef.current.initialX + dx));
      const newY = Math.max(10, Math.min(window.innerHeight - 100, dragRef.current.initialY + dy));
      
      setPosition({ x: newX, y: newY });
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

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
  }, [isDragging]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainSecs = secs % 60;
    return `${mins}:${remainSecs < 10 ? '0' : ''}${remainSecs}`;
  };

  return (
    <div
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      className="fixed z-50 select-none transition-shadow duration-200"
    >
      {isOpen ? (
        <div className="w-80 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 space-y-4">
          <div className="flex items-center justify-between border-b pb-2 dark:border-slate-800">
            <div className="flex items-center gap-2 cursor-grab active:cursor-grabbing" onMouseDown={handleMouseDown} onTouchStart={handleTouchStart}>
              <Move className="h-4 w-4 text-slate-400" />
              <div className="flex items-center gap-1.5 text-culinary-500 font-bold text-xs uppercase tracking-wide">
                <Sparkles className="h-4 w-4" />
                <span>Kitchen Assistant</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Timer Box */}
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-100 dark:border-slate-800 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Clock className="h-3.5 w-3.5 text-culinary-500" />
              <span>Active Timer</span>
            </div>
            <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white">
              {timeLeft !== null ? formatTime(timeLeft) : '0:00'}
            </div>
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                onClick={() => {
                  if (timeLeft === null) setTimeLeft(300); // default 5 mins
                  setIsRunning(!isRunning);
                }}
                className="flex items-center gap-1 rounded-lg bg-culinary-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-culinary-400 transition-colors"
              >
                {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>{isRunning ? 'Pause' : 'Start'}</span>
              </button>
              <button
                onClick={() => {
                  setIsRunning(false);
                  setTimeLeft(null);
                }}
                className="rounded-lg border border-slate-300 dark:border-slate-700 p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center">
            Drag the header handle to move this assistant anywhere on screen.
          </p>
        </div>
      ) : (
        <button
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onClick={() => {
            if (!isDragging) setIsOpen(true);
          }}
          className="flex items-center gap-2.5 rounded-full bg-culinary-500 px-4 py-3 text-xs font-bold text-slate-950 shadow-xl hover:bg-culinary-400 transition-all cursor-pointer border border-culinary-400/50 hover:scale-105"
        >
          <Sparkles className="h-4 w-4" />
          <span>AI Chef & Timers</span>
        </button>
      )}
    </div>
  );
};
