"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import {
  getDisplayLevel,
  getReelBgmState,
  setVolume,
  startBgm,
  subscribeReelBgm,
  toggleMuted,
} from "@/components/audio/reelBgmStore";

function useReelBgm() {
  return useSyncExternalStore(subscribeReelBgm, getReelBgmState, getReelBgmState);
}

function SpeakerIcon({ muted }: { muted: boolean }) {
  if (muted) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 9.5v5h3.2L12 19V5L7.2 9.5H4Z" fill="currentColor" />
        <path
          d="M16.5 9.5 20 13m0-3.5-3.5 3.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 9.5v5h3.2L12 19V5L7.2 9.5H4Z" fill="currentColor" />
      <path
        d="M15.2 9.2a3.6 3.6 0 0 1 0 5.6M17.6 7a6.2 6.2 0 0 1 0 10"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HeaderAudioPlayer() {
  const state = useReelBgm();
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  // Re-render when store changes — also need display level
  const level = getDisplayLevel();

  useEffect(() => {
    setSlot(document.getElementById("header-audio-player-slot"));
  }, []);

  const setFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const t = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setVolume(t);
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragging.current = true;
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      setFromClientX(e.clientX);
    },
    [setFromClientX],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      setFromClientX(e.clientX);
    },
    [setFromClientX],
  );

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  if (!slot) return null;

  const show = state.visible || state.started;
  const barLevel = level;
  const barPercent = Math.round(barLevel * 100);

  return createPortal(
    <div
      id="header-audio-player"
      className={show ? "is-visible" : ""}
      data-muted={state.muted || !state.started ? "true" : "false"}
      data-started={state.started ? "true" : "false"}
      aria-hidden={!show}
    >
      <button
        type="button"
        id="header-audio-player-toggle"
        aria-label={
          !state.started
            ? "Background music"
            : state.muted
              ? "Unmute background music"
              : "Mute background music"
        }
        aria-pressed={state.muted}
        onClick={() => {
          if (!state.started) startBgm();
          else toggleMuted();
        }}
        tabIndex={show ? 0 : -1}
      >
        <SpeakerIcon muted={!state.started || state.muted} />
      </button>
      <div
        ref={trackRef}
        id="header-audio-player-track"
        role="slider"
        aria-label="Background music volume"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={barPercent}
        tabIndex={show ? 0 : -1}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            e.preventDefault();
            setVolume(Math.min(1, state.volume + 0.05));
          } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            e.preventDefault();
            setVolume(Math.max(0, state.volume - 0.05));
          }
        }}
      >
        <div
          id="header-audio-player-fill"
          style={{ transform: `scaleX(${barLevel})` }}
        />
        <div
          id="header-audio-player-thumb"
          style={{ left: `${barLevel * 100}%` }}
        />
      </div>
    </div>,
    slot,
  );
}
