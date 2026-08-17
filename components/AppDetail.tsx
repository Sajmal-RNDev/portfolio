"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { App } from "@/content/apps";
import Screenshot from "./Screenshot";

function PlayIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M3.6 1.8a1.5 1.5 0 0 0-.5 1.15v18.1a1.5 1.5 0 0 0 .5 1.15l.06.06L13.8 12.1v-.24L3.66 1.74l-.06.06zM17.2 15.5l-3.38-3.38v-.24L17.2 8.5l.08.05 4 2.28c1.15.65 1.15 1.72 0 2.38l-4 2.28-.08.05z" />
      <path d="M17.28 15.45 13.8 11.98 3.6 22.2c.38.4 1 .45 1.7.05l11.98-6.8M17.28 8.55 5.3 1.76c-.7-.4-1.32-.36-1.7.05l10.2 10.17 3.48-3.43z" />
    </svg>
  );
}

function Arrow({ back = false }: { back?: boolean }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={back ? "rotate-180" : undefined}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

const EXIT_MS = 400; // safety net if animationend never lands

type Props = {
  app: App | null;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

/**
 * Detail view for one app: a bottom sheet on mobile, a centred panel on
 * desktop. Built on <dialog> so focus trapping, Esc and background inerting
 * come from the platform; the animations are ours.
 *
 * Closing is deferred — `onClose` fires only once the exit animation has
 * finished, so `app` stays populated long enough to animate out.
 */
export default function AppDetail({
  app,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [closing, setClosing] = useState(false);

  const finishClose = useCallback(() => {
    setClosing(false);
    ref.current?.close();
    document.documentElement.classList.remove("sheet-open");
    onClose();
  }, [onClose]);

  const requestClose = useCallback(() => {
    if (!ref.current?.open) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishClose();
      return;
    }
    setClosing(true);
  }, [finishClose]);

  /* open when an app is selected */
  useEffect(() => {
    const el = ref.current;
    if (!el || !app || el.open) return;
    setClosing(false);
    el.showModal();
    document.documentElement.classList.add("sheet-open");
  }, [app]);

  /* Esc — take it over so the exit animation gets to play */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onCancel = (e: Event) => {
      e.preventDefault();
      requestClose();
    };
    el.addEventListener("cancel", onCancel);
    return () => el.removeEventListener("cancel", onCancel);
  }, [requestClose]);

  /* ← → step through the set without leaving the sheet */
  useEffect(() => {
    if (!app || closing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        onNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrev();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [app, closing, onNext, onPrev]);

  useEffect(() => {
    if (!closing) return;
    const t = setTimeout(finishClose, EXIT_MS);
    return () => clearTimeout(t);
  }, [closing, finishClose]);

  /* never leave the page scroll-locked behind us */
  useEffect(
    () => () => document.documentElement.classList.remove("sheet-open"),
    [],
  );

  const shots = app
    ? Array.from({ length: app.screenshots }, (_, i) => i + 1)
    : [];

  return (
    <dialog
      ref={ref}
      aria-labelledby="sheet-title"
      className={`sheet ${closing ? "closing" : ""}`}
      onClick={(e) => {
        if (e.target === ref.current) requestClose();
      }}
    >
      {app && (
        <div
          /* focus starts at the top of the content, not on the close button */
          autoFocus
          tabIndex={-1}
          className="sheet-panel glass"
          onAnimationEnd={(e) => {
            if (e.target === e.currentTarget && closing) finishClose();
          }}
        >
          {/* ── header: stays put while the body scrolls ── */}
          <div className="sticky top-0 z-10 flex items-start gap-4 border-b border-line bg-bg-elev/95 px-6 py-5 backdrop-blur-xl sm:px-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/apps/${app.slug}/icon.webp`}
              alt=""
              width={52}
              height={52}
              className="h-13 w-13 shrink-0 rounded-[14px] border border-line"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3
                  id="sheet-title"
                  className="text-xl font-semibold tracking-tight sm:text-2xl"
                >
                  {app.name}
                </h3>
                <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                  {app.domain}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">{app.tagline}</p>
            </div>
            <button
              type="button"
              onClick={requestClose}
              aria-label="Close details"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-bg-sunk text-muted transition-colors hover:border-line-strong hover:text-text"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ── body: re-keyed per app so the reveal replays on ← → ── */}
          <div key={app.slug} className="pop">
            <dl className="flex flex-wrap gap-x-8 gap-y-3 px-6 py-5 text-sm sm:px-8">
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
                  <dd className="mt-0.5 font-medium text-success">
                    {app.metric}
                  </dd>
                </div>
              )}
            </dl>

            <div className="grid gap-8 border-t border-line px-6 py-7 sm:px-8 lg:grid-cols-[1.35fr_1fr]">
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
                      aria-hidden="true"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-2 px-6 pb-7 sm:px-8">
              {app.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-line bg-bg-sunk px-3 py-1 font-mono text-xs text-muted"
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="rail overflow-x-auto border-t border-line bg-bg-sunk/60 px-6 py-8 sm:px-8">
              <div className="flex gap-5">
                {shots.map((n, i) => (
                  <Screenshot
                    key={n}
                    src={`/apps/${app.slug}/${n}.webp`}
                    alt={`${app.name} screenshot ${n}`}
                    priority={i < 2}
                    className="shot-in h-[340px] sm:h-[420px]"
                    style={{ animationDelay: `${0.24 + i * 0.07}s` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── footer: store link + move through the set ── */}
          <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-line bg-bg-elev/95 px-6 py-4 backdrop-blur-xl sm:px-8">
            <a
              href={app.storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="grad-btn inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
            >
              <PlayIcon />
              View on Google Play
            </a>

            <div className="flex items-center gap-2">
              <span className="mr-1 font-mono text-xs text-faint">
                {index + 1} / {total}
              </span>
              <button
                type="button"
                onClick={onPrev}
                aria-label="Previous app"
                className="grid h-9 w-9 place-items-center rounded-full border border-line bg-bg-sunk text-muted transition-colors hover:border-accent hover:text-text"
              >
                <Arrow back />
              </button>
              <button
                type="button"
                onClick={onNext}
                aria-label="Next app"
                className="grid h-9 w-9 place-items-center rounded-full border border-line bg-bg-sunk text-muted transition-colors hover:border-accent hover:text-text"
              >
                <Arrow />
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
