"use client";

import { useEffect, useRef, type ComponentRef } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import gsap from "gsap";
import { cameraViews, type ViewId } from "./camera-views";

type CameraRigProps = { view: ViewId };

// User orbit limits for the overview. Applied only after a tween settles, because
// OrbitControls.update() clamps the camera and would fight close-up section views.
const overviewLimits = {
  minDistance: 5,
  maxDistance: 17,
  minPolarAngle: Math.PI / 6,
  maxPolarAngle: Math.PI / 2.3,
  minAzimuthAngle: -Math.PI / 12,
  maxAzimuthAngle: Math.PI / 2,
};

const noLimits = {
  minDistance: 0,
  maxDistance: Infinity,
  minPolarAngle: 0,
  maxPolarAngle: Math.PI,
  minAzimuthAngle: -Infinity,
  maxAzimuthAngle: Infinity,
};

/** Tweens the camera + orbit target between predefined views. Free orbit only in overview. */
export function CameraRig({ view }: CameraRigProps) {
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const { position, target } = cameraViews[view];
    const duration = view === "overview" ? 2.2 : 1.6;

    Object.assign(controls, noLimits);
    const timeline = gsap.timeline({
      defaults: { duration, ease: "power3.inOut" },
      onComplete: () => {
        if (view === "overview") Object.assign(controls, overviewLimits);
      },
    });
    timeline
      .to(camera.position, { x: position[0], y: position[1], z: position[2], onUpdate: () => controls.update() }, 0)
      .to(controls.target, { x: target[0], y: target[1], z: target[2] }, 0);

    return () => {
      timeline.kill();
    };
  }, [camera, view]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enabled={view === "overview"}
      enablePan={false}
      enableDamping
      target={cameraViews.intro.target}
    />
  );
}
