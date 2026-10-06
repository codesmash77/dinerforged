import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Mic, MicOff, Play, Pause, RotateCcw } from 'lucide-react';
import { Recipe } from '../../types';

interface HandsFreeCookingModeProps {
  recipe: Recipe;
  onClose: () => void;
}

export const HandsFreeCookingMode: React.FC<HandsFreeCookingModeProps> = ({ recipe, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Web Speech API Voice Recognition setup
  useEffect(() => {
    let recognition: any = null;
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        if (transcript.includes('next')) {
          setCurrentStep((prev) => Math.min(recipe.instructions.length - 1, prev + 1));
        } else if (transcript.includes('back') || transcript.includes('previous')) {
          setCurrentStep((prev) => Math.max(0, prev - 1));
        }
      };
    }

    if (isListening && recognition) {
      recognition.start();
    } else if (recognition) {
      recognition.stop();
    }

    return () => {
      if (recognition) recognition.stop();
    };
  }, [isListening, recipe.instructions.length]);

  // Timer countdown hook
  useEffect(() => {
    let interval: any = null;
    if (isTimerActive && timerSeconds !== null && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => (prev !== null ? prev - 1 : 0));
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timerSeconds]);

  const startQuickTimer = (mins: number) => {
    setTimerSeconds(mins * 60);
    setIsTimerActive(true);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white p-6 md:p-12 overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-culinary-500">Hands-Free Cooking Mode</span>
          <h2 className="text-xl md:text-2xl font-bold">{recipe.title}</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsListening(!isListening)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
              isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            <span>{isListening ? 'Voice Control Active ("Next" / "Back")' : 'Enable Voice Control'}</span>
          </button>
          <button onClick={onClose} className="rounded-full bg-slate-800 p-2 text-slate-300 hover:bg-slate-700">
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Main Step Viewer */}
      <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto my-8">
        <div className="text-culinary-400 text-lg font-bold mb-2">
          Step {currentStep + 1} of {recipe.instructions.length}
        </div>
        <p className="text-2xl md:text-4xl font-medium leading-relaxed tracking-wide text-slate-100">
          {recipe.instructions[currentStep]}
        </p>

        {/* Dynamic Timer Widget */}
        <div className="mt-8 p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-400">Quick Timer:</span>
            {[3, 5, 10, 15].map((m) => (
              <button
                key={m}
                onClick={() => startQuickTimer(m)}
                className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold hover:bg-slate-700 text-culinary-400"
              >
                +{m}m
              </button>
            ))}
          </div>

          {timerSeconds !== null && (
            <div className="flex items-center gap-3">
              <span className="text-2xl font-mono font-bold text-culinary-400">{formatTimer(timerSeconds)}</span>
              <button
                onClick={() => setIsTimerActive(!isTimerActive)}
                className="rounded-lg bg-culinary-500 p-2 text-slate-950 font-bold"
              >
                {isTimerActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button
                onClick={() => { setTimerSeconds(null); setIsTimerActive(false); }}
                className="rounded-lg bg-slate-800 p-2 text-slate-400 hover:bg-slate-700"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Step Navigation */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-4">
        <button
          onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
          className="flex items-center gap-2 rounded-xl bg-slate-800 px-6 py-3 font-semibold text-white disabled:opacity-40 hover:bg-slate-700"
        >
          <ChevronLeft className="h-5 w-5" /> Previous
        </button>

        <button
          onClick={() => setCurrentStep((prev) => Math.min(recipe.instructions.length - 1, prev + 1))}
          disabled={currentStep === recipe.instructions.length - 1}
          className="flex items-center gap-2 rounded-xl bg-culinary-500 px-6 py-3 font-semibold text-slate-950 disabled:opacity-40 hover:bg-culinary-400"
        >
          Next <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};