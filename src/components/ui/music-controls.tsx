"use client";

import { music, useMusicState } from "../music/youtube-music";

const buttonClass =
  "flex h-8 w-8 items-center justify-center rounded-full text-ink/70 transition hover:bg-blush/40 hover:text-ink disabled:opacity-40";

/** Compact background-music pill: previous, play/pause, next. The track itself plays on the classroom TV. */
export function MusicControls({ visible }: { visible: boolean }) {
  const { ready, playing } = useMusicState();

  return (
    <div
      className={`fixed bottom-5 left-5 z-10 flex items-center gap-0.5 rounded-full border-2 border-white bg-paper/80 p-1 shadow-sm backdrop-blur transition-opacity delay-700 duration-700 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <button type="button" aria-label="Bài trước" disabled={!ready} onClick={music.previous} className={buttonClass}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M6 5h2v14H6zM20 5v14L9 12z" />
        </svg>
      </button>
      <button type="button" aria-label={playing ? "Tạm dừng nhạc" : "Phát nhạc"} onClick={music.toggle} className={buttonClass}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          {playing ? <path d="M6 5h4v14H6zM14 5h4v14h-4z" /> : <path d="M7 4v16l13-8z" />}
        </svg>
      </button>
      <button type="button" aria-label="Bài tiếp theo" disabled={!ready} onClick={music.next} className={buttonClass}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M16 5h2v14h-2zM4 5v14l11-7z" />
        </svg>
      </button>
    </div>
  );
}
