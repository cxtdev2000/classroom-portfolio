"use client";

import { useRef, type RefObject } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { Group, Sprite } from "three";
import { useCanvasTexture } from "./canvas-texture";
import { palette } from "./palette";
import { pickLine, Pokeable, PokeBurst, secondsSince, usePoke } from "./pokeable";
import { drawHeart, drawSparkle, drawWaterDrop } from "./textures";

type GroupProps = ThreeElements["group"];

/** Hexagonal pencil standing along +Y with a pink eraser and a sharpened tip. */
export function Pencil({ color, length = 0.18, ...props }: { color: string; length?: number } & GroupProps) {
  return (
    <group {...props}>
      <mesh position={[0, length / 2, 0]}>
        <cylinderGeometry args={[0.009, 0.009, length, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, length + 0.015, 0]}>
        <coneGeometry args={[0.009, 0.03, 6]} />
        <meshStandardMaterial color={palette.wood} />
      </mesh>
      <mesh position={[0, length + 0.027, 0]}>
        <coneGeometry args={[0.0035, 0.008, 6]} />
        <meshStandardMaterial color={palette.graphite} />
      </mesh>
      <mesh position={[0, -0.008, 0]}>
        <cylinderGeometry args={[0.0095, 0.0095, 0.018, 12]} />
        <meshStandardMaterial color={palette.blush} />
      </mesh>
    </group>
  );
}

/** Closed book lying flat: colored cover with cream page block on the open edges. */
export function Book({
  size,
  color,
  ...props
}: { size: [number, number, number]; color: string } & GroupProps) {
  const [width, height, depth] = size;
  return (
    <group {...props}>
      <RoundedBox args={size} radius={0.006} smoothness={2}>
        <meshStandardMaterial color={color} />
      </RoundedBox>
      <mesh position={[0.006, 0, 0]}>
        <boxGeometry args={[width - 0.01, height * 0.72, depth - 0.012]} />
        <meshStandardMaterial color={palette.paper} />
      </mesh>
    </group>
  );
}

/** Open notebook with two pages and a center crease. */
export function OpenNotebook(props: GroupProps) {
  return (
    <group {...props}>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.085, 0.006, 0]} rotation={[0, 0, side * -0.06]}>
          <boxGeometry args={[0.17, 0.008, 0.23]} />
          <meshStandardMaterial color={palette.paper} />
        </mesh>
      ))}
      <mesh position={[0, 0.002, 0]}>
        <boxGeometry args={[0.36, 0.004, 0.24]} />
        <meshStandardMaterial color={palette.lavender} />
      </mesh>
      {[-0.06, -0.02, 0.02, 0.06].map((z) => (
        <mesh key={z} position={[0.085, 0.0125, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.13, 0.004]} />
          <meshBasicMaterial color={palette.sky} />
        </mesh>
      ))}
    </group>
  );
}

const LEAVES = [0, 1, 2, 3, 4, 5, 6];
const LEAF_BASE = 0.3;

const thankYous = pickLine(["Cảm ơn cô! 💧", "Mát quá~ 🌿", "Cây lớn nhanh như học trò 🌱"]);

// Watering timeline (seconds after the poke): the can swings in, pours, then the leaves perk up.
const POUR_START = 0.55;
const POUR_END = 1.95;
const CAN_GONE = 2.4;

/** Round potted plant with chunky leaves. Tap it to water it. */
export function Plant({ potColor = palette.coral, ...props }: { potColor?: string } & GroupProps) {
  const { pokedAt, poke } = usePoke();
  const leavesRef = useRef<Group>(null);

  useFrame(() => {
    const leaves = leavesRef.current;
    if (!leaves) return;
    const since = secondsSince(pokedAt) - POUR_START - 0.3;
    const perk = since > 0 && since < 3 ? Math.sin(since * 9) * Math.exp(-since * 1.8) * 0.12 : 0;
    leaves.scale.set(1 - perk * 0.4, 1 + perk, 1 - perk * 0.4);
  });

  return (
    <group {...props}>
      <Pokeable onPoke={poke} bubble={thankYous} bubbleOffset={[0, 1.05, 0]}>
        <mesh position={[0, 0.14, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.12, 0.28, 20]} />
          <meshStandardMaterial color={potColor} />
        </mesh>
        <mesh position={[0, 0.285, 0]}>
          <torusGeometry args={[0.155, 0.02, 8, 24]} />
          <meshStandardMaterial color={potColor} />
        </mesh>
        <group ref={leavesRef} position={[0, LEAF_BASE, 0]}>
          {LEAVES.map((index) => {
            const angle = (index / LEAVES.length) * Math.PI * 2;
            const tilt = index === 0 ? 0 : 0.55;
            const reach = index === 0 ? 0 : 0.08;
            return (
              <mesh
                key={index}
                position={[Math.cos(angle) * reach, 0.45 - LEAF_BASE, Math.sin(angle) * reach]}
                rotation={[Math.sin(angle) * tilt, 0, -Math.cos(angle) * tilt]}
                scale={[0.07, 0.2, 0.035]}
                castShadow
              >
                <sphereGeometry args={[1, 16, 12]} />
                <meshStandardMaterial color={index % 2 === 0 ? palette.leaf : "#86d39f"} />
              </mesh>
            );
          })}
        </group>
      </Pokeable>
      <WateringCan pokedAt={pokedAt} />
      <PokeBurst draw={drawSparkle} pokedAt={pokedAt} position={[0, 0.6, 0]} delay={POUR_END - 0.4} count={6} height={0.4} spread={0.3} size={0.1} />
    </group>
  );
}

const CAN_POSITION: [number, number, number] = [0.36, 0.95, 0];
const CAN_TILT = 0.7;
// Spout tip in plant space once the can is tilted (the rose of the can, see the geometry below).
const SPOUT_TIP: [number, number, number] = [0.094, 0.868, 0];
const SOIL_Y = 0.3;
const DROPS = 6;

/** Sky-blue watering can that swings in over the pot, pours a stream of drops and leaves again. */
function WateringCan({ pokedAt }: { pokedAt: RefObject<number> }) {
  const canRef = useRef<Group>(null);
  const dropRefs = useRef<(Sprite | null)[]>([]);
  const drop = useCanvasTexture(64, 64, drawWaterDrop);

  useFrame(() => {
    const can = canRef.current;
    if (!can) return;
    const age = secondsSince(pokedAt);
    can.visible = age < CAN_GONE;
    if (!can.visible) return;
    const grow = Math.min(1, age / 0.3, (CAN_GONE - age) / 0.3);
    can.scale.setScalar(Math.max(0.001, grow));
    const tiltIn = Math.min(1, Math.max(0, (age - 0.3) / 0.3));
    const tiltOut = Math.min(1, Math.max(0, (POUR_END + 0.15 - age) / 0.25));
    can.rotation.z = CAN_TILT * Math.min(tiltIn, tiltOut);

    const pouring = age > POUR_START && age < POUR_END;
    dropRefs.current.forEach((sprite, index) => {
      if (!sprite) return;
      sprite.visible = pouring;
      if (!pouring) return;
      const progress = ((age - POUR_START) * 1.8 + index / DROPS) % 1;
      sprite.position.set(SPOUT_TIP[0] + Math.sin(index * 1.7) * 0.03, SPOUT_TIP[1] - progress * (SPOUT_TIP[1] - SOIL_Y), Math.cos(index * 2.3) * 0.03);
    });
  });

  return (
    <group>
      <group ref={canRef} position={CAN_POSITION} visible={false}>
        <mesh castShadow>
          <cylinderGeometry args={[0.1, 0.11, 0.16, 24]} />
          <meshStandardMaterial color={palette.sky} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.1, 0.01, 8, 24]} />
          <meshStandardMaterial color={palette.sunny} />
        </mesh>
        {/* Spout angled up and out, capped by a rose */}
        <mesh position={[-0.17, 0.04, 0]} rotation={[0, 0, 0.9]}>
          <cylinderGeometry args={[0.012, 0.02, 0.22, 10]} />
          <meshStandardMaterial color={palette.sky} roughness={0.5} />
        </mesh>
        <mesh position={[-0.256, 0.108, 0]} rotation={[0, 0, 0.9]}>
          <cylinderGeometry args={[0.03, 0.014, 0.03, 12]} />
          <meshStandardMaterial color={palette.sunny} />
        </mesh>
        <mesh position={[0.04, 0.08, 0]}>
          <torusGeometry args={[0.07, 0.012, 8, 16, Math.PI]} />
          <meshStandardMaterial color={palette.berry} />
        </mesh>
      </group>
      {Array.from({ length: DROPS }, (_, index) => (
        <sprite key={index} visible={false} scale={0.04} ref={(sprite) => { dropRefs.current[index] = sprite; }}>
          <spriteMaterial map={drop} transparent depthWrite={false} />
        </sprite>
      ))}
    </group>
  );
}

const backpackLines = pickLine(["Nhớ mang đủ sách vở nhé 🎒", "Hôm nay có bài tập về nhà không cô?", "Cặp nặng quá trời! 😅"]);

/** Rounded backpack with a front pocket and two straps. Tap it for a wiggle. */
export function Backpack({ color, ...props }: { color: string } & GroupProps) {
  const { pokedAt, poke } = usePoke();
  const bodyRef = useRef<Group>(null);

  useFrame(() => {
    const body = bodyRef.current;
    if (!body) return;
    const age = secondsSince(pokedAt);
    const wiggle = age < 1.5 ? Math.sin(age * 18) * Math.exp(-age * 3) : 0;
    body.rotation.z = wiggle * 0.25;
    body.scale.set(1 + wiggle * 0.06, 1 - wiggle * 0.06, 1);
  });

  return (
    <group {...props}>
      <Pokeable onPoke={poke} bubble={backpackLines} bubbleOffset={[0, 0.6, 0]}>
        <group ref={bodyRef}>
          <RoundedBox args={[0.3, 0.36, 0.16]} radius={0.06} smoothness={4} position={[0, 0.18, 0]} castShadow>
            <meshStandardMaterial color={color} />
          </RoundedBox>
          <RoundedBox args={[0.22, 0.14, 0.06]} radius={0.03} smoothness={3} position={[0, 0.1, 0.09]}>
            <meshStandardMaterial color={palette.paper} />
          </RoundedBox>
          <mesh position={[0, 0.37, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.05, 0.012, 8, 16, Math.PI]} />
            <meshStandardMaterial color={palette.ink} />
          </mesh>
        </group>
      </Pokeable>
      <PokeBurst draw={drawHeart} pokedAt={pokedAt} position={[0, 0.4, 0]} count={4} height={0.35} spread={0.18} size={0.08} />
    </group>
  );
}
