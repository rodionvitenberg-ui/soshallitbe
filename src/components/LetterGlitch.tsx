"use client";

import { useRef, useEffect } from "react";

export type LetterGlitchProps = {
  glitchColors?: string[];
  /** Alias used by some docs */
  colors?: string[];
  glitchSpeed?: number;
  centerVignette?: boolean;
  outerVignette?: boolean;
  showCenterVignette?: boolean;
  showOuterVignette?: boolean;
  smooth?: boolean;
  characters?: string;
  className?: string;
};

const LetterGlitch = ({
  glitchColors,
  colors,
  glitchSpeed = 50,
  centerVignette,
  outerVignette,
  showCenterVignette,
  showOuterVignette,
  smooth = true,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789",
  className = "",
}: LetterGlitchProps) => {
  const palette =
    colors && colors.length > 0
      ? colors
      : glitchColors && glitchColors.length > 0
        ? glitchColors
        : ["#2b4539", "#61dca3", "#61b3dc"];

  // Prefer show* aliases when provided (user snippet)
  const useCenter =
    showCenterVignette !== undefined
      ? showCenterVignette
      : (centerVignette ?? false);
  const useOuter =
    showOuterVignette !== undefined
      ? showOuterVignette
      : (outerVignette ?? true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const letters = useRef<
    {
      char: string;
      color: string;
      targetColor: string;
      colorProgress: number;
    }[]
  >([]);
  const grid = useRef({ columns: 0, rows: 0 });
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const lastGlitchTime = useRef(Date.now());
  const visibleRef = useRef(true);
  const pageVisibleRef = useRef(!document.hidden);

  const lettersAndSymbols = Array.from(characters);
  const fontSize = 16;
  const charWidth = 10;
  const charHeight = 20;

  const getRandomChar = () =>
    lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];

  const getRandomColor = () =>
    palette[Math.floor(Math.random() * palette.length)];

  const hexToRgb = (hex: string) => {
    let h = hex.trim();
    const short = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    h = h.replace(short, (_m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const interpolateColor = (
    start: { r: number; g: number; b: number },
    end: { r: number; g: number; b: number },
    factor: number,
  ) => {
    const r = Math.round(start.r + (end.r - start.r) * factor);
    const g = Math.round(start.g + (end.g - start.g) * factor);
    const b = Math.round(start.b + (end.b - start.b) * factor);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const calculateGrid = (width: number, height: number) => ({
    columns: Math.ceil(width / charWidth),
    rows: Math.ceil(height / charHeight),
  });

  const initializeLetters = (columns: number, rows: number) => {
    grid.current = { columns, rows };
    letters.current = Array.from({ length: columns * rows }, () => ({
      char: getRandomChar(),
      color: getRandomColor(),
      targetColor: getRandomColor(),
      colorProgress: 1,
    }));
  };

  const drawLetters = () => {
    if (!context.current || !canvasRef.current || letters.current.length === 0)
      return;
    const ctx = context.current;
    const { width, height } = canvasRef.current.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = "top";

    letters.current.forEach((letter, index) => {
      const x = (index % grid.current.columns) * charWidth;
      const y = Math.floor(index / grid.current.columns) * charHeight;
      ctx.fillStyle = letter.color;
      ctx.fillText(letter.char, x, y);
    });
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const parent = containerRef.current;
    if (!canvas || !parent) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    if (context.current) {
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const { columns, rows } = calculateGrid(w, h);
    initializeLetters(columns, rows);
    drawLetters();
  };

  const updateLetters = () => {
    if (!letters.current.length) return;
    const updateCount = Math.max(1, Math.floor(letters.current.length * 0.05));
    for (let i = 0; i < updateCount; i++) {
      const index = Math.floor(Math.random() * letters.current.length);
      const cell = letters.current[index];
      if (!cell) continue;
      cell.char = getRandomChar();
      cell.targetColor = getRandomColor();
      if (!smooth) {
        cell.color = cell.targetColor;
        cell.colorProgress = 1;
      } else {
        cell.colorProgress = 0;
      }
    }
  };

  const handleSmoothTransitions = () => {
    let needsRedraw = false;
    letters.current.forEach((letter) => {
      if (letter.colorProgress < 1) {
        letter.colorProgress += 0.05;
        if (letter.colorProgress > 1) letter.colorProgress = 1;
        const startRgb = hexToRgb(letter.color);
        const endRgb = hexToRgb(letter.targetColor);
        if (startRgb && endRgb) {
          letter.color = interpolateColor(
            startRgb,
            endRgb,
            letter.colorProgress,
          );
          needsRedraw = true;
        }
      }
    });
    if (needsRedraw) drawLetters();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    context.current = canvas.getContext("2d");
    resizeCanvas();

    let isVisible = true;
    let isPageVisible = !document.hidden;
    visibleRef.current = true;
    pageVisibleRef.current = isPageVisible;

    const animate = () => {
      if (!isVisible || !isPageVisible) {
        animationRef.current = null;
        return;
      }

      const now = Date.now();
      if (now - lastGlitchTime.current >= glitchSpeed) {
        updateLetters();
        drawLetters();
        lastGlitchTime.current = now;
      }
      if (smooth) handleSmoothTransitions();
      animationRef.current = requestAnimationFrame(animate);
    };

    const tryStart = () => {
      if (!isVisible || !isPageVisible) return;
      if (animationRef.current == null) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    const tryStop = () => {
      if (animationRef.current != null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };

    tryStart();

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        visibleRef.current = isVisible;
        if (isVisible) tryStart();
        else tryStop();
      },
      { threshold: 0, rootMargin: "10% 0px" },
    );
    io.observe(container);

    const onVisibility = () => {
      isPageVisible = !document.hidden;
      pageVisibleRef.current = isPageVisible;
      if (isPageVisible) tryStart();
      else tryStop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        tryStop();
        resizeCanvas();
        tryStart();
      }, 100);
    };
    window.addEventListener("resize", handleResize);

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => handleResize())
        : null;
    if (ro) ro.observe(container);

    return () => {
      tryStop();
      io.disconnect();
      ro?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [glitchSpeed, smooth, palette.join(",")]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#000",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
      {useOuter && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,1) 100%)",
          }}
        />
      )}
      {useCenter && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)",
          }}
        />
      )}
    </div>
  );
};

export default LetterGlitch;
