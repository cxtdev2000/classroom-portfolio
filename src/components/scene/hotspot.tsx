"use client";

import { useRef, useState, type ReactNode } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html, useCursor } from "@react-three/drei";
import { Vector3, type Group } from "three";
import type { SectionId } from "@/content/portfolio";

type HotspotProps = {
  id: SectionId;
  label: string;
  position: [number, number, number];
  labelOffset: [number, number, number];
  interactive: boolean;
  onSelect: (id: SectionId) => void;
  children: ReactNode;
};

const targetScale = new Vector3();

/** Clickable group: grows slightly on hover and shows a floating label while the classroom is in overview. */
export function Hotspot({ id, label, position, labelOffset, interactive, onSelect, children }: HotspotProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered && interactive);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const scale = hovered && interactive ? 1.05 : 1;
    group.scale.lerp(targetScale.set(scale, scale, scale), 1 - Math.exp(-delta * 10));
  });

  const handleOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(true);
  };

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (interactive) onSelect(id);
  };

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={handleOver}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      {children}
      {interactive && (
        <Html position={labelOffset} center zIndexRange={[10, 0]}>
          <button
            type="button"
            onClick={() => onSelect(id)}
            className={`hotspot-label ${hovered ? "hotspot-label--active" : ""}`}
          >
            {label}
          </button>
        </Html>
      )}
    </group>
  );
}
