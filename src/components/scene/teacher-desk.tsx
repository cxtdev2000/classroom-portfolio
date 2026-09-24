"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { DoubleSide, type Group } from "three";
import { useCanvasTexture } from "./canvas-texture";
import { palette } from "./palette";
import { heart, softExtrude } from "./shapes";
import { Book, Pencil, Plant } from "./small-props";
import { drawGlobe, drawLaptopScreen, drawNamePlate } from "./textures";

export const DESK_TOP_Y = 0.81;
const DESK_WIDTH = 1.7;
const DESK_DEPTH = 0.8;

/** Teacher desk facing +Z with drawers, a chair and a cheerful set of desk items. */
export function TeacherDesk() {
  return (
    <group>
      <RoundedBox args={[DESK_WIDTH, 0.06, DESK_DEPTH]} radius={0.02} position={[0, DESK_TOP_Y - 0.03, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={palette.wood} />
      </RoundedBox>
      {/* Front modesty panel with a heart decal */}
      <mesh position={[0, 0.42, DESK_DEPTH / 2 - 0.04]} castShadow>
        <boxGeometry args={[DESK_WIDTH - 0.1, 0.7, 0.04]} />
        <meshStandardMaterial color={palette.mint} />
      </mesh>
      <mesh position={[-0.3, 0.44, DESK_DEPTH / 2 - 0.01]}>
        <extrudeGeometry args={[heart, softExtrude]} />
        <meshStandardMaterial color={palette.blush} />
      </mesh>
      {/* Drawer pedestal */}
      <mesh position={[0.55, 0.39, -0.02]} castShadow>
        <boxGeometry args={[0.5, 0.78, DESK_DEPTH - 0.1]} />
        <meshStandardMaterial color={palette.paper} />
      </mesh>
      {[0.6, 0.35, 0.12].map((y) => (
        <mesh key={y} position={[0.55, y, -DESK_DEPTH / 2 + 0.04]}>
          <boxGeometry args={[0.1, 0.03, 0.03]} />
          <meshStandardMaterial color={palette.woodDark} />
        </mesh>
      ))}
      <mesh position={[-0.78, 0.39, -0.02]} castShadow>
        <boxGeometry args={[0.06, 0.78, DESK_DEPTH - 0.1]} />
        <meshStandardMaterial color={palette.paper} />
      </mesh>

      <TeacherChair position={[-0.15, 0, -0.75]} />
      <DeskItems />
    </group>
  );
}

function TeacherChair(props: { position: [number, number, number] }) {
  return (
    <group {...props}>
      <RoundedBox args={[0.5, 0.08, 0.48]} radius={0.03} position={[0, 0.5, 0]} castShadow>
        <meshStandardMaterial color={palette.blush} />
      </RoundedBox>
      <RoundedBox args={[0.5, 0.55, 0.07]} radius={0.03} position={[0, 0.85, -0.22]} castShadow>
        <meshStandardMaterial color={palette.blush} />
      </RoundedBox>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.45, 12]} />
        <meshStandardMaterial color={palette.graphite} />
      </mesh>
      {[0, 1, 2, 3, 4].map((index) => {
        const angle = (index / 5) * Math.PI * 2;
        return (
          <mesh key={index} position={[Math.cos(angle) * 0.15, 0.03, Math.sin(angle) * 0.15]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[0.3, 0.03, 0.04]} />
            <meshStandardMaterial color={palette.graphite} />
          </mesh>
        );
      })}
    </group>
  );
}

const pencilColors = [palette.sunny, palette.sky, palette.berry, palette.leaf];

function DeskItems() {
  const globeRef = useRef<Group>(null);
  const globeTexture = useCanvasTexture(512, 256, drawGlobe);
  const screenTexture = useCanvasTexture(512, 320, drawLaptopScreen);
  const plateTexture = useCanvasTexture(512, 170, drawNamePlate);

  useFrame((_, delta) => {
    if (globeRef.current) globeRef.current.rotation.y += delta * 0.4;
  });

  return (
    <group position={[0, DESK_TOP_Y, 0]}>
      {/* Stack of books */}
      <Book size={[0.3, 0.06, 0.22]} color={palette.sky} position={[-0.62, 0.03, -0.05]} />
      <Book size={[0.28, 0.05, 0.2]} color={palette.sunny} position={[-0.61, 0.085, -0.05]} rotation={[0, 0.15, 0]} />
      <Book size={[0.26, 0.05, 0.19]} color={palette.lavender} position={[-0.62, 0.135, -0.04]} rotation={[0, -0.1, 0]} />

      {/* Apple for the teacher */}
      <group position={[-0.62, 0.2, -0.04]}>
        <mesh scale={[1, 0.9, 1]} castShadow>
          <sphereGeometry args={[0.055, 24, 18]} />
          <meshStandardMaterial color={palette.red} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.058, 0]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.004, 0.005, 0.03, 6]} />
          <meshStandardMaterial color={palette.woodDark} />
        </mesh>
        <mesh position={[0.018, 0.066, 0]} rotation={[0, 0, -0.7]} scale={[0.02, 0.007, 0.012]}>
          <sphereGeometry args={[1, 10, 8]} />
          <meshStandardMaterial color={palette.leaf} />
        </mesh>
      </group>

      {/* Laptop angled toward the classroom */}
      <group position={[-0.1, 0, 0.02]} rotation={[0, 0.25, 0]}>
        <RoundedBox args={[0.46, 0.018, 0.32]} radius={0.008} position={[0, 0.009, 0]} castShadow>
          <meshStandardMaterial color="#dcd6ea" />
        </RoundedBox>
        <group position={[0, 0.018, -0.16]} rotation={[-0.25, 0, 0]}>
          <RoundedBox args={[0.46, 0.3, 0.014]} radius={0.008} position={[0, 0.15, 0]} castShadow>
            <meshStandardMaterial color="#dcd6ea" />
          </RoundedBox>
          <mesh position={[0, 0.15, 0.0075]}>
            <planeGeometry args={[0.42, 0.26]} />
            <meshBasicMaterial map={screenTexture} toneMapped={false} />
          </mesh>
        </group>
      </group>

      {/* Spinning globe */}
      <group position={[0.5, 0, -0.18]}>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.07, 0.09, 0.04, 20]} />
          <meshStandardMaterial color={palette.berry} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.1, 8]} />
          <meshStandardMaterial color={palette.gold} metalness={0.5} roughness={0.35} />
        </mesh>
        <group position={[0, 0.25, 0]} rotation={[0, 0, 0.4]}>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.15, 0.007, 8, 40, Math.PI * 1.3]} />
            <meshStandardMaterial color={palette.gold} metalness={0.5} roughness={0.35} />
          </mesh>
          <group ref={globeRef}>
            <mesh castShadow>
              <sphereGeometry args={[0.13, 32, 24]} />
              <meshStandardMaterial map={globeTexture} roughness={0.5} />
            </mesh>
          </group>
        </group>
      </group>

      {/* Pencil cup */}
      <group position={[0.5, 0, 0.18]}>
        <mesh position={[0, 0.06, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.045, 0.12, 20, 1, true]} />
          <meshStandardMaterial color={palette.sunny} side={DoubleSide} />
        </mesh>
        <mesh position={[0, 0.002, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.004, 20]} />
          <meshStandardMaterial color={palette.sunny} />
        </mesh>
        {pencilColors.map((color, index) => {
          const angle = (index / pencilColors.length) * Math.PI * 2;
          return (
            <Pencil
              key={color}
              color={color}
              position={[Math.cos(angle) * 0.02, 0.02, Math.sin(angle) * 0.02]}
              rotation={[Math.sin(angle) * 0.2, 0, -Math.cos(angle) * 0.2]}
            />
          );
        })}
      </group>

      {/* Name plate */}
      <group position={[0.1, 0, 0.3]}>
        <mesh position={[0, 0.045, 0]} rotation={[-0.35, 0, 0]}>
          <boxGeometry args={[0.36, 0.12, 0.02]} />
          <meshStandardMaterial color={palette.blush} />
        </mesh>
        <mesh position={[0, 0.047, 0.012]} rotation={[-0.35, 0, 0]}>
          <planeGeometry args={[0.35, 0.116]} />
          <meshStandardMaterial map={plateTexture} />
        </mesh>
      </group>

      <Plant position={[0.72, 0, 0.0]} scale={0.45} potColor={palette.sky} />
    </group>
  );
}
