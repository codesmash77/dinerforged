import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Mic, MicOff, Play, Pause, RotateCcw, Volume2, AlertCircle } from 'lucide-react';
import { Recipe } from '../../types';
import { useRecipeVoice } from '../../hooks/useRecipeVoice';

interface HandsFreeCookingModeProps {
  recipe: Recipe;
  onClose: () => void;
}

export const HandsFreeCookingMode: React.FC<HandsFreeCookingModeProps> = ({ recipe, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [voiceEnabledByUser, setVoiceEnabledByUser] = useState(false);

  const { speak, stop: stopSpeech, isSpeaking } = useRecipeVoice();
  const recognitionRef = useRef<any>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  const instructionsList = (recipe.instructions || []).map((step) => 
    typeof step === 'string' ? step : step.text
  );

  // Start speech recognition helper function
  const startListeningEngine = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setMicError(null);
    };

    recognition.onresult = (event: any) => {
      if (isSpeaking) return; // Ignore input while audio is playing

      const lastResultIndex = event.results.length - 1;
      const transcript = event.results[lastResultIndex][0].transcript.toLowerCase().trim();
      console.log('Voice Command Received:', transcript);

      if (transcript.includes('next') || transcript.includes('forward') || transcript.includes('continue')) {
        setCurrentStep((prev) => Math.min(instructionsList.length - 1, prev + 1));
      } else if (transcript.includes('back') || transcript.includes('previous') || transcript.includes('last')) {
        setCurrentStep((prev) => Math.max(0, prev - 1));
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech error:', event.error);
      if (event.error === 'not-allowed') {
        setMicError('Microphone permission denied.');
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      // Auto-restart if user wanted voice control active and app is not currently speaking
      if (voiceEnabledByUser && recognitionRef.current && !isSpeaking) {
        try { recognitionRef.current.start(); } catch (e) {}
      }
    };

    try {
      recognition.start();
      setIsListening(true);
    } catch (e) {
      console.error('Recognition start error:', e);
    }
  }, [isSpeaking, instructionsList.length, voiceEnabledByUser]);

  // Read step aloud, then automatically activate speech listening once speech ends
  const speakCurrentStep = useCallback(() => {
    if (!instructionsList[currentStep]) return;

    // Stop mic temporarily while speaking to prevent feedback loops
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setIsListening(false);

    speak(`Step ${currentStep + 1}: ${instructionsList[currentStep]}`, () => {
      // EXACTLY when TTS finishes, automatically enable voice listening if user opted in
      if (voiceEnabledByUser) {
        startListeningEngine();
      }
    });
  }, [currentStep, instructionsList, speak, voiceEnabledByUser, startListeningEngine]);

  useEffect(() => {
    speakCurrentStep();
    return () => {
      stopSpeech();
    };
  }, [currentStep]);

  // Toggle voice control manually via button
  const toggleVoiceControl = async () => {
    if (voiceEnabledByUser) {
      setVoiceEnabledByUser(false);
      setIsListening(false);
      if (recognitionRef.current) recognitionRef.current.stop();
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((t) => t.stop());
        audioStreamRef.current = null;
      }
      return;
    }

    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
    } catch (err) {
      setMicError('Microphone permission blocked. Please enable it in browser settings.');
      return;
    }

    setVoiceEnabledByUser(true);
    startListeningEngine();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      stopSpeech();
    };
  }, [stopSpeech]);

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
            onClick={toggleVoiceControl}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
              voiceEnabledByUser ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {voiceEnabledByUser ? <Mic className="h-4 w-4 animate-bounce" /> : <MicOff className="h-4 w-4" />}
            <span>{voiceEnabledByUser ? (isListening ? '🎙️ Listening for "Next"/"Back"...' : '⏳ Ready...') : 'Enable Voice Control'}</span>
          </button>
          <button onClick={() => { stopSpeech(); onClose(); }} className="rounded-full bg-slate-800 p-2 text-slate-300 hover:bg-slate-700">
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mic Error Banner */}
      {micError && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{micError}</span>
        </div>
      )}

      {/* Main Step Viewer */}
      <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto my-8">
        <div className="flex items-center justify-between mb-2">
          <div className="text-culinary-400 text-lg font-bold">
            Step {currentStep + 1} of {instructionsList.length}
          </div>
          <button
            onClick={speakCurrentStep}
            className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
          >
            <Volume2 className={`h-4 w-4 text-culinary-400 ${isSpeaking ? 'animate-pulse' : ''}`} />
            <span>Repeat Step</span>
          </button>
        </div>
        <p className="text-2xl md:text-4xl font-medium leading-relaxed tracking-wide text-slate-100">
          {instructionsList[currentStep]}
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
          onClick={() => setCurrentStep((prev) => Math.min(instructionsList.length - 1, prev + 1))}
          disabled={currentStep === instructionsList.length - 1}
          className="flex items-center gap-2 rounded-xl bg-culinary-500 px-6 py-3 font-semibold text-slate-950 disabled:opacity-40 hover:bg-culinary-400"
        >
          Next <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};