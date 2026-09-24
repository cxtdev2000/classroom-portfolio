"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { SectionId } from "@/content/portfolio";
import type { ViewId } from "./scene/camera-views";
import { LoadingScreen } from "./ui/loading-screen";
import { SectionPanel } from "./ui/section-panel";
import { SiteNav } from "./ui/site-nav";

// WebGL only runs in the browser; keep three.js out of the server bundle.
const ClassroomScene = dynamic(() => import("./scene/classroom-scene").then((mod) => mod.ClassroomScene), {
  ssr: false,
});

/** Top-level client shell: owns intro state and the active section, wires scene ↔ HTML overlays. */
export function ClassroomExperience() {
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);
  const [section, setSection] = useState<SectionId | null>(null);

  const view: ViewId = !started ? "intro" : (section ?? "overview");
  const closeSection = useCallback(() => setSection(null), []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSection();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [closeSection]);

  return (
    <main className="h-dvh w-full overflow-hidden bg-petal">
      <ClassroomScene view={view} onSelect={setSection} onReady={() => setReady(true)} />
      <SiteNav visible={started} active={section} onSelect={setSection} onHome={closeSection} />
      <SectionPanel section={section} onClose={closeSection} />
      {started && section === null && (
        <p className="pointer-events-none fixed inset-x-0 bottom-6 z-10 animate-fade-in text-center text-sm font-semibold text-ink/60 [animation-delay:2s]">
          Kéo để xoay · Chạm vào đồ vật để khám phá
        </p>
      )}
      <LoadingScreen ready={ready} started={started} onStart={() => setStarted(true)} />
    </main>
  );
}
