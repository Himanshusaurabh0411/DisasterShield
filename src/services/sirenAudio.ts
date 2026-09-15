/**
 * Web Audio API synthesized tactical emergency siren.
 * Operates purely via the browser's native AudioContext without external audio files.
 */

let audioCtx: AudioContext | null = null;
let osc1: OscillatorNode | null = null;
let osc2: OscillatorNode | null = null;
let gainNode: GainNode | null = null;
let lfo: OscillatorNode | null = null;
let isPlaying = false;

export const sirenAudio = {
  startSiren(volume = 0.25) {
    if (isPlaying) return;

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioCtx || audioCtx.state === 'closed') {
        audioCtx = new AudioContextClass();
      }

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      // Master Gain Node
      gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(Math.min(volume, 0.4), audioCtx.currentTime + 0.3);
      gainNode.connect(audioCtx.destination);

      // Low Frequency Oscillator to modulate pitch (sweeping siren effect: ~1.2 Hz)
      lfo = audioCtx.createOscillator();
      lfo.frequency.setValueAtTime(1.2, audioCtx.currentTime);

      const lfoGain = audioCtx.createGain();
      lfoGain.gain.setValueAtTime(140, audioCtx.currentTime); // Pitch swing +/- 140 Hz
      lfo.connect(lfoGain);

      // Primary tactical tone (~780 Hz center)
      osc1 = audioCtx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(780, audioCtx.currentTime);
      lfoGain.connect(osc1.frequency);

      // Secondary harmonic tone (~920 Hz)
      osc2 = audioCtx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(920, audioCtx.currentTime);

      // Subtle Low-pass filter for realistic acoustic tone
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, audioCtx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);

      lfo.start();
      osc1.start();
      osc2.start();

      isPlaying = true;
    } catch (e) {
      console.warn('Web Audio siren init failed:', e);
    }
  },

  stopSiren() {
    if (!isPlaying) return;

    try {
      if (gainNode && audioCtx) {
        gainNode.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
        setTimeout(() => {
          try {
            osc1?.stop();
            osc2?.stop();
            lfo?.stop();
            osc1?.disconnect();
            osc2?.disconnect();
            lfo?.disconnect();
            gainNode?.disconnect();
          } catch {
            // cleanup safely
          }
          osc1 = null;
          osc2 = null;
          lfo = null;
          gainNode = null;
          isPlaying = false;
        }, 220);
      } else {
        isPlaying = false;
      }
    } catch (e) {
      console.warn('Web Audio siren stop failed:', e);
      isPlaying = false;
    }
  },

  isSirenPlaying(): boolean {
    return isPlaying;
  },
};
