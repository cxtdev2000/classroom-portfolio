"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, QuadraticBezierLine } from "@react-three/drei";
import { DoubleSide, type Group } from "three";
import { useCanvasTexture } from "./canvas-texture";
import { palette, pastelCycle } from "./palette";
import { pennant, smallStar, softExtrude } from "./shapes";
import { digitBlocks } from "./textures";

type BuntingProps = {
  position: [number, number, number];
  rotation?: [number, number, number];
  length: number;
  count: number;
  sag: number;
};

/** Pennant garland hanging along local X, facing +Z. */
export function Bunting({ position, rotation, length, count, sag }: BuntingProps) {
  const flags = Array.from({ length: count }, (_, index) => {
    const t = (index + 0.5) / count;
    const u = 2 * t - 1;
    return {
      x: (t - 0.5) * length,
      y: -sag * (1 - u * u),
      tilt: (2 * sag * u * 2) / length,
      color: pastelCycle[index % pastelCycle.length],
    };
  });

  return (
    <group position={position} rotation={rotation}>
      <QuadraticBezierLine
        start={[-length / 2, 0, 0]}
        end={[length / 2, 0, 0]}
        mid={[0, -2 * sag, 0]}
        color={palette.ink}
        lineWidth={1.2}
      />
      {flags.map((flag) => (
        <mesh key={flag.x} position={[flag.x, flag.y, 0.005]} rotation={[0, 0, flag.tilt]}>
          <shapeGeometry args={[pennant]} />
          <meshStandardMaterial color={flag.color} side={DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

type SymbolKind = "plus" | "minus" | "times" | "divide" | "equals";
type SymbolProps = { kind: SymbolKind; position: [number, number, number]; color: string; speed: number };

function Bar({ size, color, position }: { size: [number, number]; color: string; position?: [number, number, number] }) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[size[0], size[1], 0.06]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Dot({ color, position }: { color: string; position: [number, number, number] }) {
  return (
    <mesh position={position} castShadow>
      <sphereGeometry args={[0.045, 16, 12]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function SymbolShape({ kind, color }: { kind: SymbolKind; color: string }) {
  switch (kind) {
    case "plus":
      return (
        <>
          <Bar size={[0.3, 0.08]} color={color} />
          <Bar size={[0.08, 0.3]} color={color} />
        </>
      );
    case "minus":
      return <Bar size={[0.3, 0.08]} color={color} />;
    case "times":
      return (
        <group rotation={[0, 0, Math.PI / 4]}>
          <Bar size={[0.3, 0.08]} color={color} />
          <Bar size={[0.08, 0.3]} color={color} />
        </group>
      );
    case "divide":
      return (
        <>
          <Bar size={[0.3, 0.07]} color={color} />
          <Dot position={[0, 0.11, 0]} color={color} />
          <Dot position={[0, -0.11, 0]} color={color} />
        </>
      );
    case "equals":
      return (
        <>
          <Bar size={[0.3, 0.07]} position={[0, 0.07, 0]} color={color} />
          <Bar size={[0.3, 0.07]} position={[0, -0.07, 0]} color={color} />
        </>
      );
  }
}

const floatingSymbols: SymbolProps[] = [
  { kind: "plus", position: [-2.8, 3.1, 1.0], color: palette.blush, speed: 1.4 },
  { kind: "times", position: [-1.1, 3.4, 2.3], color: palette.sky, speed: 1.1 },
  { kind: "divide", position: [0.7, 3.05, 0.9], color: palette.sunny, speed: 1.6 },
  { kind: "minus", position: [2.3, 3.35, 1.8], color: palette.lavender, speed: 1.2 },
  { kind: "equals", position: [-0.3, 3.55, -1.1], color: palette.mint, speed: 1.3 },
];

/** Chunky + − × ÷ = floating above the pupils' desks. */
export function FloatingMathSymbols() {
  return (
    <group>
      {floatingSymbols.map((symbol) => (
        <Float key={symbol.kind} position={symbol.position} speed={symbol.speed} rotationIntensity={0.8} floatIntensity={1.2}>
          <SymbolShape kind={symbol.kind} color={symbol.color} />
        </Float>
      ))}
    </group>
  );
}

const hangingStars = [
  { position: [-3.4, 4.3, -0.6], drop: 0.9, color: palette.sunny },
  { position: [-1.8, 4.3, 0.9], drop: 1.2, color: palette.blush },
  { position: [0.0, 4.3, -0.3], drop: 0.8, color: palette.sky },
  { position: [1.6, 4.3, 1.1], drop: 1.1, color: palette.lavender },
  { position: [3.2, 4.3, -0.4], drop: 0.95, color: palette.mint },
  { position: [2.4, 4.3, 2.8], drop: 1.25, color: palette.coral },
] as const;

function HangingStar({ position, drop, color, phase }: { position: readonly number[]; drop: number; color: string; phase: number }) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    const star = ref.current;
    if (!star) return;
    star.rotation.y = Math.sin(clock.elapsedTime * 0.6 + phase) * 0.9;
    star.rotation.z = Math.sin(clock.elapsedTime * 0.9 + phase) * 0.05;
  });

  return (
    <group position={position as [number, number, number]}>
      <group ref={ref}>
        <mesh position={[0, -drop / 2, 0]}>
          <cylinderGeometry args={[0.003, 0.003, drop, 4]} />
          <meshBasicMaterial color={palette.ink} />
        </mesh>
        <mesh position={[0, -drop - 0.1, -0.02]} castShadow>
          <extrudeGeometry args={[smallStar, softExtrude]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    </group>
  );
}

export function HangingStars() {
  return (
    <group>
      {hangingStars.map((star, index) => (
        <HangingStar key={index} {...star} phase={index * 1.3} />
      ))}
    </group>
  );
}

/** Round rug with geometry toys and number blocks — a little "learning through play" corner. */
export function ToyRug({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.006, 0]} receiveShadow>
        <cylinderGeometry args={[1.15, 1.15, 0.012, 48]} />
        <meshStandardMaterial color={palette.lavender} />
      </mesh>
      <mesh position={[0, 0.013, 0]} receiveShadow>
        <cylinderGeometry args={[0.85, 0.85, 0.004, 48]} />
        <meshStandardMaterial color="#d9cbf6" />
      </mesh>
      <mesh position={[0, 0.016, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.95, 1.02, 48]} />
        <meshStandardMaterial color={palette.paper} />
      </mesh>

      {/* Geometry toys */}
      <mesh position={[-0.45, 0.2, -0.2]} rotation={[0, 0.5, 0]} castShadow>
        <coneGeometry args={[0.2, 0.36, 4]} />
        <meshStandardMaterial color={palette.coral} flatShading />
      </mesh>
      <mesh position={[0.1, 0.14, -0.45]} castShadow>
        <cylinderGeometry args={[0.13, 0.13, 0.26, 24]} />
        <meshStandardMaterial color={palette.sky} />
      </mesh>
      <mesh position={[0.5, 0.13, 0.05]} castShadow>
        <sphereGeometry args={[0.12, 24, 18]} />
        <meshStandardMaterial color={palette.mint} />
      </mesh>
      <mesh position={[-0.1, 0.1, 0.45]} rotation={[Math.PI / 2, 0, 0.4]} castShadow>
        <torusGeometry args={[0.13, 0.05, 12, 24]} />
        <meshStandardMaterial color={palette.sunny} />
      </mesh>

      {/* Number blocks stacked like a tiny tower */}
      <NumberBlock index={0} position={[-0.05, 0.1, -0.02]} rotation={0.2} />
      <NumberBlock index={1} position={[0.17, 0.1, 0.02]} rotation={-0.15} />
      <NumberBlock index={2} position={[0.06, 0.3, 0.0]} rotation={0.05} />
      <NumberBlock index={3} position={[-0.55, 0.1, 0.35]} rotation={0.6} />
    </group>
  );
}

function NumberBlock({ index, position, rotation }: { index: number; position: [number, number, number]; rotation: number }) {
  const block = digitBlocks[index];
  const texture = useCanvasTexture(256, 256, block.draw);
  return (
    <mesh position={position} rotation={[0, rotation, 0]} castShadow>
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
