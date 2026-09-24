import { about, activities, contact, experience, type SectionId } from "@/content/portfolio";

const chipColors = ["bg-blush/50", "bg-sky/50", "bg-sunny/60", "bg-mint/60", "bg-lavender/50"];

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="pt-3 font-display text-xl font-bold text-ink">{children}</h3>;
}

/** Renders the HTML body for a classroom section. Content comes from src/content/portfolio.ts. */
export function SectionContent({ id }: { id: SectionId }) {
  if (id === "about") {
    return (
      <>
        {about.paragraphs.map((paragraph) => (
          <p key={paragraph} className="leading-relaxed text-ink/80">
            {paragraph}
          </p>
        ))}
        {about.skillGroups.map((group) => (
          <div key={group.title}>
            <SubHeading>{group.title}</SubHeading>
            <ul className="flex flex-wrap gap-2 pt-2">
              {group.items.map((skill, index) => (
                <li key={skill} className={`rounded-full px-3 py-1 text-sm font-semibold text-ink ${chipColors[index % chipColors.length]}`}>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <SubHeading>{about.educationTitle}</SubHeading>
        <div className="rounded-2xl border-2 border-dashed border-lavender bg-white/70 p-4">
          <p className="font-bold text-ink">{about.education.school}</p>
          <p className="text-sm text-berry">{about.education.degree}</p>
          <ul className="mt-2 space-y-1 text-sm text-ink/75">
            {about.education.notes.map((note) => (
              <li key={note}>✿ {note}</li>
            ))}
          </ul>
        </div>
      </>
    );
  }

  if (id === "experience") {
    return (
      <ol className="space-y-4">
        {experience.map((job, index) => (
          <li key={job.title} className="rounded-2xl border-2 border-white bg-white/70 p-4 shadow-sm">
            <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold text-ink ${chipColors[index % chipColors.length]}`}>
              {job.period}
            </span>
            <h3 className="mt-2 font-display text-lg leading-snug font-bold text-ink">{job.title}</h3>
            <p className="text-sm text-berry">{job.place}</p>
            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-ink/75">
              {job.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-2">
                  <span className="text-berry" aria-hidden>
                    ★
                  </span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    );
  }

  if (id === "activities") {
    return (
      <>
        <p className="leading-relaxed text-ink/80">{activities.intro}</p>
        <ul className="space-y-2">
          {activities.talents.map((talent, index) => (
            <li key={talent} className={`rounded-2xl px-4 py-3 text-sm font-semibold text-ink ${chipColors[index % chipColors.length]}`}>
              {["💃", "🎉", "🎨"][index] ?? "✿"} {talent}
            </li>
          ))}
        </ul>
        <SubHeading>{activities.certificatesTitle}</SubHeading>
        <ul className="space-y-2">
          {activities.certificates.map((certificate) => (
            <li key={certificate} className="flex gap-2 rounded-2xl border-2 border-dashed border-sunny bg-white/70 px-4 py-3 text-sm text-ink/80">
              <span aria-hidden>🏅</span>
              <span>{certificate}</span>
            </li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <>
      <p className="leading-relaxed text-ink/80">{contact.intro}</p>
      <ul className="space-y-3 pt-2">
        {contact.links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="flex items-center justify-between gap-4 rounded-2xl border-2 border-white bg-white/70 px-4 py-3 transition hover:-translate-y-0.5 hover:border-blush"
            >
              <span className="text-sm text-ink/60">{link.label}</span>
              <span className="text-right font-semibold break-all text-ink">{link.value}</span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
