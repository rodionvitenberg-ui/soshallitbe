/**
 * BGM state: UI volume 0–1 (slider), mapped to a quiet HTMLAudio gain range.
 */

export const REEL_BGM_SRC = "/assets/audios/reel-bgm.mp3";

/**
 * Hard ceiling on HTMLAudioElement.volume at slider 100%.
 * Track masters are hot; 1.0 rips ears. Keep this low.
 */
export const REEL_BGM_MAX_OUTPUT = 0.08;

/** Default slider position after start (60% of bar). */
export const REEL_BGM_START = 0.6;

export type ReelBgmState = {
  started: boolean;
  muted: boolean;
  /** UI level 0–1 (slider / bar). */
  volume: number;
  visible: boolean;
  playing: boolean;
};

type Listener = () => void;
const listeners = new Set<Listener>();

let state: ReelBgmState = {
  started: false,
  muted: false,
  volume: REEL_BGM_START,
  visible: false,
  playing: false,
};

let onStartHandler: (() => void) | null = null;

export function registerStartHandler(fn: (() => void) | null) {
  onStartHandler = fn;
}

function emit() {
  for (const l of listeners) l();
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export function getReelBgmState(): ReelBgmState {
  return state;
}

export function subscribeReelBgm(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setState(partial: Partial<ReelBgmState>) {
  const next = { ...state, ...partial };
  if (typeof partial.volume === "number") {
    next.volume = clamp01(partial.volume);
  }
  if (
    next.started === state.started &&
    next.muted === state.muted &&
    next.volume === state.volume &&
    next.visible === state.visible &&
    next.playing === state.playing
  ) {
    return;
  }
  state = next;
  emit();
}

export function setPlaying(playing: boolean) {
  setState({ playing });
}

export function setVisible(visible: boolean) {
  setState({ visible });
}

/**
 * Actual HTMLAudioElement.volume.
 * Soft curve so low slider values stay gentle; cap at REEL_BGM_MAX_OUTPUT.
 */
export function getOutputVolume(): number {
  if (!state.started || state.muted) return 0;
  const ui = clamp01(state.volume);
  // ease-in: mid values quieter than linear
  const shaped = ui * ui; // quadratic
  return shaped * REEL_BGM_MAX_OUTPUT;
}

/** Bar fill mirrors UI volume (not raw HTML gain). */
export function getDisplayLevel(): number {
  if (!state.started || state.muted) return 0;
  return state.volume;
}

export function startBgm() {
  if (state.started) return;
  setState({
    started: true,
    muted: false,
    volume: REEL_BGM_START,
    visible: true,
  });
  onStartHandler?.();
}

export function setMuted(muted: boolean) {
  setState({ muted });
}

export function toggleMuted() {
  setState({ muted: !state.muted });
}

export function setVolume(volume: number) {
  const wasStarted = state.started;
  setState({
    volume: clamp01(volume),
    muted: false,
    started: true,
    visible: true,
  });
  if (!wasStarted) {
    onStartHandler?.();
  }
}
