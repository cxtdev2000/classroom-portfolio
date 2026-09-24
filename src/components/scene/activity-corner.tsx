"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { DoubleSide, type Group } from "three";
import { useCanvasTexture } from "./canvas-texture";
import { palette } from "./palette";
import { heart, lanternStar, softExtrude, trophyProfile } from "./shapes";
import { Bunting } from "./decorations";
import { drawBulletinBoard } from "./textures";

const BOARD_WIDTH = 2.2;
const BOARD_HEIGHT = 1.4;

/**
 * Performing-arts corner on the left wall: event bulletin board, trophy cabinet,
 * dance fan, microphone, bunting and swinging star lanterns. Built facing local +Z,
 * then turned to face into the room.
 */
export function ActivityCorner() {
  const boardTexture = useCanvasTexture(1024, 652, drawBulletinBoard);

  return (
    <group rotation={[0, Math.PI / 2, 0]}>
      <group position={[0, 2.25, 0.03]}>
        <mesh castShadow>
          <boxGeometry args={[BOARD_WIDTH + 0.14, BOARD_HEIGHT + 0.14, 0.05]} />
          <meshStandardMaterial color={palette.berry} />
        </mesh>
        <mesh position={[0, 0, 0.026]}>
          <planeGeometry args={[BOARD_WIDTH, BOARD_HEIGHT]} />
          <meshStandardMaterial map={boardTexture} />
        </mesh>
      </group>

      <Bunting position={[0, 3.55, 0.08]} length={2.9} count={11} sag={0.22} />

      {/* Trophy cabinet */}
      <RoundedBox args={[1.7, 0.9, 0.4]} radius={0.03} position={[0, 0.45, 0.22]} castShadow receiveShadow>
        <meshStandardMaterial color={palette.blush} />
      </RoundedBox>
      {[-0.42, 0.42].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.45, 0.425]}>
            <boxGeometry args={[0.78, 0.76, 0.01]} />
            <meshStandardMaterial color="#fbc3d6" />
          </mesh>
          <mesh position={[x + (x < 0 ? 0.3 : -0.3), 0.5, 0.44]}>
            <sphereGeometry args={[0.025, 12, 10]} />
            <meshStandardMaterial color={palette.gold} metalness={0.5} roughness={0.35} />
          </mesh>
        </group>
      ))}

      <group position={[0, 0.9, 0.22]}>
        <Trophy position={[-0.55, 0, 0]} scale={1.25} />
        <Trophy position={[-0.25, 0, 0.05]} scale={0.95} />
        <Medal position={[0.05, 0.12, 0.12]} />
        <Microphone position={[0.32, 0, 0.02]} />
        <DanceFan position={[0.62, 0.02, -0.02]} />
      </group>

      <StarLantern position={[-1.25, 3.05, 0.55]} color={palette.red} phase={0} />
      <StarLantern position={[1.3, 2.95, 0.6]} color={palette.sunny} phase={1.7} />
    </group>
  );
}

type Placement = { position: [number, number, number]; scale?: number };

function Trophy({ position, scale = 1 }: Placement) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.02, 0]} castShadow>
        <boxGeometry args={[0.16, 0.04, 0.16]} />
        <meshStandardMaterial color={palette.ink} />
      </mesh>
      <mesh position={[0, 0.04, 0]} castShadow>
        <latheGeometry args={[trophyProfile, 32]} />
        <meshStandardMaterial color={palette.gold} metalness={0.6} roughness={0.3} side={DoubleSide} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.1, 0.26, 0]} rotation={[0, 0, side * -0.3]}>
          <torusGeometry args={[0.035, 0.008, 8, 16, Math.PI]} />
          <meshStandardMaterial color={palette.gold} metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function Medal({ position }: Placement) {
  return (
    <group position={position} rotation={[-0.35, 0, 0]}>
      <mesh position={[-0.03, 0.07, 0]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[0.03, 0.14, 0.005]} />
        <meshStandardMaterial color={palette.sky} />
      </mesh>
      <mesh position={[0.03, 0.07, 0]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.03, 0.14, 0.005]} />
        <meshStandardMaterial color={palette.berry} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.015, 24]} />
        <meshStandardMaterial color={palette.gold} metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Microphone({ position }: Placement) {
  return (
    <group position={position}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.07, 0.08, 0.03, 20]} />
        <meshStandardMaterial color={palette.ink} />
      </mesh>
      <mesh position={[0, 0.15, 0]} rotation={[0, 0, 0.25]}>
        <cylinderGeometry args={[0.018, 0.013, 0.24, 12]} />
        <meshStandardMaterial color={palette.lavender} />
      </mesh>
      <mesh position={[-0.035, 0.28, 0]} castShadow>
        <sphereGeometry args={[0.04, 16, 12]} />
        <meshStandardMaterial color="#b9b4c7" metalness={0.4} roughness={0.4} />
      </mesh>
    </group>
  );
}

/** Half-open folding fan used in traditional dance performances. */
function DanceFan({ position }: Placement) {
  return (
    <group position={position} rotation={[0, 0, 0.15]}>
      <mesh position={[0, 0.02, 0]}>
        <circleGeometry args={[0.24, 24, Math.PI * 0.1, Math.PI * 0.8]} />
        <meshStandardMaterial color={palette.red} side={DoubleSide} />
      </mesh>
      <mesh position={[0, 0.02, 0.002]}>
        <ringGeometry args={[0.2, 0.235, 24, 1, Math.PI * 0.1, Math.PI * 0.8]} />
        <meshStandardMaterial color={palette.gold} side={DoubleSide} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.02, 10]} />
        <meshStandardMaterial color={palette.woodDark} />
      </mesh>
      <mesh position={[0, 0.12, 0.003]} scale={0.6}>
        <extrudeGeometry args={[heart, softExtrude]} />
        <meshStandardMaterial color={palette.sunny} />
      </mesh>
    </group>
  );
}

/** Mid-Autumn five-point star lantern hanging on a string, swaying gently. */
function StarLantern({ position, color, phase }: { position: [number, number, number]; color: string; phase: number }) {
  const ref = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = Math.sin(clock.elapsedTime * 1.1 + phase) * 0.12;
  });

  return (
    <group position={position}>
      <group ref={ref}>
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.64, 6]} />
          <meshBasicMaterial color={palette.ink} />
        </mesh>
        <mesh position={[0, -0.18, -0.03]} castShadow>
          <extrudeGeometry args={[lanternStar, { ...softExtrude, depth: 0.06 }]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} />
        </mesh>
        <mesh position={[0, -0.18, 0.05]}>
          <circleGeometry args={[0.05, 16]} />
          <meshBasicMaterial color={palette.paper} />
        </mesh>
        {[-0.14, 0.14].map((x) => (
          <mesh key={x} position={[x, -0.44, 0]}>
            <cylinderGeometry args={[0.012, 0.004, 0.14, 6]} />
            <meshStandardMaterial color={palette.gold} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
