"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { FocusId, ViewId } from "./scene/camera-views";
import { music } from "./music/youtube-music";
import { LoadingScreen } from "./ui/loading-screen";
import { MusicControls } from "./ui/music-controls";
import { SectionPanel } from "./ui/section-panel";
import { SiteNav } from "./ui/site-nav";

// WebGL only runs in the browser; keep three.js out of the server bundle.
const ClassroomScene = dynamic(() => import("./scene/classroom-scene").then((mod) => mod.ClassroomScene), {
  ssr: false,
});

/** Top-level client shell: owns intro state and the camera focus (a section or the TV), wires scene ↔ HTML overlays. */
export function ClassroomExperience() {
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);
  const [focus, setFocus] = useState<FocusId | null>(null);
  const section = focus === "tv" ? null : focus;

  const view: ViewId = !started ? "intro" : (focus ?? "overview");
  const closeSection = useCallback(() => setFocus(null), []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSection();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [closeSection]);

  return (
    <main className="h-dvh w-full overflow-hidden bg-petal">
      <ClassroomScene view={view} onSelect={setFocus} onReady={() => setReady(true)} />
      <SiteNav visible={started} active={section} onSelect={setFocus} onHome={closeSection} />
      <SectionPanel section={section} onClose={closeSection} />
      {started && focus === null && (
        <p className="pointer-events-none fixed inset-x-0 bottom-16 z-10 animate-fade-in px-4 md:bottom-6 text-center text-sm font-semibold text-ink/60 [animation-delay:2s]">
          Kéo để xoay · Chạm vào mọi thứ: tưới cây, tua đồng hồ, gảy bàn tính…
        </p>
      )}
      {focus === "tv" && (
        <button
          type="button"
          onClick={closeSection}
          className="fixed inset-x-0 bottom-5 z-10 mx-auto w-fit animate-fade-in rounded-full border-2 border-white bg-paper/80 px-4 py-2 text-sm font-bold text-ink/70 shadow-sm backdrop-blur transition hover:text-ink"
        >
          ← Quay lại
        </button>
      )}
      <MusicControls visible={started} />
      <LoadingScreen
        ready={ready}
        started={started}
        onStart={() => {
          setStarted(true);
          // Runs inside the click, so browsers allow the background music to start with sound.
          music.play();
        }}
      />
    </main>
  );
}
