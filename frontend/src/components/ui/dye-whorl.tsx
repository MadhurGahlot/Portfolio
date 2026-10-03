"use client";

import React, { useEffect, useRef } from "react";

export interface DyeWhorlProps {
  className?: string;
  speed?: number;
  interactive?: boolean;
  /** Keep the animation inside its parent instead of fixing it to the viewport. */
  contained?: boolean;
}

/**
 * DyeWhorl - A WebGL & Canvas animated fluid ink diffusion background component.
 * Configured with a sleek Monochrome (White & Black) fluid dye aesthetic.
 */
export function DyeWhorl({
  className = "",
  speed = 0.75,
  interactive = true,
  contained = false,
}: DyeWhorlProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: true,
      preserveDrawingBuffer: false,
    });

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      if (gl) gl.viewport(0, 0, width, height);
    };

    window.addEventListener("resize", handleResize);

    let pointerX = width * 0.5;
    let pointerY = height * 0.5;
    let targetX = pointerX;
    let targetY = pointerY;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      const clientX = "touches" in e ? e.touches[0]?.clientX ?? width / 2 : e.clientX;
      const clientY = "touches" in e ? e.touches[0]?.clientY ?? height / 2 : e.clientY;
      targetX = clientX;
      targetY = clientY;
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });

    if (!gl) {
      // 2D Canvas Fallback (Monochrome White & Black)
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let time = 0;
      const draw2DFluid = () => {
        time += 0.008 * speed;
        pointerX += (targetX - pointerX) * 0.08;
        pointerY += (targetY - pointerY) * 0.08;

        ctx.clearRect(0, 0, width, height);

        const mx = pointerX / width;
        const my = pointerY / height;

        const count = 5;
        for (let i = 0; i < count; i++) {
          const angle = time * 0.4 + (i * Math.PI * 2) / count;
          const radius = Math.min(width, height) * 0.35 + Math.sin(time + i) * 60;
          const cx = width / 2 + Math.cos(angle + mx) * radius * 0.6;
          const cy = height / 2 + Math.sin(angle * 1.3 + my) * radius * 0.6;

          const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, radius * 1.2);
          if (i % 2 === 0) {
            grad.addColorStop(0, "rgba(255, 255, 255, 0.18)"); // Luminous White Smoke
            grad.addColorStop(0.5, "rgba(140, 140, 150, 0.08)");
            grad.addColorStop(1, "rgba(5, 5, 5, 0)");
          } else {
            grad.addColorStop(0, "rgba(200, 200, 210, 0.14)"); // Soft Slate White
            grad.addColorStop(0.6, "rgba(50, 50, 55, 0.06)");
            grad.addColorStop(1, "rgba(5, 5, 5, 0)");
          }

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, radius * 1.2, 0, Math.PI * 2);
          ctx.fill();
        }

        animationFrameId = requestAnimationFrame(draw2DFluid);
      };

      draw2DFluid();
      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("mousemove", handlePointerMove);
        window.removeEventListener("touchmove", handlePointerMove);
        cancelAnimationFrame(animationFrameId);
      };
    }

    // WebGL Shader Fluid Whorl Simulation (Monochrome White & Black Theme)
    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        v_uv.y = 1.0 - v_uv.y;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      varying vec2 v_uv;

      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ) );
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.x *= u_resolution.x / u_resolution.y;

        vec2 mouse = u_mouse / u_resolution.xy;
        mouse.x *= u_resolution.x / u_resolution.y;

        float t = u_time * 0.15;

        vec2 q = vec2(0.0);
        q.x = snoise(st + vec2(0.0, t));
        q.y = snoise(st + vec2(1.0, t));

        vec2 r = vec2(0.0);
        r.x = snoise(st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t);
        r.y = snoise(st + 1.0 * q + vec2(8.3, 2.8) + 0.126 * t);

        float d = length(st - mouse);
        float mouseStir = smoothstep(0.45, 0.0, d) * 0.45;
        r += mouseStir * vec2(sin(t * 3.0), cos(t * 3.0));

        float f = snoise(st + r);

        // Pure High-Contrast Monochrome Black & White Palette
        vec3 c1 = vec3(0.02, 0.02, 0.03); // Deep Obsidian Black
        vec3 c2 = vec3(0.22, 0.22, 0.24); // Dark Charcoal Gray
        vec3 c3 = vec3(0.96, 0.96, 0.98); // Luminous Pure White
        vec3 c4 = vec3(0.58, 0.58, 0.62); // Slate Silver Smoke

        vec3 color = mix(c1, c2, clamp(f * f * 4.0, 0.0, 1.0));
        color = mix(color, c3, clamp(length(q), 0.0, 1.0));
        color = mix(color, c4, clamp(length(r.x), 0.0, 1.0));

        float alpha = smoothstep(0.04, 0.85, f) * 0.38;

        gl_FragColor = vec4(color, alpha);
      }
    `;

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const aPosition = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let startTime = performance.now();

    const render = () => {
      pointerX += (targetX - pointerX) * 0.08;
      pointerY += (targetY - pointerY) * 0.08;

      const elapsed = (performance.now() - startTime) * 0.001 * speed;
      gl.viewport(0, 0, width, height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uResolution, width, height);
      gl.uniform2f(uMouse, pointerX, height - pointerY);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`${contained ? "absolute" : "fixed"} inset-0 pointer-events-none z-0 h-full w-full opacity-60 transition-opacity duration-1000 dark:opacity-80 ${className}`}
    />
  );
}

export default DyeWhorl;
