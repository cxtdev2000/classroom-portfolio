"use client";

import { profile } from "@/content/portfolio";

type LoadingScreenProps = {
  ready: boolean;
  started: boolean;
  onStart: () => void;
};

const hoppingBlocks = [
  { symbol: "+", color: "bg-blush", delay: "[animation-delay:0s]" },
  { symbol: "×", color: "bg-sky", delay: "[animation-delay:0.15s]" },
  { symbol: "÷", color: "bg-sunny", delay: "[animation-delay:0.3s]" },
  { symbol: "=", color: "bg-mint", delay: "[animation-delay:0.45s]" },
];

/** Intro overlay: hopping math blocks while WebGL boots, then the "Vào lớp" button. Fades out after start. */
export function LoadingScreen({ ready, started, onStart }: LoadingScreenProps) {
  return (
    <div
      aria-hidden={started}
      className={`fixed inset-0 z-30 flex flex-col items-center justify-center gap-8 bg-petal px-6 text-center transition-opacity duration-1000 ${
        started ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex gap-3" aria-hidden>
        {hoppingBlocks.map((block) => (
          <span
            key={block.symbol}
            className={`flex h-14 w-14 animate-hop items-center justify-center rounded-2xl border-2 border-ink/10 font-display text-3xl font-bold text-ink shadow-[0_4px_0_rgba(59,51,85,0.15)] ${block.color} ${block.delay}`}
          >
            {block.symbol}
          </span>
        ))}
      </div>

      <div>
        <p className="font-display text-3xl font-bold text-ink md:text-4xl">{profile.classroomName}</p>
        <p className="mt-1 text-ink/60">{profile.role}</p>
      </div>

      <div className="h-14">
        {ready ? (
          <button
            type="button"
            onClick={onStart}
            className="animate-fade-in rounded-full border-2 border-berry bg-berry px-10 py-3 font-display text-xl font-bold tracking-wider text-paper shadow-[0_5px_0_rgba(59,51,85,0.25)] transition hover:-translate-y-0.5 hover:bg-paper hover:text-berry active:translate-y-0.5"
          >
            Vào lớp ✏️
          </button>
        ) : (
          <p className="font-display text-lg text-ink/60">Đang chuẩn bị bài giảng…</p>
        )}
      </div>
    </div>
  );
}
