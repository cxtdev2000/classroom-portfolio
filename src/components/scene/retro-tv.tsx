"use client";

import { Html, RoundedBox } from "@react-three/drei";
import { YouTubeScreen, SCREEN_WIDTH } from "../music/youtube-screen";
import { palette } from "./palette";

type Vec3 = [number, number, number];

const SCREEN_W = 0.72;
const SCREEN_H = 0.405;
const BODY: Vec3 = [0.96, 0.7, 0.42];
// drei's transform mode maps 1 CSS px to distanceFactor / 400 world units.
const DISTANCE_FACTOR = (SCREEN_W * 400) / SCREEN_WIDTH;

/** Chunky pastel retro TV with bunny-ear antennae on a little wall shelf. Its screen is the YouTube music player. */
export function RetroTv({ position, focused }: { position: Vec3; focused: boolean }) {
  const front = BODY[2] / 2;
  return (
    <group position={position}>
      {/* Wall shelf with brackets; the group origin is the centre of the shelf top */}
      <RoundedBox args={[1.04, 0.05, 0.5]} radius={0.015} position={[0, -0.025, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={palette.wood} />
      </RoundedBox>
      {[-0.4, 0.4].map((x) => (
        <mesh key={x} position={[x, -0.16, -0.1]} rotation={[Math.PI / 4, 0, 0]}>
          <boxGeometry args={[0.04, 0.05, 0.3]} />
          <meshStandardMaterial color={palette.woodDark} />
        </mesh>
      ))}

      <group position={[0, BODY[1] / 2 + 0.03, 0]}>
        <RoundedBox args={BODY} radius={0.1} smoothness={4} castShadow receiveShadow>
          <meshStandardMaterial color={palette.blush} roughness={0.5} />
        </RoundedBox>
        {/* Cream bezel around the screen */}
        <RoundedBox args={[SCREEN_W + 0.08, SCREEN_H + 0.08, 0.04]} radius={0.03} position={[-0.06, 0.03, front]}>
          <meshStandardMaterial color={palette.paper} roughness={0.4} />
        </RoundedBox>
        <mesh position={[-0.06, 0.03, front + 0.021]}>
          <planeGeometry args={[SCREEN_W + 0.01, SCREEN_H + 0.01]} />
          <meshStandardMaterial color={palette.ink} roughness={0.3} />
        </mesh>
        {/* Knobs and speaker dots on the right */}
        {[0.12, -0.02].map((y, index) => (
          <mesh key={y} position={[0.39, y, front + 0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.04, 20]} />
            <meshStandardMaterial color={index ? palette.sky : palette.sunny} />
          </mesh>
        ))}
        {[0, 1, 2].map((row) => (
          <mesh key={row} position={[0.39, -0.12 - row * 0.035, front + 0.002]}>
            <circleGeometry args={[0.009, 10]} />
            <meshStandardMaterial color={palette.berry} />
          </mesh>
        ))}
        {/* Stubby legs */}
        {[-0.34, 0.34].map((x) => (
          <mesh key={x} position={[x, -BODY[1] / 2 - 0.005, 0.08]}>
            <cylinderGeometry args={[0.03, 0.02, 0.04, 12]} />
            <meshStandardMaterial color={palette.lavender} />
          </mesh>
        ))}
        {/* Antennae */}
        {[-0.45, 0.45].map((tilt) => (
          <group key={tilt} position={[0, BODY[1] / 2 - 0.01, -0.05]} rotation={[0, 0, tilt]}>
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.007, 0.007, 0.4, 6]} />
              <meshStandardMaterial color={palette.graphite} metalness={0.5} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.41, 0]}>
              <sphereGeometry args={[0.025, 12, 10]} />
              <meshStandardMaterial color={palette.sunny} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, BODY[1] / 2, -0.05]}>
          <sphereGeometry args={[0.05, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={palette.mint} />
        </mesh>

        {/* The player sits behind the WebGL canvas (see .scene-canvas) and shows through a hole the "blending" occluder cuts,
            so props in front of the TV hide it. Until zoomed in, clicks and drags pass through to the TV hotspot and the
            orbit controls; once focused the video itself takes taps */}
        <Html
          transform
          occlude="blending"
          position={[-0.06, 0.03, front + 0.023]}
          distanceFactor={DISTANCE_FACTOR}
          zIndexRange={[0, 0]}
          pointerEvents={focused ? "auto" : "none"}
        >
          <YouTubeScreen />
        </Html>
      </group>
    </group>
  );
}
