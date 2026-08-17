import type { App } from "@/content/apps";
import Screenshot from "./Screenshot";

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.6 1.8a1.5 1.5 0 0 0-.5 1.15v18.1a1.5 1.5 0 0 0 .5 1.15l.06.06L13.8 12.1v-.24L3.66 1.74l-.06.06zM17.2 15.5l-3.38-3.38v-.24L17.2 8.5l.08.05 4 2.28c1.15.65 1.15 1.72 0 2.38l-4 2.28-.08.05z" />
      <path d="M17.28 15.45 13.8 11.98 3.6 22.2c.38.4 1 .45 1.7.05l11.98-6.8M17.28 8.55 5.3 1.76c-.7-.4-1.32-.36-1.7.05l10.2 10.17 3.48-3.43z" />
    </svg>
  );
}

export default function ProjectCard({
  app,
  index,
}: {
  app: App;
  index: number;
}) {
  const shots = Array.from({ length: app.screenshots }, (_, i) => i + 1);

  return (
    <article
      id={app.slug}
      className="glass scroll-mt-24 overflow-hidden rounded-3xl shadow-[var(--shadow)]"
    >
      <div className="p-6 sm:p-9">
        {/* header */}
        <div className="flex flex-wrap items-start gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/apps/${app.slug}/icon.webp`}
            alt={`${app.name} app icon`}
            width={56}
            height={56}
            loading={index < 2 ? "eager" : "lazy"}
            className="h-14 w-14 shrink-0 rounded-[14px] border border-line"
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                {app.name}
              </h3>
              <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                {app.domain}
              </span>
            </div>
            <p className="mt-1 text-muted">{app.tagline}</p>
          </div>

          <a
            href={app.storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-line-strong hover:bg-bg-sunk"
          >
            <PlayIcon />
            Google Play
          </a>
        </div>

        {/* meta strip */}
        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-y border-line py-4 text-sm">
          <div>
            <dt className="text-faint">Client</dt>
            <dd className="mt-0.5 font-medium">{app.client}</dd>
          </div>
          <div>
            <dt className="text-faint">Role</dt>
            <dd className="mt-0.5 font-medium">{app.role}</dd>
          </div>
          <div>
            <dt className="text-faint">Installs</dt>
            <dd className="mt-0.5 font-medium">{app.installs}</dd>
          </div>
          {app.metric && (
            <div>
              <dt className="text-faint">Outcome</dt>
              <dd className="mt-0.5 font-medium text-success">{app.metric}</dd>
            </div>
          )}
        </dl>

        {/* body */}
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.35fr_1fr]">
          <p className="text-[15px] leading-relaxed text-muted">
            {app.summary}
          </p>

          <ul className="space-y-2.5">
            {app.highlights.map((h) => (
              <li key={h} className="flex gap-2.5 text-[15px] leading-snug">
                <svg
                  className="mt-[3px] h-4 w-4 shrink-0 text-accent"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* stack */}
        <ul className="mt-6 flex flex-wrap gap-2">
          {app.stack.map((s) => (
            <li
              key={s}
              className="rounded-full border border-line bg-bg-sunk px-3 py-1 font-mono text-xs text-muted"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* screenshot rail */}
      <div className="rail overflow-x-auto border-t border-line bg-bg-sunk/60 px-6 py-8 sm:px-9">
        <div className="flex gap-5">
          {shots.map((n) => (
            <Screenshot
              key={n}
              src={`/apps/${app.slug}/${n}.webp`}
              alt={`${app.name} screenshot ${n}`}
              priority={index === 0 && n === 1}
              className="h-[360px] sm:h-[440px]"
            />
          ))}
        </div>
      </div>
    </article>
  );
}
