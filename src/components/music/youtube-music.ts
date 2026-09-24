"use client";

import { useSyncExternalStore } from "react";

// Background playlist, played in order and looped. Official uploads that allow embedding.
const PLAYLIST = [
  "8CEJoCr_9UI", // Pink Sweat$ — At My Worst
  "jJPMnTXl63E", // Powfu ft. beabadoobee — death bed (coffee for your head)
  "WyVfkr6nsrk", // Ritt Momney — Put Your Records On
  "GxldQ9eX2wo", // Stephen Sanchez — Until I Found You
  "CPh_YsRhILc", // New West — Those Eyes
  "y1cBhJLNNXU", // beabadoobee — Glue Song
];

// Background level: audible but never louder than the page itself.
const VOLUME = 30;

// Minimal slice of the YouTube IFrame Player API that this module uses.
type YouTubePlayer = {
  playVideo(): void;
  pauseVideo(): void;
  nextVideo(): void;
  previousVideo(): void;
  setVolume(volume: number): void;
  destroy(): void;
};

type YouTubeNamespace = {
  Player: new (
    element: HTMLElement,
    options: {
      width: number;
      height: number;
      videoId: string;
      playerVars: Record<string, string | number>;
      events: {
        onReady: () => void;
        onStateChange: (event: { data: number }) => void;
        onError: () => void;
      };
    },
  ) => YouTubePlayer;
};

declare global {
  interface Window {
    YT?: YouTubeNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const PLAYING = 1;
const BUFFERING = 3;

type MusicState = { ready: boolean; playing: boolean };

let state: MusicState = { ready: false, playing: false };
let player: YouTubePlayer | null = null;
let wantsPlay = false;
let apiPromise: Promise<YouTubeNamespace> | null = null;
const listeners = new Set<() => void>();

function setState(next: Partial<MusicState>) {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

function loadApi() {
  apiPromise ??= new Promise((resolve) => {
    if (window.YT?.Player) return resolve(window.YT);
    window.onYouTubeIframeAPIReady = () => resolve(window.YT as YouTubeNamespace);
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });
  return apiPromise;
}

/** Creates the visible YouTube player inside `container`. Returns a cleanup that destroys it. */
export function mountPlayer(container: HTMLElement, width: number, height: number) {
  let cancelled = false;
  // YouTube replaces its target node with an iframe, so give it a child React doesn't own.
  const target = document.createElement("div");
  container.appendChild(target);

  loadApi().then((YT) => {
    if (cancelled) return;
    const created = new YT.Player(target, {
      width,
      height,
      videoId: PLAYLIST[0],
      playerVars: {
        playlist: PLAYLIST.slice(1).join(","),
        loop: 1,
        controls: 0,
        disablekb: 1,
        rel: 0,
        playsinline: 1,
        iv_load_policy: 3,
      },
      events: {
        onReady: () => {
          if (cancelled) return;
          player = created;
          created.setVolume(VOLUME);
          setState({ ready: true });
          if (wantsPlay) created.playVideo();
        },
        onStateChange: ({ data }) => setState({ playing: data === PLAYING || data === BUFFERING }),
        // Region-blocked or embed-disabled track: skip instead of stalling.
        onError: () => created.nextVideo(),
      },
    });
  });

  return () => {
    cancelled = true;
    player?.destroy();
    player = null;
    container.replaceChildren();
    setState({ ready: false, playing: false });
  };
}

export const music = {
  play() {
    wantsPlay = true;
    player?.playVideo();
  },
  toggle() {
    if (state.playing) {
      wantsPlay = false;
      player?.pauseVideo();
    } else {
      music.play();
    }
  },
  next: () => player?.nextVideo(),
  previous: () => player?.previousVideo(),
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const serverState: MusicState = { ready: false, playing: false };

export function useMusicState() {
  return useSyncExternalStore(subscribe, () => state, () => serverState);
}
