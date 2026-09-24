import { useEffect, useMemo } from "react";
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";

export type CanvasDraw = (ctx: CanvasRenderingContext2D, width: number, height: number) => void;

// System handwriting fonts: available instantly (no network) and the browser falls back
// per glyph for Vietnamese diacritics.
export const handFont = '"Chalkboard SE", "Comic Sans MS", "Segoe Print", "Marker Felt", sans-serif';

/**
 * Draws once into an offscreen canvas and wraps it as a texture.
 * `draw` must be a stable (module-level) function so the texture is not rebuilt every render.
 */
export function useCanvasTexture(width: number, height: number, draw: CanvasDraw, repeat?: [number, number]) {
  const repeatX = repeat?.[0] ?? 1;
  const repeatY = repeat?.[1] ?? 1;

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (ctx) draw(ctx, width, height);

    const result = new CanvasTexture(canvas);
    result.colorSpace = SRGBColorSpace;
    result.anisotropy = 8;
    if (repeatX !== 1 || repeatY !== 1) {
      result.wrapS = RepeatWrapping;
      result.wrapT = RepeatWrapping;
      result.repeat.set(repeatX, repeatY);
    }
    return result;
  }, [width, height, draw, repeatX, repeatY]);

  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

/** Deterministic pseudo-random generator so hand-drawn textures look the same on every load. */
export function createRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

export function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}
