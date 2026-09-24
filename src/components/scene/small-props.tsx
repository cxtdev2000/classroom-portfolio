"use client";

import type { ThreeElements } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { palette } from "./palette";

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

/** Round potted plant with chunky leaves. */
export function Plant({ potColor = palette.coral, ...props }: { potColor?: string } & GroupProps) {
  const leaves = [0, 1, 2, 3, 4, 5, 6];
  return (
    <group {...props}>
      <mesh position={[0, 0.14, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.12, 0.28, 20]} />
        <meshStandardMaterial color={potColor} />
      </mesh>
      <mesh position={[0, 0.285, 0]}>
        <torusGeometry args={[0.155, 0.02, 8, 24]} />
        <meshStandardMaterial color={potColor} />
      </mesh>
      {leaves.map((index) => {
        const angle = (index / leaves.length) * Math.PI * 2;
        const tilt = index === 0 ? 0 : 0.55;
        return (
          <mesh
            key={index}
            position={[Math.cos(angle) * (index === 0 ? 0 : 0.08), 0.45, Math.sin(angle) * (index === 0 ? 0 : 0.08)]}
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
  );
}

/** Rounded backpack with a front pocket and two straps. */
export function Backpack({ color, ...props }: { color: string } & GroupProps) {
  return (
    <group {...props}>
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
  );
}
