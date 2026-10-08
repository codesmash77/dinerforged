import React, { useState } from 'react';
import { Timer, Play, Pause, RotateCcw, X, Volume2, VolumeX, Sparkles, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { useTimerStore } from '../../store/useTimerStore';
import { useRecipeVoice } from '../../hooks/useRecipeVoice';

interface SmartKitchenAssistantProps {
  activeRecipeTitle?: string;
  instructions?: string[];
}

export const SmartKitchenAssistant: React.FC<SmartKitchenAssistantProps> = ({ activeRecipeTitle, instructions = [] }) => {
  const { timers, addTimer, toggleTimer, removeTimer, resetTimer } = useTimerStore();
  const { speak, stop, isSpeaking } = useRecipeVoice();
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const presets = [
    { label: 'Soft Boiled Egg (6m)', secs: 360 },
    { label: 'Rest Steak (8m)', secs: 480 },
    { label: 'Quick Simmer (15m)', secs: 900 },
    { label: 'Dough Proof (1h)', secs: 3600 },
  ];

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleReadStep = (index: number) => {
    if (instructions[index]) {
      setActiveStepIndex(index);
      speak(`Step ${index + 1}: ${instructions[index]}`);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 w-80 sm:w-96 rounded-2xl border border-culinary-500/30 bg-slate-900/95 p-4 text-white shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2 text-culinary-400 font-bold text-sm">
          <Timer className="h-5 w-5 animate-pulse" />
          <span>Kitchen Assistant {timers.length > 0 && `(${timers.length})`}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="mt-3 space-y-4">
          {/* Quick Preset Timers */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Quick Presets</p>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => addTimer(preset.label, preset.secs)}
                  className="flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-culinary-500 hover:text-slate-950 transition-colors border border-slate-700"
                >
                  <Plus className="h-3 w-3" />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Timers List */}
          {timers.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Active Timers</p>
              <div className="max-h-40 space-y-2 overflow-y-auto pr-1">
                {timers.map((timer) => {
                  const isDone = timer.remainingSeconds === 0;
                  return (
                    <div
                      key={timer.id}
                      className={`flex items-center justify-between rounded-xl border p-2.5 transition-colors ${
                        isDone ? 'border-red-500 bg-red-950/40 animate-bounce' : 'border-slate-800 bg-slate-800/50'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white truncate">{timer.title}</p>
                        <p className={`font-mono text-sm font-extrabold ${isDone ? 'text-red-400' : 'text-culinary-400'}`}>
                          {isDone ? 'TIME IS UP! 🔔' : formatTime(timer.remainingSeconds)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {!isDone && (
                          <button
                            onClick={() => toggleTimer(timer.id)}
                            className="rounded-lg p-1.5 bg-slate-700 text-white hover:bg-slate-600"
                          >
                            {timer.isRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                          </button>
                        )}
                        <button
                          onClick={() => resetTimer(timer.id)}
                          className="rounded-lg p-1.5 bg-slate-700 text-white hover:bg-slate-600"
                        >
                          <RotateCcw className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => removeTimer(timer.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/30"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Voice Narration Controls for Active Recipe Instructions */}
          {instructions.length > 0 && (
            <div className="border-t border-slate-800 pt-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Voice Narration</p>
                {isSpeaking && (
                  <button
                    onClick={stop}
                    className="flex items-center gap-1 text-[11px] font-bold text-red-400 hover:underline"
                  >
                    <VolumeX className="h-3.5 w-3.5" /> Stop Speech
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between bg-slate-800/80 rounded-xl p-2.5 border border-slate-700">
                <span className="text-xs text-slate-300 truncate max-w-[200px]">
                  Step {activeStepIndex + 1}: {instructions[activeStepIndex]}
                </span>
                <button
                  onClick={() => handleReadStep(activeStepIndex)}
                  className="flex items-center gap-1.5 rounded-lg bg-culinary-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-culinary-400 transition-colors shrink-0"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>Read Step</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};