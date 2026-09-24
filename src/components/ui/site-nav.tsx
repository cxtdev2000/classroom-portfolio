"use client";

import { profile, sectionTitles, type SectionId } from "@/content/portfolio";

const navItems = (Object.keys(sectionTitles) as SectionId[]).map((id) => ({ id, label: sectionTitles[id] }));

type SiteNavProps = {
  visible: boolean;
  active: SectionId | null;
  onSelect: (id: SectionId) => void;
  onHome: () => void;
};

/** Top bar: classroom name returns to overview, links jump straight to a section. */
export function SiteNav({ visible, active, onSelect, onHome }: SiteNavProps) {
  return (
    <header
      className={`fixed inset-x-0 top-0 z-20 flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition-opacity delay-700 duration-700 md:px-8 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <button type="button" onClick={onHome} className="text-left">
        <span className="block font-display text-xl font-bold text-ink md:text-2xl">{profile.classroomName}</span>
        <span className="block text-xs font-semibold tracking-wide text-ink/60">
          {profile.name} · {profile.role}
        </span>
      </button>
      <nav className="flex gap-1 rounded-full border-2 border-white bg-paper/80 p-1 shadow-sm backdrop-blur">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            aria-current={active === item.id ? "page" : undefined}
            className={`whitespace-nowrap rounded-full px-2.5 py-1.5 text-[13px] sm:px-3 sm:text-sm font-bold transition md:px-4 ${
              active === item.id ? "bg-berry text-paper" : "text-ink/70 hover:bg-blush/40 hover:text-ink"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
