"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { App } from "@/content/apps";
import "./work.css";

export default function ProjectScreen({ app, onBack }: { app: App; onBack: () => void }) {
  const gallery = useRef<HTMLDivElement>(null);
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const screenshotHeight = app.slug === "officekit" ? 1270 : app.slug === "al-dhikr" ? 1274 : app.slug === "school-plus" ? 1090 : 1102;

  function goToScreenshot(index: number) {
    const rail = gallery.current;
    const item = rail?.children[index] as HTMLElement | undefined;
    if (!rail || !item) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollTo({ left: item.offsetLeft - (rail.children[0] as HTMLElement).offsetLeft, behavior: reduceMotion ? "instant" : "smooth" });
  }

  function updateActiveScreenshot() {
    const rail = gallery.current;
    if (!rail) return;
    const first = rail.children[0] as HTMLElement;
    const next = rail.children[1] as HTMLElement | undefined;
    if (!first || !next) return;
    setActiveScreenshot(Math.max(0, Math.min(app.screenshots - 1, Math.round(rail.scrollLeft / (next.offsetLeft - first.offsetLeft)))));
  }

  return (
    <article className="mp-screen">
      <header className="mp-topbar">
        <button type="button" className="mp-back" onClick={onBack} aria-label="Go back"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m14 5-7 7 7 7" /></svg>Back</button>
        <span>PROJECT NOTES</span>
        <a href={app.storeUrl} target="_blank" rel="noreferrer" className="mp-external" aria-label={`Open ${app.name} on Google Play in a new tab`}>↗</a>
      </header>

      <div className="mp-content">
        <div className="mp-identity">
          <Image src={`/apps/${app.slug}/icon.webp`} alt="" width={82} height={82} priority className="mp-icon" />
          <span className="mp-domain">{app.domain}</span>
          <h1 data-screen-title tabIndex={-1}>{app.name}</h1>
          <p>{app.tagline}</p>
        </div>
        <dl className="mp-stats">
          <div><dt>GOOGLE PLAY</dt><dd>{app.installs}</dd><small>installs</small></div>
          <div><dt>MY ROLE</dt><dd>{app.role.replace(" Developer", "")}</dd><small>{app.role.includes("Developer") ? "Developer" : "Project role"}</small></div>
        </dl>
        <div className="mp-client"><span>BUILT FOR</span><strong>{app.client}</strong></div>

        <section className="mp-preview-section" aria-labelledby="mp-preview-heading">
          <div className="mp-section-top"><h2 className="section-label" id="mp-preview-heading">Inside the app</h2><span>{activeScreenshot + 1} / {app.screenshots}</span></div>
          <div className="mp-screenshots" ref={gallery} onScroll={updateActiveScreenshot} role="region" aria-label={`${app.name} screenshots`} tabIndex={0}>
            {Array.from({ length: app.screenshots }, (_, index) => (
              <figure className="mp-shot" key={`${app.slug}-${index}`}>
                <Image src={`/apps/${app.slug}/${index + 1}.webp`} alt={`${app.name} product screenshot ${index + 1} of ${app.screenshots}`} width={620} height={screenshotHeight} sizes="250px" draggable={false} />
              </figure>
            ))}
          </div>
          <div className="mp-gallery-controls">
            <button type="button" onClick={() => goToScreenshot(activeScreenshot - 1)} disabled={activeScreenshot === 0} aria-label="Previous screenshot">←</button>
            <span className="mp-gallery-position" aria-hidden="true">{activeScreenshot + 1} / {app.screenshots}</span>
            <div className="mp-gallery-dots" aria-label="Choose a screenshot">
              {Array.from({ length: app.screenshots }, (_, index) => <button type="button" key={index} onClick={() => goToScreenshot(index)} aria-label={`Show screenshot ${index + 1}`} aria-current={activeScreenshot === index ? "true" : undefined}><span /></button>)}
            </div>
            <button type="button" onClick={() => goToScreenshot(activeScreenshot + 1)} disabled={activeScreenshot === app.screenshots - 1} aria-label="Next screenshot">→</button>
          </div>
        </section>

        <section className="mp-summary" aria-labelledby="mp-summary-heading"><p className="eyebrow">THE THINKING BEHIND IT</p><h2 id="mp-summary-heading">A little about this app.</h2><p>{app.summary}</p></section>
        <section className="mp-highlights" aria-labelledby="mp-highlights-heading"><h2 className="section-label" id="mp-highlights-heading">What it does</h2><ul>{app.highlights.map((highlight, index) => <li key={highlight}><span>{String(index + 1).padStart(2, "0")}</span><p>{highlight}</p></li>)}</ul></section>
        <section className="mp-stack" aria-labelledby="mp-stack-heading"><h2 className="section-label" id="mp-stack-heading">Built with</h2><div>{app.stack.map((tech) => <span key={tech}>{tech}</span>)}</div></section>
        <a className="app-button mp-store" href={app.storeUrl} target="_blank" rel="noreferrer"><svg width="19" height="20" viewBox="0 0 22 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true"><path d="M2 2v20l18-10L2 2Z" /><path d="m2 2 12 14M2 22 14 8" /></svg>View on Google Play<span aria-hidden="true">↗</span></a>
        <p className="mp-store-note">Explore the published app · opens a new tab</p>
      </div>
    </article>
  );
}
