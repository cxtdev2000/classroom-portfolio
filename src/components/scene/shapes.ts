import { Shape, Vector2 } from "three";

export function createStarShape(outer: number, inner: number, points = 5) {
  const shape = new Shape();
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = (i / (points * 2)) * Math.PI * 2 + Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

export function createHeartShape(size: number) {
  const s = size;
  const shape = new Shape();
  shape.moveTo(0, -0.8 * s);
  shape.bezierCurveTo(-0.9 * s, -0.2 * s, -1.1 * s, 0.6 * s, -0.5 * s, 0.8 * s);
  shape.bezierCurveTo(-0.2 * s, 0.9 * s, 0, 0.65 * s, 0, 0.45 * s);
  shape.bezierCurveTo(0, 0.65 * s, 0.2 * s, 0.9 * s, 0.5 * s, 0.8 * s);
  shape.bezierCurveTo(1.1 * s, 0.6 * s, 0.9 * s, -0.2 * s, 0, -0.8 * s);
  return shape;
}

/** Downward-pointing pennant for bunting garlands. */
export function createPennantShape(width: number, height: number) {
  const shape = new Shape();
  shape.moveTo(-width / 2, 0);
  shape.lineTo(width / 2, 0);
  shape.lineTo(0, -height);
  shape.closePath();
  return shape;
}

// Lathe profile for a trophy cup (base → stem → bowl), in meters.
export const trophyProfile = [
  [0, 0],
  [0.09, 0],
  [0.09, 0.035],
  [0.03, 0.05],
  [0.018, 0.07],
  [0.018, 0.13],
  [0.04, 0.15],
  [0.085, 0.19],
  [0.105, 0.27],
  [0.095, 0.275],
  [0.07, 0.2],
  [0, 0.18],
].map(([x, y]) => new Vector2(x, y));

export const smallStar = createStarShape(0.12, 0.055);
export const lanternStar = createStarShape(0.22, 0.1);
export const heart = createHeartShape(0.06);
export const pennant = createPennantShape(0.2, 0.26);

export const softExtrude = { depth: 0.03, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, bevelSegments: 2 };
