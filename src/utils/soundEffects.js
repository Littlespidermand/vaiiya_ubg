/**
 * Web Audio API synthesizer for vintage arcade sound effects.
 * 100% client-side JavaScript, zero external audio files.
 */

class SoundSystem {
  constructor() {
    this.ctx = null;
    this.muted = false;
    const saved = localStorage.getItem('nova_games_muted');
    if (saved !== null) {
      this.muted = saved === 'true';
    }
  }

  initContext() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  isMuted() {
    return this.muted;
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    localStorage.setItem('nova_games_muted', String(muted));
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  playTone(freq, type = 'sine', duration = 0.1, gainValue = 0.12) {
    if (this.muted) return;
    try {
      const ctx = this.initContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainValue, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }
}

export const sounds = new SoundSystem();
