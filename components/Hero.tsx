"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

const ROLES = [
  "React Native Developer",
  "Mobile App Engineer",
  "Cross-Platform Specialist",
  "Ship-It Kind of Builder",
];

/** Colour-coded stack chips, mirroring the reference design. */
const CHIPS = [
  { label: "React Native", color: "#61dafb" },
  { label: "TypeScript", color: "#3b82f6" },
  { label: "Expo", color: "#a78bfa" },
  { label: "iOS", color: "#f472b6" },
  { label: "Android", color: "#34d399" },
  { label: "Redux", color: "#c084fc" },
];

function useTypewriter(words: string[]) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index % words.length];
    const done = !deleting && text === word;
    const cleared = deleting && text === "";

    if (done) {
      const t = setTimeout(() => setDeleting(true), 1800);
      return () => clearTimeout(t);
    }
    if (cleared) {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      return;
    }

    const t = setTimeout(
      () =>
        setText((prev) =>
          deleting ? word.slice(0, prev.length - 1) : word.slice(0, prev.length + 1)
        ),
      deleting ? 40 : 85
    );
    return () => clearTimeout(t);
  }, [text, deleting, index, words]);

  return text;
}

function Social({ href, label, d }: { href: string; label: string; d: string }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full border border-line bg-bg-elev text-muted transition-all hover:-translate-y-0.5 hover:border-accent hover:text-text"
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d={d} />
      </svg>
    </a>
  );
}

const ICONS = {
  github:
    "M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z",
  linkedin:
    "M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6h.1a3.8 3.8 0 0 1 3.4-1.9c3.6 0 4.3 2.4 4.3 5.5v6.3zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zm1.8 13.1H3.5V9h3.6v11.5zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 1 .8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7c0-.9-.8-1.7-1.8-1.7z",
  x: "M18.9 1.2h3.7l-8 9.2 9.4 12.4h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.9L0 1.2h7.6l5.2 6.9zm-1.3 19.4h2L6.5 3.2H4.3z",
  mail: "M2 5.5A2.5 2.5 0 0 1 4.5 3h15A2.5 2.5 0 0 1 22 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 18.5zm2.6-.5 7.4 5.9L19.4 5z",
};

export default function Hero() {
  const typed = useTypewriter(ROLES);
  const { links } = site;

  return (
    <section className="relative">
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pb-24 pt-14 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-10 lg:pb-32 lg:pt-20">
        {/* ── left column ── */}
        <div>
          {site.available && (
            <div className="rise inline-flex items-center gap-2.5 rounded-full border border-line bg-bg-elev/80 px-4 py-2 text-sm backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              <span className="font-medium">{site.availabilityText}</span>
            </div>
          )}

          <p
            className="rise mt-8 text-2xl font-medium text-faint sm:text-3xl"
            style={{ animationDelay: "60ms" }}
          >
            Hey there! I&apos;m
          </p>

          <h1
            className="display grad-text rise mt-1 text-5xl font-bold sm:text-7xl"
            style={{ animationDelay: "110ms" }}
          >
            {site.name}
          </h1>

          <p
            className="rise mt-5 text-2xl font-semibold sm:text-3xl"
            style={{ animationDelay: "160ms" }}
          >
            I&apos;m a{" "}
            <span className="grad-text">{typed}</span>
            <span className="caret ml-0.5 font-normal text-accent">|</span>
          </p>

          <p
            className="rise mt-6 max-w-xl text-lg leading-relaxed text-muted"
            style={{ animationDelay: "210ms" }}
          >
            {site.subhead}
          </p>

          {/* stack chips */}
          <ul
            className="rise mt-8 flex flex-wrap gap-2.5"
            style={{ animationDelay: "260ms" }}
          >
            {CHIPS.map((c) => (
              <li
                key={c.label}
                className="chip rounded-full border px-4 py-1.5 text-sm font-medium"
                style={{ ["--chip" as string]: c.color }}
              >
                {c.label}
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div
            className="rise mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "310ms" }}
          >
            <a
              href="#work"
              className="grad-btn inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold"
            >
              View My Work
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a
              href={links.booking || `mailto:${site.email}`}
              target={links.booking ? "_blank" : undefined}
              rel={links.booking ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-bg-elev px-7 py-3.5 font-semibold transition-colors hover:border-accent"
            >
              Let&apos;s Talk
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.4 8.4 0 0 1-3.8-.9L3 20.5l1.5-5.2a8.4 8.4 0 0 1-.9-3.8 8.4 8.4 0 0 1 8.4-9 8.4 8.4 0 0 1 9 9z" />
              </svg>
            </a>
          </div>

          {/* socials */}
          <div
            className="rise mt-9 flex items-center gap-3"
            style={{ animationDelay: "360ms" }}
          >
            <span className="text-sm text-faint">Follow me:</span>
            {links.github && (
              <Social href={links.github} label="GitHub" d={ICONS.github} />
            )}
            {links.linkedin && (
              <Social href={links.linkedin} label="LinkedIn" d={ICONS.linkedin} />
            )}
            {links.x && <Social href={links.x} label="X" d={ICONS.x} />}
            <Social
              href={`mailto:${site.email}`}
              label="Email"
              d={ICONS.mail}
            />
          </div>
        </div>

        {/* ── right column: avatar + floating cards ── */}
        <div
          className="rise relative mx-auto w-full max-w-[26rem]"
          style={{ animationDelay: "220ms" }}
        >
          <div className="relative aspect-square">
            {/* rotating gradient ring */}
            <div className="grad-ring spin-slow absolute inset-[5%] rounded-full opacity-95" />
            <div
              className="absolute inset-[5%] overflow-hidden rounded-full bg-bg"
              style={{ margin: 11 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/portrait.webp"
                alt={`${site.name}, ${site.role}`}
                width={560}
                height={560}
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
            </div>

            {/* floating code snippet */}
            <div className="floaty-slow glass absolute -right-2 top-2 w-56 rounded-xl p-3 shadow-[var(--shadow-lg)] sm:-right-6">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <pre className="mt-2.5 font-mono text-[11px] leading-relaxed text-muted">
                <code>
                  <span className="text-[#c084fc]">const</span>{" "}
                  <span className="text-[#60a5fa]">dev</span> = {"{"}
                  {"\n"}  name: <span className="text-[#34d399]">&apos;{site.name}&apos;</span>,
                  {"\n"}  stack: <span className="text-[#34d399]">&apos;RN&apos;</span>,
                  {"\n"}  shipped: <span className="text-[#fbbf24]">9</span>,
                  {"\n"}
                  {"}"}
                </code>
              </pre>
            </div>

            {/* floating stat: apps */}
            <div className="floaty glass absolute -left-2 bottom-14 rounded-2xl px-5 py-3.5 text-center shadow-[var(--shadow-lg)] sm:-left-6">
              <div className="grad-text text-3xl font-bold">9</div>
              <div className="text-xs text-muted">Apps shipped</div>
            </div>

            {/* floating stat: installs */}
            <div className="floaty-slow glass absolute -right-1 bottom-2 rounded-2xl px-5 py-3.5 text-center shadow-[var(--shadow-lg)] sm:-right-4">
              <div className="grad-text text-3xl font-bold">30K+</div>
              <div className="text-xs text-muted">Installs</div>
            </div>

            {/* small accent tiles */}
            <div className="floaty absolute left-3 top-8 grid h-11 w-11 place-items-center rounded-xl bg-[#34d399] text-lg shadow-[var(--shadow)]">
              ⚡
            </div>
            <div className="floaty-slow absolute right-10 top-40 grid h-11 w-11 place-items-center rounded-xl bg-[#8b5cf6] text-lg shadow-[var(--shadow)]">
              📱
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
