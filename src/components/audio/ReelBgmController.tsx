"use client";

import { useEffect, useRef } from "react";
import { HeaderAudioPlayer } from "@/components/audio/HeaderAudioPlayer";
import {
  REEL_BGM_SRC,
  getOutputVolume,
  getReelBgmState,
  registerStartHandler,
  setPlaying,
  setVisible,
  startBgm,
  subscribeReelBgm,
} from "@/components/audio/reelBgmStore";

/**
 * Owns BGM <audio>.
 * First pointerdown/keydown → start (UI 60% → quiet mapped output).
 * Header slider controls UI volume; output is gain-capped.
 */
export function ReelBgmController() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(REEL_BGM_SRC);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audioRef.current = audio;

    const applyOutput = () => {
      const el = audioRef.current;
      if (!el) return;
      const out = getOutputVolume();
      el.volume = out;

      const s = getReelBgmState();
      if (!s.started || s.muted || out <= 0) {
        if (!el.paused) {
          el.pause();
          setPlaying(false);
        }
        return;
      }

      if (el.paused) {
        el.play()
          .then(() => setPlaying(true))
          .catch(() => setPlaying(false));
      } else {
        setPlaying(true);
      }
    };

    const unsub = subscribeReelBgm(applyOutput);

    const doStart = () => {
      const el = audioRef.current;
      if (!el) return;
      el.volume = getOutputVolume();
      el.play()
        .then(() => {
          setPlaying(true);
          applyOutput();
        })
        .catch(() => setPlaying(false));
    };

    registerStartHandler(doStart);

    const onGesture = () => {
      if (getReelBgmState().started) return;
      startBgm();
    };
    window.addEventListener("pointerdown", onGesture, { passive: true });
    window.addEventListener("keydown", onGesture);

    let io: IntersectionObserver | null = null;
    const bindIo = () => {
      const target =
        document.getElementById("home-reel-video-container") ||
        document.getElementById("home-reel-container");
      if (!target || io) return;
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) setVisible(true);
        },
        { threshold: 0.15 },
      );
      io.observe(target);
    };
    bindIo();
    const ioRetry = window.setInterval(bindIo, 500);
    const ioStop = window.setTimeout(() => clearInterval(ioRetry), 12000);

    // Pointer over reel video (WebGL canvas sits on top of DOM — set cursor globally)
    let overVideo = false;
    const onMove = (e: PointerEvent) => {
      const video = document.getElementById("home-reel-video-container");
      if (!video || !video.classList.contains("--is-visible")) {
        if (overVideo) {
          overVideo = false;
          document.documentElement.style.removeProperty("cursor");
        }
        return;
      }
      const r = video.getBoundingClientRect();
      const hit =
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom;
      if (hit !== overVideo) {
        overVideo = hit;
        if (hit) document.documentElement.style.cursor = "pointer";
        else document.documentElement.style.removeProperty("cursor");
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.style.removeProperty("cursor");
      clearInterval(ioRetry);
      clearTimeout(ioStop);
      io?.disconnect();
      unsub();
      registerStartHandler(null);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  return <HeaderAudioPlayer />;
}
