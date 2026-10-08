import { useState, useEffect, useCallback } from 'react';

export function useRecipeVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentText, setCurrentText] = useState<string | null>(null);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentText(null);
    }
  }, []);

  const speak = useCallback((text: string, onEndCallback?: () => void) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Clear queue

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.1;

    // Strict Female Voice Identification
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find((v) => 
      (/female|zira|samantha|victoria|karen|moira|tessa|fiona|susan|hazel|helen/i.test(v.name) || 
       v.name.includes('Google UK English Female') || 
       v.name.includes('Microsoft Zira')) && v.lang.startsWith('en')
    ) || voices.find((v) => v.lang.startsWith('en') && !/male|david|mark|george|james|richard/i.test(v.name)) 
      || voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentText(text);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentText(null);
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentText(null);
      if (onEndCallback) onEndCallback();
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    // Force voice load trigger for browsers that load voices asynchronously (like Chrome)
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return { speak, stop, isSpeaking, currentText };
}