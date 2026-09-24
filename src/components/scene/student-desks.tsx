"use client";

import { RoundedBox } from "@react-three/drei";
import { palette } from "./palette";
import { Backpack, Book, OpenNotebook, Pencil } from "./small-props";

type StudentDeskProps = {
  position: [number, number, number];
  frameColor: string;
  backpackColor?: string;
  variant: number;
};

const DESK_TOP_Y = 0.72;
const legOffsets: [number, number][] = [
  [-0.5, -0.24],
  [0.5, -0.24],
  [-0.5, 0.24],
  [0.5, 0.24],
];

/** Two-seat pupil desk facing the chalkboard (-Z) with a chair behind it. */
function StudentDesk({ position, frameColor, backpackColor, variant }: StudentDeskProps) {
  return (
    <group position={position}>
      <RoundedBox args={[1.1, 0.05, 0.56]} radius={0.02} position={[0, DESK_TOP_Y, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={palette.wood} />
      </RoundedBox>
      <mesh position={[0, DESK_TOP_Y - 0.12, -0.05]} castShadow>
        <boxGeometry args={[1.0, 0.18, 0.4]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>
      {legOffsets.map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, DESK_TOP_Y / 2, z]} castShadow>
          <cylinderGeometry args={[0.022, 0.022, DESK_TOP_Y, 10]} />
          <meshStandardMaterial color={frameColor} />
        </mesh>
      ))}

      {/* Desk items vary per desk so the room feels lived-in */}
      <group position={[0, DESK_TOP_Y + 0.025, 0]}>
        {variant % 2 === 0 ? (
          <OpenNotebook position={[-0.22, 0, 0.02]} rotation={[0, 0.1, 0]} />
        ) : (
          <Book size={[0.24, 0.04, 0.18]} color={palette.coral} position={[-0.25, 0.02, 0]} rotation={[0, -0.2, 0]} />
        )}
        <Pencil color={variant % 3 === 0 ? palette.sky : palette.berry} position={[0.05, 0.01, 0.08]} rotation={[0, 0.4, Math.PI / 2]} />
        {variant % 3 === 1 && (
          <mesh position={[0.3, 0.02, -0.05]} castShadow>
            <boxGeometry args={[0.2, 0.04, 0.07]} />
            <meshStandardMaterial color={palette.lavender} />
          </mesh>
        )}
        {variant % 3 === 2 && (
          <mesh position={[0.32, 0.05, -0.08]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.1, 16]} />
            <meshStandardMaterial color={palette.mint} />
          </mesh>
        )}
      </group>

      <StudentChair position={[-0.25, 0, 0.5]} color={frameColor} />
      <StudentChair position={[0.25, 0, 0.5]} color={frameColor} />
      {backpackColor && <Backpack color={backpackColor} position={[0.25, 0.46, 0.55]} rotation={[-0.1, Math.PI, 0]} />}
    </group>
  );
}

function StudentChair({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <RoundedBox args={[0.4, 0.04, 0.38]} radius={0.015} position={[0, 0.44, 0]} castShadow>
        <meshStandardMaterial color={palette.wood} />
      </RoundedBox>
      <RoundedBox args={[0.4, 0.22, 0.03]} radius={0.012} position={[0, 0.72, 0.18]} castShadow>
        <meshStandardMaterial color={palette.wood} />
      </RoundedBox>
      {[
        [-0.17, -0.16],
        [0.17, -0.16],
        [-0.17, 0.17],
        [0.17, 0.17],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.22, z]} castShadow>
          <cylinderGeometry args={[0.016, 0.016, 0.44, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
      {[-0.17, 0.17].map((x) => (
        <mesh key={x} position={[x, 0.58, 0.18]}>
          <cylinderGeometry args={[0.014, 0.014, 0.3, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}

const desks: StudentDeskProps[] = [
  { position: [-2.4, 0, 0.1], frameColor: palette.sky, backpackColor: palette.berry, variant: 0 },
  { position: [-0.6, 0, 0.1], frameColor: palette.blush, variant: 1 },
  { position: [1.2, 0, 0.1], frameColor: palette.mint, backpackColor: palette.sunny, variant: 2 },
  { position: [-2.4, 0, 1.7], frameColor: palette.lavender, variant: 3 },
  { position: [-0.6, 0, 1.7], frameColor: palette.sunny, backpackColor: palette.sky, variant: 4 },
  { position: [1.2, 0, 1.7], frameColor: palette.coral, variant: 5 },
];

export function StudentDesks() {
  return (
    <group>
      {desks.map((desk) => (
        <StudentDesk key={desk.variant} {...desk} />
      ))}
    </group>
  );
}
