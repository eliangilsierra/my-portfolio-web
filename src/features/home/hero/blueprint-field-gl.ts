/* v8 ignore start -- WebGL rendering needs a real GPU context; jsdom has none. The module is only
   loaded in browsers (see BlueprintField), where the e2e suite and manual checks exercise it. */

/**
 * The hero's living drawing sheet: a graph-paper grid rendered by one fragment shader. A lens
 * magnifies the grid under the pointer and lights its lines, a faint scan line sweeps the sheet,
 * and the grid breathes very slightly. One full-screen triangle, no textures, no library.
 */

const VERTEX_SHADER = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform vec2 uResolution;   // canvas size in device pixels
uniform float uDpr;
uniform float uTime;
uniform vec2 uPointer;      // CSS pixels, origin bottom-left
uniform float uLens;        // 0..1, eased pointer presence
uniform vec4 uMinor;        // rgb + alpha
uniform vec4 uMajor;
uniform vec3 uGlowA;
uniform vec3 uGlowB;

out vec4 outColor;

// Anti-aliased grid line mask for one axis.
float gridLine(float coord, float spacing, float width) {
  float distanceToLine = abs(fract(coord / spacing + 0.5) - 0.5) * spacing;
  float aa = fwidth(coord);
  return 1.0 - smoothstep(width * 0.5, width * 0.5 + aa, distanceToLine);
}

void main() {
  vec2 size = uResolution / uDpr;
  vec2 p = gl_FragCoord.xy / uDpr;

  // Lens: magnify the grid around the pointer.
  vec2 toPointer = p - uPointer;
  float radius = 220.0;
  float lens = exp(-dot(toPointer, toPointer) / (2.0 * radius * radius)) * uLens;
  p -= toPointer * lens * 0.28;

  // Breathing: a very slow, very small drift.
  p += vec2(sin(p.y * 0.012 + uTime * 0.35), cos(p.x * 0.01 + uTime * 0.28)) * 1.2;

  float minor = max(gridLine(p.x, 16.0, 1.0), gridLine(p.y, 16.0, 1.0));
  float major = max(gridLine(p.x - 0.5, 80.0, 1.0), gridLine(p.y - 0.5, 80.0, 1.0));

  // A faint scan line sweeping down the sheet every ~11 seconds, lighting only the major grid.
  float scanY = size.y * (1.0 - fract(uTime / 11.0));
  float scan = exp(-pow((p.y - scanY) / 14.0, 2.0)) * 0.3;

  vec3 glow = mix(uGlowA, uGlowB, clamp(toPointer.x / radius * 0.5 + 0.5, 0.0, 1.0));
  float lit = max(minor * 0.6, major) * lens * 1.25 + major * scan;

  vec3 color = uMinor.rgb * minor * uMinor.a + uMajor.rgb * major * uMajor.a + glow * lit * 0.55;
  float alpha = max(minor * uMinor.a, major * uMajor.a) + lit * 0.55;

  // Fade towards the edges, like the CSS grid's mask.
  vec2 uv = gl_FragCoord.xy / uResolution;
  float vignette = smoothstep(0.78, 0.2, length((uv - vec2(0.5, 0.55)) * vec2(1.0, 1.25)));
  outColor = vec4(color, alpha) * vignette;
}`;

interface Palette {
  minor: [number, number, number, number];
  major: [number, number, number, number];
  glowA: [number, number, number];
  glowB: [number, number, number];
}

// The CSS grid tokens (styles/tokens.css), converted to linear RGB fractions.
const PALETTES: Record<'light' | 'dark', Palette> = {
  light: {
    minor: [0.14, 0.14, 0.26, 0.05],
    major: [0.33, 0.21, 0.49, 0.1],
    glowA: [0.36, 0.16, 0.84],
    glowB: [0.04, 0.62, 0.76],
  },
  dark: {
    minor: [0.66, 0.87, 0.94, 0.045],
    major: [0.55, 0.85, 0.95, 0.09],
    glowA: [0.7, 0.57, 0.99],
    glowB: [0.15, 0.87, 0.97],
  },
};

const MAX_DPR = 1.75;

function compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/** Starts rendering into `canvas`. Returns a function that stops and frees everything. */
export function createBlueprintField(canvas: HTMLCanvasElement): () => void {
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    antialias: false,
    premultipliedAlpha: true,
  });
  if (!gl) return () => undefined;

  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (!vertex || !fragment) return () => undefined;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return () => undefined;
  gl.useProgram(program);

  // One triangle that covers the whole viewport.
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uniform = (name: string) => gl.getUniformLocation(program, name);
  const u = {
    resolution: uniform('uResolution'),
    dpr: uniform('uDpr'),
    time: uniform('uTime'),
    pointer: uniform('uPointer'),
    lens: uniform('uLens'),
    minor: uniform('uMinor'),
    major: uniform('uMajor'),
    glowA: uniform('uGlowA'),
    glowB: uniform('uGlowB'),
  };

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const applyPalette = () => {
    const palette =
      PALETTES[document.documentElement.classList.contains('dark') ? 'dark' : 'light'];
    gl.uniform4fv(u.minor, palette.minor);
    gl.uniform4fv(u.major, palette.major);
    gl.uniform3fv(u.glowA, palette.glowA);
    gl.uniform3fv(u.glowB, palette.glowB);
  };
  applyPalette();

  let dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl.viewport(0, 0, width, height);
  };
  resize();

  // Pointer, eased every frame so the lens glides rather than jumps.
  const target = { x: -9999, y: -9999, inside: 0 };
  const current = { x: -9999, y: -9999, lens: 0 };
  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return;
    const rect = canvas.getBoundingClientRect();
    target.x = event.clientX - rect.left;
    target.y = rect.height - (event.clientY - rect.top);
    target.inside = target.y >= 0 && target.y <= rect.height ? 1 : 0;
    if (current.x < -9000) {
      current.x = target.x;
      current.y = target.y;
    }
  };
  const onPointerLeave = () => {
    target.inside = 0;
  };

  let frame = 0;
  let running = false;
  let visible = true;
  const start = performance.now();

  const render = (now: number) => {
    frame = requestAnimationFrame(render);
    current.x += (target.x - current.x) * 0.12;
    current.y += (target.y - current.y) * 0.12;
    current.lens += (target.inside - current.lens) * 0.06;

    gl.uniform2f(u.resolution, canvas.width, canvas.height);
    gl.uniform1f(u.dpr, dpr);
    gl.uniform1f(u.time, (now - start) / 1000);
    gl.uniform2f(u.pointer, current.x, current.y);
    gl.uniform1f(u.lens, current.lens);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const play = () => {
    if (running || !visible || document.hidden) return;
    running = true;
    frame = requestAnimationFrame(render);
  };
  const pause = () => {
    running = false;
    cancelAnimationFrame(frame);
  };

  const onVisibility = () => (document.hidden ? pause() : play());
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? true;
    if (visible) play();
    else pause();
  });
  const resizeObserver = new ResizeObserver(resize);
  const themeObserver = new MutationObserver(applyPalette);

  intersection.observe(canvas);
  resizeObserver.observe(canvas);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onPointerLeave);
  document.addEventListener('visibilitychange', onVisibility);
  play();

  return () => {
    pause();
    intersection.disconnect();
    resizeObserver.disconnect();
    themeObserver.disconnect();
    window.removeEventListener('pointermove', onPointerMove);
    document.documentElement.removeEventListener('pointerleave', onPointerLeave);
    document.removeEventListener('visibilitychange', onVisibility);
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
}

/* v8 ignore stop */
