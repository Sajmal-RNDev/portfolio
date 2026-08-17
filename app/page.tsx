import Directory, { type Group } from "@/components/Directory";
import ThemeToggle from "@/components/ThemeToggle";
import { apps } from "@/content/apps";
import { site, services, work } from "@/content/site";

export default function Home() {
  const { links } = site;

  const socials = [
    { label: "email", href: `mailto:${site.email}` },
    site.phone
      ? { label: "phone", href: `tel:${site.phone.replace(/\s/g, "")}` }
      : null,
    links.github ? { label: "github", href: links.github } : null,
    links.linkedin ? { label: "linkedin", href: links.linkedin } : null,
    links.x ? { label: "twitter", href: links.x } : null,
    links.resume ? { label: "résumé", href: links.resume } : null,
  ].filter(Boolean) as { label: string; href: string }[];

  const groups: Group[] = [
    {
      key: "work",
      label: "work (gets paid)",
      rows: work.map((w) => ({
        title: w.title,
        meta: w.meta,
        body: w.body,
        href: w.href || undefined,
      })),
    },
    {
      key: "apps",
      label: "apps (live on google play)",
      rows: apps.map((a) => ({
        title: a.name.toLowerCase(),
        meta: `${a.installs} · ${a.domain.toLowerCase()}`,
        // body keeps its original case, so Open edX / WhatsApp / iOS survive.
        // No trailing stop — clients like "… Pvt. Ltd." already end in one.
        body: `${a.tagline} — built for ${a.client}`,
        href: a.storeUrl,
      })),
    },
    {
      key: "services",
      label: "services (what i take on)",
      rows: services.map((s) => ({
        title: s.title.toLowerCase(),
        body: s.body,
      })),
    },
  ];

  return (
    <main className="mx-auto max-w-2xl px-5 py-16 sm:px-6 sm:py-24">
      <div className="flex items-start justify-between gap-4">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/portrait.webp"
            alt={site.name}
            width={64}
            height={64}
            className="h-16 w-16 rounded-full border border-line object-cover"
          />
          <h1 className="mt-4 text-2xl font-semibold">{site.handle}</h1>
        </div>
        <ThemeToggle />
      </div>

      <hr className="my-6 border-line" />

      <p className="leading-relaxed">{site.intro}</p>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        {site.introSecondary}
      </p>

      <nav className="mt-6 flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target={s.href.startsWith("http") ? "_blank" : undefined}
            rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="text-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            {s.label}
          </a>
        ))}
      </nav>

      <Directory groups={groups} />

      <hr className="my-10 border-line" />

      <p className="font-mono text-xs text-faint">
        built with next.js. {site.location.toLowerCase()}.
      </p>
    </main>
  );
}
