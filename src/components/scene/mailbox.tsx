"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import type { Group } from "three";
import { useCanvasTexture } from "./canvas-texture";
import { palette } from "./palette";
import { heart, softExtrude } from "./shapes";
import { drawMailboxPlate } from "./textures";

const BODY_Y = 1.03;

/** Pastel post box on a stand with a love letter peeking out of the slot. Faces +Z. */
export function Mailbox() {
  const envelopeRef = useRef<Group>(null);
  const flagRef = useRef<Group>(null);
  const plateTexture = useCanvasTexture(512, 160, drawMailboxPlate);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (envelopeRef.current) envelopeRef.current.position.y = BODY_Y + 0.14 + Math.sin(t * 2) * 0.015;
    if (flagRef.current) flagRef.current.rotation.z = -0.15 + Math.sin(t * 1.4) * 0.12;
  });

  return (
    <group>
      <mesh position={[0, 0.025, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.22, 0.05, 28]} />
        <meshStandardMaterial color={palette.mint} />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.05, 0.8, 16]} />
        <meshStandardMaterial color={palette.paper} />
      </mesh>

      <RoundedBox args={[0.52, 0.36, 0.5]} radius={0.04} smoothness={4} position={[0, BODY_Y, 0]} castShadow>
        <meshStandardMaterial color={palette.blush} />
      </RoundedBox>
      <mesh position={[0, BODY_Y + 0.17, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.26, 0.5, 32, 1, false, Math.PI / 2, Math.PI]} />
        <meshStandardMaterial color={palette.blush} />
      </mesh>
      <mesh position={[0, BODY_Y + 0.17, 0.252]}>
        <circleGeometry args={[0.26, 32, 0, Math.PI]} />
        <meshStandardMaterial color="#f9b9cf" />
      </mesh>

      {/* Letter slot + name plate */}
      <mesh position={[0, BODY_Y + 0.12, 0.254]}>
        <boxGeometry args={[0.28, 0.035, 0.01]} />
        <meshStandardMaterial color={palette.ink} />
      </mesh>
      <mesh position={[0, BODY_Y - 0.06, 0.256]}>
        <planeGeometry args={[0.42, 0.13]} />
        <meshStandardMaterial map={plateTexture} />
      </mesh>

      {/* Envelope peeking out of the slot */}
      <group ref={envelopeRef} position={[0, BODY_Y + 0.14, 0.24]} rotation={[-0.35, 0, 0.08]}>
        <mesh castShadow>
          <boxGeometry args={[0.24, 0.15, 0.008]} />
          <meshStandardMaterial color={palette.paper} />
        </mesh>
        <mesh position={[0, 0.035, 0.005]} rotation={[0, 0, Math.PI / 4]}>
          <planeGeometry args={[0.12, 0.12]} />
          <meshStandardMaterial color="#f3e7d8" />
        </mesh>
        <mesh position={[0, 0.0, 0.006]} scale={0.45}>
          <extrudeGeometry args={[heart, { ...softExtrude, depth: 0.01 }]} />
          <meshStandardMaterial color={palette.berry} />
        </mesh>
      </group>

      {/* Waving flag on the side */}
      <group ref={flagRef} position={[0.28, BODY_Y - 0.05, -0.1]}>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.02, 0.3, 0.02]} />
          <meshStandardMaterial color={palette.graphite} />
        </mesh>
        <mesh position={[0.005, 0.26, 0.07]}>
          <boxGeometry args={[0.012, 0.08, 0.13]} />
          <meshStandardMaterial color={palette.red} />
        </mesh>
      </group>

      {[
        { position: [-0.3, 1.6, 0.1], color: palette.berry, speed: 2 },
        { position: [0.22, 1.72, 0.05], color: palette.blush, speed: 1.6 },
        { position: [0.0, 1.9, -0.05], color: palette.coral, speed: 2.4 },
      ].map((floating) => (
        <Float key={floating.color} position={floating.position as [number, number, number]} speed={floating.speed} floatIntensity={1.4}>
          <mesh scale={0.8}>
            <extrudeGeometry args={[heart, softExtrude]} />
            <meshStandardMaterial color={floating.color} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}
