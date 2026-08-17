import type { App } from "@/content/apps";

/**
 * The compact form of an app — only what's needed to decide whether to
 * look closer. The full write-up lives in AppDetail, opened on select.
 */
export default function AppCard({
  app,
  index,
  onSelect,
}: {
  app: App;
  index: number;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`${app.name} — ${app.tagline}. Open details.`}
      className="glass group relative flex h-full w-full flex-col overflow-hidden rounded-2xl p-5 text-left transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1.5 hover:border-line-strong hover:shadow-[var(--shadow-lg)]"
    >
      {/* gradient hairline, same hover language as the services cards */}
      <span className="grad-ring absolute inset-x-0 top-0 h-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <span className="flex items-start gap-3.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/apps/${app.slug}/icon.webp`}
          alt=""
          width={48}
          height={48}
          loading={index < 3 ? "eager" : "lazy"}
          decoding="async"
          className="h-12 w-12 shrink-0 rounded-xl border border-line transition-transform duration-300 group-hover:scale-[1.06]"
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[17px] font-semibold tracking-tight">
            {app.name}
          </span>
          <span className="mt-1 block text-xs font-medium text-accent">
            {app.domain}
          </span>
        </span>
      </span>

      <span className="mt-4 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">
        {app.tagline}
      </span>

      <span className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3.5 text-xs">
        <span className="text-faint">{app.installs} installs</span>
        <span className="inline-flex items-center gap-1.5 font-semibold text-accent">
          Explore
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </span>
    </button>
  );
}
