"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { sectionTitles } from "@/content/portfolio";
import { ActivityCorner } from "./activity-corner";
import { Bookshelf } from "./bookshelf";
import { CameraRig } from "./camera-rig";
import { cameraViews, type FocusId, type ViewId } from "./camera-views";
import { Chalkboard } from "./chalkboard";
import { ClassroomRoom } from "./classroom-room";
import { Bunting, FloatingMathSymbols, HangingStars, ToyRug } from "./decorations";
import { Hotspot } from "./hotspot";
import { Mailbox } from "./mailbox";
import { palette } from "./palette";
import { PokeProvider } from "./pokeable";
import { RetroTv } from "./retro-tv";
import { Plant } from "./small-props";
import { StudentDesks } from "./student-desks";
import { TeacherDesk } from "./teacher-desk";

type ClassroomSceneProps = {
  view: ViewId;
  onSelect: (id: FocusId) => void;
  onReady: () => void;
};

const background = "#fbe7ef";

/** Full-screen WebGL classroom. Hotspot labels only appear while the camera is in overview. */
export function ClassroomScene({ view, onSelect, onReady }: ClassroomSceneProps) {
  const interactive = view === "overview";
  // Phones render at up to 1.5x and fall back to 1x if the frame rate drops.
  const [dpr, setDpr] = useState(1.5);

  return (
    <Canvas
      shadows
      dpr={[1, dpr]}
      camera={{ position: cameraViews.intro.position, fov: 40, near: 0.1, far: 100 }}
      onCreated={onReady}
      className="scene-canvas !fixed inset-0"
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <color attach="background" args={[background]} />
      <fog attach="fog" args={[background, 18, 38]} />

      <ambientLight intensity={0.8} color="#fff6ee" />
      <hemisphereLight args={["#ffffff", "#f5c6d6", 0.6]} />
      <directionalLight
        castShadow
        position={[5, 8, 6]}
        intensity={1.5}
        color="#fff4e6"
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0005}
      />
      <pointLight position={[-3.8, 2.4, 1.7]} intensity={2.2} distance={5} color="#fff1c4" />

      <PokeProvider value={interactive}>
        <ClassroomRoom />
        <StudentDesks />
        <Bunting position={[0.3, 3.75, -3.93]} length={4.4} count={15} sag={0.25} />
        <Bookshelf position={[-3.95, 0, -3.78]} />
        <ToyRug position={[3.3, 0, 2.5]} />
        <Plant position={[4.5, 0, -3.5]} scale={1.3} potColor={palette.lavender} />
        <Hotspot
          id="tv"
          label="Nghe nhạc"
          position={[4.46, 2.3, -3.75]}
          labelOffset={[0, 1.3, 0]}
          interactive={interactive}
          onSelect={onSelect}
        >
          <RetroTv position={[0, 0, 0]} focused={view === "tv"} />
        </Hotspot>
        <FloatingMathSymbols />
        <HangingStars />

        <Hotspot
          id="about"
          label={sectionTitles.about}
          position={[0.3, 2.25, -3.95]}
          labelOffset={[0, 1.25, 0.1]}
          interactive={interactive}
          onSelect={onSelect}
        >
          <Chalkboard />
        </Hotspot>

        <Hotspot
          id="experience"
          label={sectionTitles.experience}
          position={[2.8, 0, -2.2]}
          labelOffset={[0, 1.55, 0]}
          interactive={interactive}
          onSelect={onSelect}
        >
          <TeacherDesk />
        </Hotspot>

        <Hotspot
          id="activities"
          label={sectionTitles.activities}
          position={[-4.95, 0, -1.2]}
          labelOffset={[0.35, 3.05, 0]}
          interactive={interactive}
          onSelect={onSelect}
        >
          <ActivityCorner />
        </Hotspot>

        <Hotspot
          id="contact"
          label={sectionTitles.contact}
          position={[-3.8, 0, 2.9]}
          labelOffset={[0, 2.2, 0]}
          interactive={interactive}
          onSelect={onSelect}
        >
          <Mailbox />
        </Hotspot>
      </PokeProvider>

      <CameraRig view={view} />
    </Canvas>
  );
}
