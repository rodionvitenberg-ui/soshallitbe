"use client";

import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef } from "react";

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uColor;
uniform vec3 uResolution;
uniform vec2 uMouse;
uniform float uAmplitude;
uniform float uSpeed;

varying vec2 vUv;

void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;

  uv += (uMouse - vec2(0.5)) * uAmplitude;

  float d = -uTime * 0.5 * uSpeed;
  float a = 0.0;
  for (float i = 0.0; i < 8.0; ++i) {
    a += cos(i - d - a * uv.x);
    d += sin(uv.y * i + a);
  }
  d += uTime * 0.5 * uSpeed;
  vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
  col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;
  gl_FragColor = vec4(col, 1.0);
}
`;

export type IridescenceProps = {
  color?: [number, number, number];
  /** First-frame WebGL clear. Defaults to black (hero unchanged). */
  clearColor?: [number, number, number];
  speed?: number;
  amplitude?: number;
  mouseReact?: boolean;
  className?: string;
};

export default function Iridescence({
  color = [1, 1, 1],
  clearColor,
  speed = 1.0,
  amplitude = 0.1,
  mouseReact = true,
  className = "",
}: IridescenceProps) {
  const ctnDom = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (!ctnDom.current) return;
    const ctn = ctnDom.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const renderer = new Renderer({
      dpr,
      alpha: false,
      antialias: true,
      powerPreference: "high-performance",
    });
    const gl = renderer.gl;
    const [cr, cg, cb] = clearColor ?? [0, 0, 0];
    gl.clearColor(cr, cg, cb, 1);

    let program: Program;

    function resize() {
      const w = Math.max(1, ctn.clientWidth);
      const h = Math.max(1, ctn.clientHeight);
      renderer.setSize(w, h);
      gl.canvas.style.width = "100%";
      gl.canvas.style.height = "100%";
      gl.canvas.style.display = "block";
      if (program) {
        program.uniforms.uResolution.value = new Color(
          gl.canvas.width,
          gl.canvas.height,
          gl.canvas.width / Math.max(gl.canvas.height, 1),
        );
      }
    }
    window.addEventListener("resize", resize, false);
    resize();

    const geometry = new Triangle(gl);
    program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(...color) },
        uResolution: {
          value: new Color(
            gl.canvas.width,
            gl.canvas.height,
            gl.canvas.width / Math.max(gl.canvas.height, 1),
          ),
        },
        uMouse: { value: new Float32Array([mousePos.current.x, mousePos.current.y]) },
        uAmplitude: { value: amplitude },
        uSpeed: { value: speed },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    let animateId: number | null = null;
    let isVisible = true;
    let isPageVisible = !document.hidden;

    function update(t: number) {
      if (!isVisible || !isPageVisible) {
        animateId = null;
        return;
      }
      program.uniforms.uTime.value = t * 0.001;
      program.uniforms.uAmplitude.value = amplitude;
      program.uniforms.uSpeed.value = speed;
      renderer.render({ scene: mesh });
      animateId = requestAnimationFrame(update);
    }

    const tryStart = () => {
      if (!isVisible || !isPageVisible) return;
      if (animateId == null) animateId = requestAnimationFrame(update);
    };
    const tryStop = () => {
      if (animateId != null) {
        cancelAnimationFrame(animateId);
        animateId = null;
      }
    };

    tryStart();
    ctn.appendChild(gl.canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting && entry.intersectionRatio > 0;
        if (isVisible) tryStart();
        else tryStop();
      },
      { threshold: [0, 0.01], rootMargin: "0px" },
    );
    io.observe(ctn);
    if (ctn.parentElement) io.observe(ctn.parentElement);

    const onVisibility = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) tryStart();
      else tryStop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    function handleMouseMove(e: MouseEvent) {
      const rect = ctn.getBoundingClientRect();
      const x = (e.clientX - rect.left) / Math.max(rect.width, 1);
      const y = 1.0 - (e.clientY - rect.top) / Math.max(rect.height, 1);
      mousePos.current = { x, y };
      program.uniforms.uMouse.value[0] = x;
      program.uniforms.uMouse.value[1] = y;
    }
    if (mouseReact) {
      ctn.addEventListener("mousemove", handleMouseMove);
    }

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => resize())
        : null;
    if (ro) ro.observe(ctn);

    return () => {
      tryStop();
      io.disconnect();
      ro?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      if (mouseReact) {
        ctn.removeEventListener("mousemove", handleMouseMove);
      }
      if (ctn.contains(gl.canvas)) ctn.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [color, clearColor, speed, amplitude, mouseReact]);

  return (
    <div
      ref={ctnDom}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    />
  );
}
