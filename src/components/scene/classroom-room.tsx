"use client";

import { useRef, type Ref } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, type Group, type MeshBasicMaterial } from "three";
import { useCanvasTexture } from "./canvas-texture";
import { palette } from "./palette";
import { pickLine, Pokeable, PokeBurst, secondsSince, usePoke } from "./pokeable";
import { drawFloor, drawGeometryPoster, drawSparkle } from "./textures";

const ROOM_WIDTH = 10;
const ROOM_DEPTH = 8;
const WALL_HEIGHT = 4.2;

/** Floor, two walls with wainscoting, window with drifting clouds, wall clock and a poster. */
export function ClassroomRoom() {
  const floorTexture = useCanvasTexture(512, 512, drawFloor, [5, 4]);
  const posterTexture = useCanvasTexture(512, 680, drawGeometryPoster);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial map={floorTexture} />
      </mesh>
      <mesh position={[0, -0.101, 0]}>
        <boxGeometry args={[ROOM_WIDTH, 0.2, ROOM_DEPTH]} />
        <meshStandardMaterial color={palette.woodDark} />
      </mesh>

      {/* Back wall */}
      <mesh position={[-0.05, WALL_HEIGHT / 2, -ROOM_DEPTH / 2 - 0.05]} receiveShadow>
        <boxGeometry args={[ROOM_WIDTH + 0.1, WALL_HEIGHT, 0.1]} />
        <meshStandardMaterial color={palette.wall} />
      </mesh>
      <mesh position={[0, 0.5, -ROOM_DEPTH / 2 + 0.01]} receiveShadow>
        <boxGeometry args={[ROOM_WIDTH, 1, 0.02]} />
        <meshStandardMaterial color={palette.wainscot} />
      </mesh>
      <mesh position={[0, 1.02, -ROOM_DEPTH / 2 + 0.03]}>
        <boxGeometry args={[ROOM_WIDTH, 0.06, 0.05]} />
        <meshStandardMaterial color={palette.trim} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-ROOM_WIDTH / 2 - 0.05, WALL_HEIGHT / 2, 0]} receiveShadow>
        <boxGeometry args={[0.1, WALL_HEIGHT, ROOM_DEPTH]} />
        <meshStandardMaterial color={palette.wall} />
      </mesh>
      <mesh position={[-ROOM_WIDTH / 2 + 0.01, 0.5, 0]} receiveShadow>
        <boxGeometry args={[0.02, 1, ROOM_DEPTH]} />
        <meshStandardMaterial color={palette.wainscot} />
      </mesh>
      <mesh position={[-ROOM_WIDTH / 2 + 0.03, 1.02, 0]}>
        <boxGeometry args={[0.05, 0.06, ROOM_DEPTH]} />
        <meshStandardMaterial color={palette.trim} />
      </mesh>

      <ClassroomWindow position={[-4.98, 2.3, 1.7]} rotation={[0, Math.PI / 2, 0]} />
      <WallClock position={[-2.6, 3.25, -3.97]} />

      <GeometryPoster position={[3.4, 2.3, -3.97]} texture={posterTexture} />
    </group>
  );
}

type Placement = { position: [number, number, number]; rotation?: [number, number, number] };

const POSTER_HALF_HEIGHT = 0.71;
const posterLines = pickLine(["a² + b² = c² 📐", "Tam giác có tổng ba góc 180° 🔺", "Hình tròn: S = πr² ⭕"]);

/** Geometry poster pinned at its top edge; a tap sets it swinging on the pin. */
function GeometryPoster({ position, texture }: Placement & { texture: ReturnType<typeof useCanvasTexture> }) {
  const { pokedAt, poke } = usePoke();
  const swingRef = useRef<Group>(null);

  useFrame(() => {
    const swing = swingRef.current;
    if (!swing) return;
    const age = secondsSince(pokedAt);
    swing.rotation.z = age < 4 ? Math.sin(age * 5) * Math.exp(-age * 1.1) * 0.16 : 0;
  });

  return (
    <group position={[position[0], position[1] + POSTER_HALF_HEIGHT, position[2]]}>
      <mesh position={[0, -0.03, 0.02]}>
        <sphereGeometry args={[0.025, 12, 10]} />
        <meshStandardMaterial color={palette.berry} />
      </mesh>
      <group ref={swingRef}>
        <Pokeable onPoke={poke} bubble={posterLines} bubbleOffset={[0, -POSTER_HALF_HEIGHT, 0.2]} position={[0, -POSTER_HALF_HEIGHT, 0]}>
          <mesh>
            <boxGeometry args={[1.08, 1.42, 0.02]} />
            <meshStandardMaterial color={palette.white} />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[1, 1.33]} />
            <meshStandardMaterial map={texture} />
          </mesh>
        </Pokeable>
      </group>
    </group>
  );
}

const clouds = [
  { y: 0.28, speed: 0.05, offset: 0, scale: 1 },
  { y: -0.05, speed: 0.035, offset: 0.45, scale: 0.8 },
  { y: 0.12, speed: 0.042, offset: 0.8, scale: 0.65 },
];

const windowLines = pickLine(["Cầu vồng kìa! 🌈", "Trời đẹp quá, ra chơi thôi! ☀️", "Nắng lên rồi, cả lớp ơi 🌤️"]);
const rainbowColors = [palette.red, palette.coral, palette.sunny, palette.leaf, palette.sky, palette.lavender];
const RAINBOW_SECONDS = 4.5;

/** Window onto a sunny sky. A tap throws open a rainbow, makes the sun beam and ruffles the curtains. */
function ClassroomWindow({ position, rotation }: Placement) {
  const width = 1.8;
  const height = 1.3;
  const frame = palette.trim;
  const { pokedAt, poke } = usePoke();
  const rainbowRef = useRef<Group>(null);
  const bandRefs = useRef<(MeshBasicMaterial | null)[]>([]);
  const sunRef = useRef<Group>(null);
  const curtainRefs = useRef<(Group | null)[]>([]);

  useFrame(() => {
    const age = secondsSince(pokedAt);
    const rainbow = rainbowRef.current;
    if (rainbow) {
      rainbow.visible = age < RAINBOW_SECONDS;
      const fade = Math.min(1, age / 0.6, (RAINBOW_SECONDS - age) / 0.8);
      rainbow.scale.setScalar(0.6 + 0.4 * Math.min(1, age / 0.6));
      bandRefs.current.forEach((band) => {
        if (band) band.opacity = Math.max(0, fade) * 0.85;
      });
    }
    const beam = age < 1.5 ? Math.sin((age / 1.5) * Math.PI) : 0;
    sunRef.current?.scale.setScalar(1 + beam * 0.35);
    curtainRefs.current.forEach((curtain, index) => {
      if (curtain) curtain.rotation.y = age < 3 ? Math.sin(age * 7 + index) * Math.exp(-age * 1.4) * 0.35 : 0;
    });
  });

  return (
    <Pokeable onPoke={poke} bubble={windowLines} bubbleOffset={[0, height / 2 + 0.5, 0.2]} position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="#bfe6fb" />
      </mesh>
      <mesh position={[0, -height / 2 + 0.2, 0.005]}>
        <planeGeometry args={[width, 0.4]} />
        <meshBasicMaterial color="#c9eecf" />
      </mesh>
      <group ref={rainbowRef} position={[-0.15, -0.28, 0.0055]} visible={false}>
        {rainbowColors.map((color, index) => (
          <mesh key={color}>
            <ringGeometry args={[0.52 - (index + 1) * 0.045, 0.52 - index * 0.045, 40, 1, 0, Math.PI]} />
            <meshBasicMaterial ref={(material) => { bandRefs.current[index] = material; }} color={color} transparent opacity={0} depthWrite={false} />
          </mesh>
        ))}
      </group>
      <group ref={sunRef} position={[0.55, 0.38, 0.006]}>
        <mesh>
          <circleGeometry args={[0.13, 24]} />
          <meshBasicMaterial color={palette.sunny} />
        </mesh>
      </group>
      <PokeBurst draw={drawSparkle} pokedAt={pokedAt} position={[0.55, 0.38, 0.02]} count={6} height={0.05} spread={0.26} size={0.08} />
      {clouds.map((cloud) => (
        <Cloud key={cloud.offset} {...cloud} span={width - 0.5} />
      ))}

      {/* Frame + cross mullions */}
      {[
        { p: [0, height / 2, 0.04], s: [width + 0.12, 0.08, 0.08] },
        { p: [0, -height / 2, 0.04], s: [width + 0.12, 0.08, 0.08] },
        { p: [-width / 2, 0, 0.04], s: [0.08, height, 0.08] },
        { p: [width / 2, 0, 0.04], s: [0.08, height, 0.08] },
        { p: [0, 0, 0.03], s: [0.04, height, 0.04] },
        { p: [0, 0, 0.03], s: [width, 0.04, 0.04] },
      ].map(({ p, s }, index) => (
        <mesh key={index} position={p as [number, number, number]} castShadow>
          <boxGeometry args={s as [number, number, number]} />
          <meshStandardMaterial color={frame} />
        </mesh>
      ))}
      <mesh position={[0, -height / 2 - 0.06, 0.1]} castShadow>
        <boxGeometry args={[width + 0.3, 0.05, 0.2]} />
        <meshStandardMaterial color={frame} />
      </mesh>

      {/* Curtains with tie-backs */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * (width / 2 + 0.2), 0, 0.14]} ref={(curtain) => { curtainRefs.current[side < 0 ? 0 : 1] = curtain; }}>
          <mesh position={[0, 0.05, 0]} castShadow>
            <boxGeometry args={[0.32, height + 0.4, 0.05]} />
            <meshStandardMaterial color={palette.blush} side={DoubleSide} />
          </mesh>
          {[-0.08, 0.08].map((x) => (
            <mesh key={x} position={[x, 0.05, 0.03]}>
              <boxGeometry args={[0.02, height + 0.38, 0.02]} />
              <meshStandardMaterial color="#f391b5" />
            </mesh>
          ))}
          <mesh position={[0, -0.25, 0.04]}>
            <torusGeometry args={[0.1, 0.02, 8, 20]} />
            <meshStandardMaterial color={palette.sunny} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, height / 2 + 0.28, 0.16]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, width + 0.9, 12]} />
        <meshStandardMaterial color={palette.woodDark} />
      </mesh>
    </Pokeable>
  );
}

function Cloud({ y, speed, offset, scale, span }: { y: number; speed: number; offset: number; scale: number; span: number }) {
  const ref = useRef<Group>(null);

  useFrame(({ clock }) => {
    const cloud = ref.current;
    if (!cloud) return;
    const progress = (clock.elapsedTime * speed + offset) % 1;
    cloud.position.x = (progress - 0.5) * span;
    // Shrink near the frame so clouds never poke outside the glass.
    const fade = Math.sin(progress * Math.PI);
    cloud.scale.setScalar(scale * Math.min(1, fade * 2.5));
  });

  return (
    <group ref={ref} position={[0, y, 0.01]}>
      {[
        [-0.1, 0, 0.07],
        [0, 0.035, 0.09],
        [0.1, 0, 0.065],
      ].map(([x, py, r]) => (
        <mesh key={x} position={[x, py, 0]}>
          <circleGeometry args={[r, 20]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
}

const ticks = Array.from({ length: 12 }, (_, index) => index);

/** Wall clock driven by the visitor's real local time. */
const clockLines = pickLine(["Sắp ra chơi rồi! ⏰", "Tua nhanh tới giờ ra chơi~ 🔔", "Đúng giờ vào lớp nhé! ⏱️"]);
const FAST_FORWARD_SECONDS = 1.8;

/** Wall clock showing the visitor's real time. A tap fast-forwards the hands a few whole turns and back on time. */
function WallClock({ position }: Placement) {
  const hourRef = useRef<Group>(null);
  const minuteRef = useRef<Group>(null);
  const secondRef = useRef<Group>(null);
  const faceRef = useRef<Group>(null);
  const { pokedAt, poke } = usePoke();

  useFrame(() => {
    const now = new Date();
    const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
    const minutes = now.getMinutes() + seconds / 60;
    const hours = (now.getHours() % 12) + minutes / 60;
    // Whole extra turns (eased) so the hands land back on the real time when the spin ends.
    const progress = Math.min(1, secondsSince(pokedAt) / FAST_FORWARD_SECONDS);
    const spin = (1 - Math.cos(progress * Math.PI)) * Math.PI;
    if (secondRef.current) secondRef.current.rotation.z = -(seconds / 60) * Math.PI * 2 - spin * 3;
    if (minuteRef.current) minuteRef.current.rotation.z = -(minutes / 60) * Math.PI * 2 - spin * 2;
    if (hourRef.current) hourRef.current.rotation.z = -(hours / 12) * Math.PI * 2 - spin;
    if (faceRef.current) faceRef.current.rotation.z = progress < 1 ? Math.sin(progress * Math.PI * 6) * (1 - progress) * 0.12 : 0;
  });

  return (
    <Pokeable onPoke={poke} bubble={clockLines} bubbleOffset={[0, 0.6, 0.1]} position={position}>
      <group ref={faceRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.36, 0.36, 0.06, 40]} />
          <meshStandardMaterial color={palette.sunny} />
        </mesh>
        <mesh position={[0, 0, 0.031]}>
          <circleGeometry args={[0.3, 40]} />
          <meshStandardMaterial color={palette.paper} />
        </mesh>
        {ticks.map((index) => {
          const angle = (index / 12) * Math.PI * 2;
          const major = index % 3 === 0;
          return (
            <mesh key={index} position={[Math.sin(angle) * 0.25, Math.cos(angle) * 0.25, 0.034]} rotation={[0, 0, -angle]}>
              <planeGeometry args={[major ? 0.025 : 0.012, major ? 0.06 : 0.035]} />
              <meshBasicMaterial color={palette.ink} />
            </mesh>
          );
        })}
        <ClockHand ref={hourRef} length={0.14} width={0.028} z={0.04} color={palette.ink} />
        <ClockHand ref={minuteRef} length={0.21} width={0.018} z={0.045} color={palette.ink} />
        <ClockHand ref={secondRef} length={0.23} width={0.007} z={0.05} color={palette.berry} />
        <mesh position={[0, 0, 0.055]}>
          <circleGeometry args={[0.022, 16]} />
          <meshBasicMaterial color={palette.berry} />
        </mesh>
      </group>
    </Pokeable>
  );
}

function ClockHand({
  ref,
  length,
  width,
  z,
  color,
}: {
  ref: Ref<Group>;
  length: number;
  width: number;
  z: number;
  color: string;
}) {
  return (
    <group ref={ref} position={[0, 0, z]}>
      <mesh position={[0, length / 2 - 0.02, 0]}>
        <planeGeometry args={[width, length]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}
