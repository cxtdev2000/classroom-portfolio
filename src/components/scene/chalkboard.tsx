"use client";

import { useCanvasTexture } from "./canvas-texture";
import { palette } from "./palette";
import { drawChalkboard } from "./textures";

const BOARD_WIDTH = 3.6;
const BOARD_HEIGHT = 1.8;
const chalkColors = [palette.white, palette.blush, palette.sunny, palette.sky];

/** Wall-mounted chalkboard with formulas, a wooden frame, a chalk tray and an eraser. Faces +Z. */
export function Chalkboard() {
  const texture = useCanvasTexture(1024, 512, drawChalkboard);

  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[BOARD_WIDTH + 0.2, BOARD_HEIGHT + 0.2, 0.08]} />
        <meshStandardMaterial color={palette.wood} />
      </mesh>
      <mesh position={[0, 0, 0.041]}>
        <planeGeometry args={[BOARD_WIDTH, BOARD_HEIGHT]} />
        <meshStandardMaterial map={texture} roughness={0.95} />
      </mesh>

      <mesh position={[0, -BOARD_HEIGHT / 2 - 0.08, 0.1]} castShadow>
        <boxGeometry args={[BOARD_WIDTH, 0.05, 0.16]} />
        <meshStandardMaterial color={palette.woodDark} />
      </mesh>
      {chalkColors.map((color, index) => (
        <mesh
          key={color}
          position={[-1.2 + index * 0.16, -BOARD_HEIGHT / 2 - 0.04, 0.12]}
          rotation={[0, 0.3 * (index - 1.5), Math.PI / 2]}
        >
          <cylinderGeometry args={[0.014, 0.014, 0.1, 10]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
      <group position={[1.1, -BOARD_HEIGHT / 2 - 0.02, 0.12]} rotation={[0, -0.2, 0]}>
        <mesh>
          <boxGeometry args={[0.26, 0.05, 0.1]} />
          <meshStandardMaterial color={palette.lavender} />
        </mesh>
        <mesh position={[0, -0.03, 0]}>
          <boxGeometry args={[0.26, 0.015, 0.1]} />
          <meshStandardMaterial color={palette.graphite} />
        </mesh>
      </group>
    </group>
  );
}
