"use client";

import { sectionTitles, type SectionId } from "@/content/portfolio";
import { SectionContent } from "./section-content";

type SectionPanelProps = {
  section: SectionId | null;
  onClose: () => void;
};

/** Slide-in notebook card (right side on desktop, bottom sheet on mobile). */
export function SectionPanel({ section, onClose }: SectionPanelProps) {
  const open = section !== null;

  return (
    <aside
      aria-hidden={!open}
      className={`fixed inset-x-3 bottom-3 z-20 max-h-[55vh] overflow-y-auto rounded-[2rem] border-4 border-white bg-paper/95 p-6 shadow-2xl backdrop-blur transition-all duration-700 md:inset-x-auto md:top-24 md:right-8 md:bottom-8 md:max-h-none md:w-[440px] md:p-8 ${
        open ? "translate-y-0 opacity-100 md:translate-x-0" : "pointer-events-none translate-y-8 opacity-0 md:translate-x-8 md:translate-y-0"
      }`}
    >
      {section && (
        <div key={section} className="animate-fade-in space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-3xl font-bold text-ink">
              <span className="bg-[linear-gradient(transparent_60%,var(--color-sunny)_60%)] px-1">{sectionTitles[section]}</span>
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Quay lại lớp học"
              className="rounded-full px-3 py-1 text-sm font-bold text-ink/60 transition hover:bg-blush/40 hover:text-ink"
            >
              ✕ Đóng
            </button>
          </div>
          <SectionContent id={section} />
        </div>
      )}
    </aside>
  );
}
