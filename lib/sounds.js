/**
 * Cosmic UI sounds via Web Audio API — no audio files.
 * Haptics via Vibration API. Both respect the settings toggle.
 */

let audioCtx = null;
let unlocked = false;
/** Mirrors Nastavení → Zvuky a haptická odezva */
let soundHapticsEnabled = true;

export const HAPTIC_PATTERNS = {
  tap: 8,
  correct: [10, 30, 15],
  wrong: [60, 40, 60],
  celebrate: [15, 20, 25, 20, 35], // konec testu / streak
};

/** Keep module flag in sync with the settings toggle. */
export function setSoundHapticsEnabled(enabled) {
  soundHapticsEnabled = !!enabled;
}

/**
 * Vibration helper — only when the settings toggle is on and the device supports it.
 * @param {number | number[]} pattern
 */
export function triggerHaptic(pattern) {
  if (!soundHapticsEnabled) return;
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* ignore unsupported / blocked vibrate */
  }
}

function getCtx() {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!audioCtx) audioCtx = new AC();
  return audioCtx;
}

/** Call from a click/tap handler so browsers allow playback. */
export async function unlockAudio() {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    try {
      await ctx.resume();
    } catch {
      /* ignore */
    }
  }
  unlocked = ctx.state === "running";
}

function now() {
  const ctx = getCtx();
  return ctx ? ctx.currentTime : 0;
}

function tone({
  freq = 440,
  freqEnd = null,
  type = "sine",
  start = 0,
  duration = 0.12,
  gain = 0.08,
  attack = 0.008,
  release = 0.06,
}) {
  const ctx = getCtx();
  if (!ctx || !unlocked) return;

  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (freqEnd != null) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), start + duration);
  }

  const peak = Math.max(0.0001, gain);
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(peak, start + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, start + Math.max(attack + 0.01, duration - release));

  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function noiseBurst({ start = 0, duration = 0.18, gain = 0.04, bandHz = 800 }) {
  const ctx = getCtx();
  if (!ctx || !unlocked) return;

  const samples = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, samples, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < samples; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / samples);
  }

  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = bandHz;
  filter.Q.value = 0.8;
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, start);
  g.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  src.connect(filter);
  filter.connect(g);
  g.connect(ctx.destination);
  src.start(start);
  src.stop(start + duration + 0.02);
}

function playIfEnabled(enabled, fn, hapticPattern) {
  soundHapticsEnabled = !!enabled;
  if (!enabled) return;
  // Haptic on the same user-gesture tick (before optional AudioContext resume).
  if (hapticPattern != null) triggerHaptic(hapticPattern);
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    ctx.resume().then(() => {
      unlocked = true;
      fn();
    });
    return;
  }
  unlocked = true;
  fn();
}

/** Soft sonar / UI tap */
export function playTap(enabled) {
  playIfEnabled(
    enabled,
    () => {
      const t = now();
      tone({ freq: 880, freqEnd: 660, type: "sine", start: t, duration: 0.09, gain: 0.045 });
    },
    HAPTIC_PATTERNS.tap
  );
}

/** Crystal success chime */
export function playCorrect(enabled) {
  playIfEnabled(
    enabled,
    () => {
      const t = now();
      tone({ freq: 523.25, type: "sine", start: t, duration: 0.14, gain: 0.07 });
      tone({ freq: 659.25, type: "triangle", start: t + 0.05, duration: 0.16, gain: 0.055 });
      tone({ freq: 783.99, type: "sine", start: t + 0.1, duration: 0.22, gain: 0.045 });
    },
    HAPTIC_PATTERNS.correct
  );
}

/**
 * Soft wrong-answer sound: filtered saw/triangle glide + gentle two-tone drop.
 * Plays only when the settings sound toggle is on (`enabled === true`).
 */
export function playWrongSound(enabled) {
  playIfEnabled(
    enabled,
    () => {
      const ctx = getCtx();
      if (!ctx) return;
      const t = ctx.currentTime;
      const duration = 0.28;

      // Primary descending buzz through lowpass (~350 Hz)
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.25);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(350, t);
      filter.frequency.exponentialRampToValueAtTime(280, t + duration);
      filter.Q.setValueAtTime(0.6, t);

      const g1 = ctx.createGain();
      g1.gain.setValueAtTime(0.0001, t);
      g1.gain.exponentialRampToValueAtTime(0.1, t + 0.015);
      g1.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc.connect(filter);
      filter.connect(g1);
      g1.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + duration + 0.02);

      // Soft second tone (slightly lower / delayed) for a two-tone drop
      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(140, t + 0.04);
      osc2.frequency.exponentialRampToValueAtTime(70, t + 0.26);

      const filter2 = ctx.createBiquadFilter();
      filter2.type = "lowpass";
      filter2.frequency.setValueAtTime(320, t + 0.04);
      filter2.Q.setValueAtTime(0.5, t + 0.04);

      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.0001, t + 0.04);
      g2.gain.exponentialRampToValueAtTime(0.06, t + 0.055);
      g2.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc2.connect(filter2);
      filter2.connect(g2);
      g2.connect(ctx.destination);
      osc2.start(t + 0.04);
      osc2.stop(t + duration + 0.02);
    },
    HAPTIC_PATTERNS.wrong
  );
}

/** @deprecated use playWrongSound — kept for existing call sites */
export function playWrong(enabled) {
  playWrongSound(enabled);
}

/** Shield absorb / energy sparkle */
export function playShield(enabled) {
  playIfEnabled(enabled, () => {
    const t = now();
    noiseBurst({ start: t, duration: 0.16, gain: 0.035, bandHz: 1200 });
    tone({ freq: 420, freqEnd: 920, type: "sine", start: t, duration: 0.2, gain: 0.05 });
    tone({ freq: 980, type: "triangle", start: t + 0.08, duration: 0.12, gain: 0.035 });
  });
}

/** Streak → shield unlocked (short fanfare) */
export function playStreak(enabled) {
  playIfEnabled(
    enabled,
    () => {
      const t = now();
      tone({ freq: 523.25, type: "sine", start: t, duration: 0.12, gain: 0.06 });
      tone({ freq: 659.25, type: "sine", start: t + 0.1, duration: 0.12, gain: 0.06 });
      tone({ freq: 783.99, type: "triangle", start: t + 0.2, duration: 0.16, gain: 0.065 });
      tone({ freq: 1046.5, type: "sine", start: t + 0.32, duration: 0.28, gain: 0.055 });
      noiseBurst({ start: t + 0.28, duration: 0.16, gain: 0.02, bandHz: 1600 });
    },
    HAPTIC_PATTERNS.celebrate
  );
}

/** Soft launch / boot when a test starts */
export function playStart(enabled) {
  playIfEnabled(
    enabled,
    () => {
      const t = now();
      tone({ freq: 220, freqEnd: 440, type: "sine", start: t, duration: 0.22, gain: 0.05 });
      tone({ freq: 330, freqEnd: 660, type: "triangle", start: t + 0.08, duration: 0.2, gain: 0.035 });
      noiseBurst({ start: t + 0.05, duration: 0.2, gain: 0.02, bandHz: 600 });
    },
    HAPTIC_PATTERNS.tap
  );
}

/** Short warp / results fanfare */
export function playResults(enabled) {
  playIfEnabled(
    enabled,
    () => {
      const t = now();
      tone({ freq: 392, type: "sine", start: t, duration: 0.14, gain: 0.055 });
      tone({ freq: 494, type: "sine", start: t + 0.1, duration: 0.14, gain: 0.055 });
      tone({ freq: 587, type: "triangle", start: t + 0.2, duration: 0.18, gain: 0.06 });
      tone({ freq: 784, type: "sine", start: t + 0.32, duration: 0.28, gain: 0.05 });
    },
    HAPTIC_PATTERNS.celebrate
  );
}

/** Quiet flyby whoosh burst (optional accent) */
export function playRocketWhoosh(enabled) {
  playIfEnabled(enabled, () => {
    const t = now();
    noiseBurst({ start: t, duration: 0.55, gain: 0.028, bandHz: 700 });
    tone({ freq: 240, freqEnd: 520, type: "sine", start: t, duration: 0.45, gain: 0.025, attack: 0.04, release: 0.2 });
    tone({ freq: 180, freqEnd: 90, type: "triangle", start: t + 0.25, duration: 0.35, gain: 0.018, attack: 0.05, release: 0.2 });
  });
}

/** Continuous ambient rocket engine (pink noise + breathing lowpass). */
let rocketEngine = null;

function createPinkNoiseBuffer(ctx, durationSec = 2.5) {
  const length = Math.max(1, Math.floor(ctx.sampleRate * durationSec));
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  // Paul Kellet refined pink-noise filter
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  let b3 = 0;
  let b4 = 0;
  let b5 = 0;
  let b6 = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.969 * b2 + white * 0.153852;
    b3 = 0.8665 * b3 + white * 0.3104856;
    b4 = 0.55 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.016898;
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
    b6 = white * 0.115926;
  }
  return buffer;
}

/**
 * Start soft continuous engine whoosh.
 * No-ops when disabled / already running / audio locked.
 */
export function startRocketEngine(enabled) {
  if (!enabled) return;
  const ctx = getCtx();
  if (!ctx) return;

  const begin = () => {
    unlocked = true;
    if (rocketEngine) return;

    const source = ctx.createBufferSource();
    source.buffer = createPinkNoiseBuffer(ctx);
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(300, ctx.currentTime);
    filter.Q.setValueAtTime(0.7, ctx.currentTime);

    // Gentle LFO so cutoff breathes ~200–400 Hz
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.18, ctx.currentTime);
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.setValueAtTime(100, ctx.currentTime);
    lfo.connect(lfoDepth);
    lfoDepth.connect(filter.frequency);

    const gain = ctx.createGain();
    const targetGain = 0.032;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(targetGain, ctx.currentTime + 0.35);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start();
    lfo.start();

    rocketEngine = { source, filter, gain, lfo, lfoDepth, targetGain };
  };

  if (ctx.state === "suspended") {
    ctx.resume().then(begin).catch(() => {});
    return;
  }
  begin();
}

/** Fade out and tear down the continuous rocket engine. */
export function stopRocketEngine() {
  const eng = rocketEngine;
  if (!eng) return;
  rocketEngine = null;

  const ctx = getCtx();
  const t = ctx ? ctx.currentTime : 0;
  try {
    eng.gain.gain.cancelScheduledValues(t);
    eng.gain.gain.setValueAtTime(Math.max(0.0001, eng.gain.gain.value), t);
    eng.gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
  } catch {
    /* ignore */
  }

  window.setTimeout(() => {
    try {
      eng.lfo.stop();
    } catch {
      /* ignore */
    }
    try {
      eng.source.stop();
    } catch {
      /* ignore */
    }
    try {
      eng.source.disconnect();
      eng.filter.disconnect();
      eng.gain.disconnect();
      eng.lfo.disconnect();
      eng.lfoDepth.disconnect();
    } catch {
      /* ignore */
    }
  }, 320);
}
