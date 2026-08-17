import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import WorkGallery from "@/components/WorkGallery";
import { apps, domains } from "@/content/apps";
import { site, services, skills, testimonials } from "@/content/site";

function Section({
  id,
  eyebrow,
  title,
  lede,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
        <h2 className="display mt-3 text-3xl font-bold sm:text-5xl">{title}</h2>
        {lede && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            {lede}
          </p>
        )}
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

export default function Home() {
  const { links } = site;

  return (
    <>
      <Nav />

      <main id="top">
        <Hero />

        {/* ─────────────────────────── Work ─────────────────────────── */}
        <div className="relative">
          <div className="aurora opacity-60" />
          <div className="relative">
            <Section
              id="work"
              eyebrow="Selected work"
              title="Shipped, in the store, in use."
              lede={`${apps.length} apps live on Google Play across ${domains.length} industries. Every one is publicly downloadable — not a prototype, not a concept. Pick any of them to see the screenshots, the stack, and what I actually built.`}
            >
              <WorkGallery apps={apps} />
            </Section>
          </div>
        </div>

        {/* ───────────────────────── Services ───────────────────────── */}
        <Section
          id="services"
          eyebrow="Services"
          title="How I can help."
          lede="Most engagements fall into one of four shapes. If yours doesn't, tell me about it anyway."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {services.map((s, i) => (
              <div
                key={s.title}
                className="glass group relative overflow-hidden rounded-2xl p-7 transition-transform hover:-translate-y-1"
              >
                <div className="grad-ring absolute inset-x-0 top-0 h-[2px] opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="grad-text font-mono text-sm font-bold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ────────────────────────── About ─────────────────────────── */}
        <Section id="about" eyebrow="About" title={`A bit about me.`}>
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
            <div className="space-y-5 text-lg leading-relaxed text-muted">
              {/* ← EDIT: replace with your own story. */}
              <p>
                I&apos;m a React Native developer based in {site.location}. I
                build cross-platform mobile apps and take them all the way to the
                store — architecture, delivery, submission, and the unglamorous
                parts in between.
              </p>
              <p>
                My work spans HR platforms serving workforces of ten thousand
                plus, Open edX learning apps, WhatsApp marketing tools, an
                ordering app for an eighty-year-old bakery brand, and a mental
                performance system for competitive athletes. Different
                industries, same discipline: ship something people actually open
                twice.
              </p>
              <p>
                If you have an app to build, inherit, or rescue —{" "}
                <a
                  href="#contact"
                  className="grad-text font-semibold underline underline-offset-4"
                >
                  let&apos;s talk
                </a>
                .
              </p>
            </div>

            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-faint">
                Toolkit
              </h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {skills.map((s) => (
                  <li
                    key={s}
                    className="glass rounded-full px-3.5 py-1.5 text-sm"
                  >
                    {s}
                  </li>
                ))}
              </ul>

              {links.resume && (
                <a
                  href={links.resume}
                  className="grad-text mt-7 inline-flex items-center gap-2 text-sm font-semibold"
                >
                  Download résumé ↓
                </a>
              )}
            </div>
          </div>
        </Section>

        {/* ─────────────────────── Testimonials ─────────────────────── */}
        {testimonials.length > 0 && (
          <Section eyebrow="Testimonials" title="What clients say.">
            <div className="grid gap-5 sm:grid-cols-2">
              {testimonials.map((t) => (
                <figure key={t.name} className="glass rounded-2xl p-7">
                  <blockquote className="text-lg leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 text-sm">
                    <span className="font-semibold">{t.name}</span>
                    <span className="text-muted"> — {t.title}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </Section>
        )}

        {/* ───────────────────────── Contact ────────────────────────── */}
        <section id="contact" className="relative scroll-mt-20 overflow-hidden">
          <div className="aurora" />
          <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
            <div className="glass rounded-3xl p-9 text-center shadow-[var(--shadow-lg)] sm:p-16">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                Contact
              </p>
              <h2 className="display mx-auto mt-4 max-w-2xl text-3xl font-bold sm:text-5xl">
                Got an app that needs{" "}
                <span className="grad-text">building?</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
                Tell me what you&apos;re working on and roughly when you need it
                live. I&apos;ll come back with an honest answer on scope,
                timeline, and whether I&apos;m the right fit.
              </p>

              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <a
                  href={`mailto:${site.email}`}
                  className="grad-btn rounded-full px-7 py-3.5 font-semibold"
                >
                  {site.email}
                </a>
                {site.phone && (
                  <a
                    href={`tel:${site.phone.replace(/\s/g, "")}`}
                    className="rounded-full border border-line-strong bg-bg-elev px-7 py-3.5 font-semibold transition-colors hover:border-accent"
                  >
                    {site.phone}
                  </a>
                )}
                {links.booking && (
                  <a
                    href={links.booking}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-line-strong bg-bg-elev px-7 py-3.5 font-semibold transition-colors hover:border-accent"
                  >
                    Book a call
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ───────────────────────── Footer ──────────────────────────── */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-9 text-sm text-muted sm:px-8">
          <p>
            © {new Date().getFullYear()} {site.name}. Built with React &amp;
            Next.js.
          </p>
          <ul className="flex flex-wrap gap-5">
            {links.github && (
              <li>
                <a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-text"
                >
                  GitHub
                </a>
              </li>
            )}
            {links.linkedin && (
              <li>
                <a
                  href={links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-text"
                >
                  LinkedIn
                </a>
              </li>
            )}
            {links.x && (
              <li>
                <a
                  href={links.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-text"
                >
                  X
                </a>
              </li>
            )}
            <li>
              <a
                href={`mailto:${site.email}`}
                className="transition-colors hover:text-text"
              >
                Email
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
}
