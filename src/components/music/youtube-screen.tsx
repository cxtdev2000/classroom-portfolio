"use client";

import { useEffect, useRef } from "react";
import { mountPlayer } from "./youtube-music";

// CSS size of the embed; kept at or above YouTube's 200px minimum player height.
export const SCREEN_WIDTH = 384;
export const SCREEN_HEIGHT = 216;

/** Host element for the background-music YouTube player (rendered on the in-scene TV). */
export function YouTubeScreen() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    return mountPlayer(container, SCREEN_WIDTH, SCREEN_HEIGHT);
  }, []);

  return <div ref={containerRef} style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, background: "#000", overflow: "hidden" }} />;
}
