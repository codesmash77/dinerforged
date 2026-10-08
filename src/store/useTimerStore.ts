import { create } from 'zustand';

export interface KitchenTimer {
  id: string;
  title: string;
  durationSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
}

interface TimerState {
  timers: KitchenTimer[];
  addTimer: (title: string, durationSeconds: number) => void;
  toggleTimer: (id: string) => void;
  removeTimer: (id: string) => void;
  resetTimer: (id: string) => void;
  tick: () => void;
}

// Helper to play a synthesized chime alert using Web Audio API
function playChime() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      gain.gain.setValueAtTime(0.3, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    // Play a pleasant double-chime alert
    playTone(587.33, 0, 0.2); // D5
    playTone(880, 0.2, 0.4);   // A5
  } catch (e) {
    console.error('Audio playback error:', e);
  }
}

export const useTimerStore = create<TimerState>((set, get) => ({
  timers: [],

  addTimer: (title, durationSeconds) => {
    const newTimer: KitchenTimer = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      durationSeconds,
      remainingSeconds: durationSeconds,
      isRunning: true,
    };
    set((state) => ({ timers: [...state.timers, newTimer] }));
  },

  toggleTimer: (id) => {
    set((state) => ({
      timers: state.timers.map((t) => (t.id === id ? { ...t, isRunning: !t.isRunning } : t)),
    }));
  },

  removeTimer: (id) => {
    set((state) => ({
      timers: state.timers.filter((t) => t.id !== id),
    }));
  },

  resetTimer: (id) => {
    set((state) => ({
      timers: state.timers.map((t) =>
        t.id === id ? { ...t, remainingSeconds: t.durationSeconds, isRunning: true } : t
      ),
    }));
  },

  tick: () => {
    set((state) => ({
      timers: state.timers.map((t) => {
        if (!t.isRunning || t.remainingSeconds <= 0) return t;
        const nextSecs = t.remainingSeconds - 1;
        if (nextSecs === 0) {
          playChime();
          return { ...t, remainingSeconds: 0, isRunning: false };
        }
        return { ...t, remainingSeconds: nextSecs };
      }),
    }));
  },
}));

// Global interval tick loop for active timers
if (typeof window !== 'undefined') {
  setInterval(() => {
    useTimerStore.getState().tick();
  }, 1000);
}