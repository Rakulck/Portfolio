"use client";

import { useEffect, useRef, useState } from "react";

const vertexShader = `#version 300 es
precision highp float;
out vec2 vUv;

void main() {
  vec2 corner = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = corner;
  gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
}`;

const fragmentShader = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;

uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uTime;
uniform float uMotion;
const float LIQUID_INK = 0.024;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.52;
  mat2 turn = mat2(0.82, -0.57, 0.57, 0.82);
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = turn * p * 2.03 + 7.13;
    amplitude *= 0.48;
  }
  return value;
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= uResolution.x / max(uResolution.y, 1.0);

  vec2 cursor = uPointer * 2.0 - 1.0;
  cursor.x *= uResolution.x / max(uResolution.y, 1.0);
  vec2 delta = p - cursor;
  float radius = length(delta);
  float pull = exp(-radius * radius * 1.35) * uMotion;
  float angle = atan(delta.y, delta.x);

  float c = cos(pull * 0.48);
  float s = sin(pull * 0.48);
  mat2 swirl = mat2(c, -s, s, c);
  vec2 q = cursor + swirl * delta;
  q += vec2(sin(angle * 2.0 + radius * 4.0), cos(angle * 2.0 - radius * 5.0)) * pull * 0.075;

  float drift = uTime * 0.060;
  float layerA = fbm(q * 1.15 + vec2(drift, -drift * 0.7));
  float layerB = fbm(q * 1.65 + vec2(layerA * 1.8 + 2.4, -drift * 1.3));
  vec2 flow = vec2(
    fbm(q * 1.30 + vec2(layerB * 2.0 + 5.0, drift)),
    fbm(q * 1.45 + vec2(-drift, layerA * 2.0 + 8.0))
  );
  float liquid = fbm(q * 1.55 + (flow - 0.5) * 2.3 + vec2(drift * 0.6, -drift * 0.4));
  liquid += 0.16 * sin(q.x * 1.7 + q.y * 1.3 + drift * 2.0);

  float liquidSurface = 0.5 + 0.5 * sin(liquid * 5.4 + layerA * 2.0);
  float softBody = smoothstep(0.18, 0.88, liquidSurface);
  float refraction = 1.0 - smoothstep(0.0, 0.30, abs(liquidSurface - 0.54));
  float cursorRipple = (0.5 + 0.5 * sin(radius * 13.0 - uTime * 1.7 + angle * 0.4))
    * exp(-radius * 2.8) * uMotion;
  float cursorDimple = exp(-radius * radius * 3.5) * uMotion;

  float ink = (softBody * 0.28 + refraction * 0.62) * LIQUID_INK;
  ink += cursorRipple * 0.008 + cursorDimple * 0.012;
  float luminance = 1.000 - ink;
  outColor = vec4(vec3(clamp(luminance, 0.94, 1.0)), 1.0);
}`;

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("Wavy hero shader could not be compiled.");
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGL2RenderingContext) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexShader);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
  if (!vertex || !fragment) {
    if (vertex) gl.deleteShader(vertex);
    if (fragment) gl.deleteShader(fragment);
    return null;
  }

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn("Wavy hero shader could not be linked.");
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export function WavyHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let gl: WebGL2RenderingContext | null = null;
    let program: WebGLProgram | null = null;
    let visible = true;
    let start = performance.now();
    let animate: ((now: number) => void) | null = null;
    const pointer = { x: 0.73, y: 0.32, targetX: 0.73, targetY: 0.32, active: 0.45, targetActive: 0.45 };

    const dispose = () => {
      cancelAnimationFrame(frameRef.current);
      if (gl && program) gl.deleteProgram(program);
      program = null;
      setIsReady(false);
    };

    const initialize = () => {
      dispose();
      gl = canvas.getContext("webgl2", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power",
        preserveDrawingBuffer: false,
      });
      if (!gl) return;
      program = createProgram(gl);
      if (!program) return;

      const resolutionLocation = gl.getUniformLocation(program, "uResolution");
      const pointerLocation = gl.getUniformLocation(program, "uPointer");
      const timeLocation = gl.getUniformLocation(program, "uTime");
      const motionLocation = gl.getUniformLocation(program, "uMotion");
      start = performance.now();

      const render = (now: number) => {
        if (!gl || !program || !visible) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
        const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }

        pointer.x += (pointer.targetX - pointer.x) * 0.055;
        pointer.y += (pointer.targetY - pointer.y) * 0.055;
        pointer.active += (pointer.targetActive - pointer.active) * 0.045;
        gl.viewport(0, 0, width, height);
        gl.useProgram(program);
        if (resolutionLocation) gl.uniform2f(resolutionLocation, width, height);
        if (pointerLocation) gl.uniform2f(pointerLocation, pointer.x, pointer.y);
        if (timeLocation) gl.uniform1f(timeLocation, reducedMotion.matches ? 0 : (now - start) / 1000);
        if (motionLocation) gl.uniform1f(motionLocation, pointer.active);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        if (!reducedMotion.matches) frameRef.current = requestAnimationFrame(render);
      };

      animate = render;
      setIsReady(true);
      frameRef.current = requestAnimationFrame(render);
    };

    const movePointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      const inside = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
      if (inside) {
        pointer.targetX = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
        pointer.targetY = 1 - Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
        pointer.targetActive = 1;
      } else {
        pointer.targetX = 0.73;
        pointer.targetY = 0.32;
        pointer.targetActive = 0.4;
      }
    };

    const loseContext = (event: Event) => {
      event.preventDefault();
      dispose();
    };
    const restoreContext = () => initialize();
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && program && animate) frameRef.current = requestAnimationFrame(animate);
      else cancelAnimationFrame(frameRef.current);
    }, { threshold: 0.01 });

    window.addEventListener("pointermove", movePointer, { passive: true });
    canvas.addEventListener("webglcontextlost", loseContext);
    canvas.addEventListener("webglcontextrestored", restoreContext);
    intersection.observe(canvas);
    initialize();

    return () => {
      window.removeEventListener("pointermove", movePointer);
      canvas.removeEventListener("webglcontextlost", loseContext);
      canvas.removeEventListener("webglcontextrestored", restoreContext);
      intersection.disconnect();
      dispose();
    };
  }, []);

  return (
    <div className={`wavy-hero ${isReady ? "wavy-hero--ready" : ""}`} aria-hidden="true">
      <div className="wavy-hero__fallback" />
      <canvas ref={canvasRef} className="wavy-hero__canvas" />
    </div>
  );
}
