"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html, useCursor } from "@react-three/drei";
import type { Sprite, SpriteMaterial } from "three";
import { useCanvasTexture, type CanvasDraw } from "./canvas-texture";

type Vec3 = [number, number, number];

// Pokes only react while the classroom is in overview, so close-ups and the intro stay calm. Hotspots switch
// them off for their children so a click there still opens the section.
const PokeContext = createContext(false);
export const PokeProvider = PokeContext.Provider;

// Pointer travel (px) above which a click is treated as the end of an orbit drag.
const DRAG_THRESHOLD = 6;
const BUBBLE_MS = 1800;

/** Timestamp of the last poke (-Infinity until the first one) and a handler that records a new poke. */
export function usePoke() {
  const pokedAt = useRef(Number.NEGATIVE_INFINITY);
  const poke = () => {
    pokedAt.current = performance.now();
  };
  return { pokedAt, poke };
}

export const secondsSince = (pokedAt: RefObject<number>) => (performance.now() - pokedAt.current) / 1000;

type PokeableProps = {
  onPoke: () => void;
  /** Speech bubble shown for a moment after each poke; a function is evaluated before `onPoke`. */
  bubble?: string | (() => string);
  bubbleOffset?: Vec3;
  position?: Vec3;
  rotation?: Vec3;
  children: ReactNode;
};

/** Makes a prop clickable in overview: pointer cursor, drag-safe click and an optional speech bubble. */
export function Pokeable({ onPoke, bubble, bubbleOffset = [0, 0.4, 0], position, rotation, children }: PokeableProps) {
  const enabled = useContext(PokeContext);
  const [hovered, setHovered] = useState(false);
  const [message, setMessage] = useState<{ text: string; id: number } | null>(null);
  useCursor(hovered && enabled);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(null), BUBBLE_MS);
    return () => window.clearTimeout(timer);
  }, [message]);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (!enabled) return;
    event.stopPropagation();
    if (event.delta > DRAG_THRESHOLD) return;
    if (bubble) setMessage({ text: typeof bubble === "function" ? bubble() : bubble, id: performance.now() });
    onPoke();
  };

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={handleClick}
      onPointerOver={(event) => {
        if (!enabled) return;
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {children}
      {message && enabled && (
        <Html position={bubbleOffset} center zIndexRange={[30, 10]} pointerEvents="none">
          <span key={message.id} className="poke-bubble">
            {message.text}
          </span>
        </Html>
      )}
    </group>
  );
}

/** Picks a random line so repeated pokes don't feel canned. */
export const pickLine = (lines: readonly string[]) => () => lines[Math.floor(Math.random() * lines.length)];

type PokeBurstProps = {
  draw: CanvasDraw;
  pokedAt: RefObject<number>;
  position?: Vec3;
  count?: number;
  duration?: number;
  /** Vertical travel; negative values fall. */
  height?: number;
  spread?: number;
  size?: number;
  /** Seconds after the poke before the burst starts. */
  delay?: number;
};

/** One-shot shower of glyph sprites (stars, hearts, sparkles) that plays after each poke. */
export function PokeBurst({ draw, pokedAt, position, count = 5, duration = 1.6, height = 0.5, spread = 0.25, size = 0.1, delay = 0 }: PokeBurstProps) {
  const texture = useCanvasTexture(128, 128, draw);
  const spriteRefs = useRef<(Sprite | null)[]>([]);

  useFrame(() => {
    const age = secondsSince(pokedAt) - delay;
    spriteRefs.current.forEach((sprite, index) => {
      if (!sprite) return;
      const start = (index / count) * duration * 0.4;
      const progress = (age - start) / (duration * 0.6);
      sprite.visible = progress > 0 && progress < 1;
      if (!sprite.visible) return;
      // Spread each sprite on its own fixed angle so the burst fans out evenly.
      const angle = index * 2.4;
      const reach = spread * Math.min(1, progress * 2);
      sprite.position.set(Math.cos(angle) * reach, progress * height, Math.sin(angle) * reach * 0.6);
      sprite.scale.setScalar(size * (0.5 + Math.sin(progress * Math.PI) * 0.7));
      (sprite.material as SpriteMaterial).opacity = Math.sin(progress * Math.PI);
    });
  });

  return (
    <group position={position}>
      {Array.from({ length: count }, (_, index) => (
        <sprite key={index} visible={false} ref={(sprite) => { spriteRefs.current[index] = sprite; }}>
          <spriteMaterial map={texture} transparent depthWrite={false} />
        </sprite>
      ))}
    </group>
  );
}
