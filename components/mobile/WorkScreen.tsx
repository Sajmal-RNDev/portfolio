"use client";

import Image from "next/image";
import { useState } from "react";
import { apps, type App } from "@/content/apps";
import "./work.css";

const filters = ["All", "HR", "EdTech", "More"] as const;
type Filter = (typeof filters)[number];

function matchesFilter(app: App, filter: Filter) {
  if (filter === "All") return true;
  if (filter === "HR") return app.domain === "HR & Workforce";
  if (filter === "EdTech") return app.domain === "EdTech";
  return !["HR & Workforce", "EdTech"].includes(app.domain);
}

export default function WorkScreen({ onOpenProject }: { onOpenProject: (slug: string) => void }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const search = query.trim().toLowerCase();
  const visibleApps = apps.filter((app) => matchesFilter(app, filter) && `${app.name} ${app.client} ${app.domain}`.toLowerCase().includes(search));
  const spotlight = apps.find((app) => app.slug === "officekit");

  return (
    <div className="mw-screen">
      <header className="mw-header">
        <p className="eyebrow">THE APPS</p>
        <h1 className="screen-heading" data-screen-title tabIndex={-1}>Made. Shipped.<br /><span>Used.</span></h1>
        <p className="mw-intro">Real products. Everyday impact.<br />A few things I&apos;ve put into people&apos;s hands.</p>
      </header>

      <div className="mw-search">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4.5 4.5" strokeLinecap="round" /></svg>
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find an app, client or industry" aria-label="Search apps by name, client or industry" autoComplete="off" />
        {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search">×</button>}
      </div>
      <div className="mw-filters" role="group" aria-label="Filter apps by industry">
        {filters.map((item) => <button type="button" key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}{item === "All" && <span>{apps.length}</span>}</button>)}
      </div>

      {spotlight && filter === "All" && !search && (
        <button className="mw-spotlight" type="button" onClick={() => onOpenProject(spotlight.slug)} aria-label={`Explore ${spotlight.name}, featured project`}>
          <div className="mw-spotlight-copy">
            <span className="mw-spotlight-label"><span /> IN THE SPOTLIGHT</span>
            <strong>Work life.<br />Simplified.</strong>
            <span className="mw-spotlight-subtitle">HR that goes wherever you do.</span>
          </div>
          <div className="mw-spotlight-art" aria-hidden="true">
            <div className="mw-spotlight-orbit" />
            <Image src={`/apps/${spotlight.slug}/3.webp`} width={620} height={1270} alt="" sizes="180px" className="mw-spotlight-image mw-spotlight-image-back" />
            <Image src={`/apps/${spotlight.slug}/2.webp`} width={620} height={1270} alt="" sizes="180px" className="mw-spotlight-image mw-spotlight-image-front" />
          </div>
          <div className="mw-spotlight-footer">
            <Image src={`/apps/${spotlight.slug}/icon.webp`} width={42} height={42} alt="" />
            <span><strong>{spotlight.name}</strong><small>{spotlight.installs} Google Play installs</small></span>
            <span className="mw-spotlight-open" aria-hidden="true">↗</span>
          </div>
        </button>
      )}

      <section className="mw-collection" aria-labelledby="mw-collection-title">
        <div className="mw-collection-heading">
          <h2 className="section-label" id="mw-collection-title">{search ? "Search results" : filter === "All" ? "The collection" : filter === "More" ? "More industries" : `${filter} apps`}</h2>
          <span aria-live="polite">{visibleApps.length} {visibleApps.length === 1 ? "app" : "apps"}</span>
        </div>
        {visibleApps.length > 0 ? (
          <ul className="mw-app-list">
            {visibleApps.map((app) => (
              <li key={app.slug}>
                <button type="button" className="mw-app-row" onClick={() => onOpenProject(app.slug)} aria-label={`Explore ${app.name}, ${app.domain}`}>
                  <Image src={`/apps/${app.slug}/icon.webp`} width={54} height={54} alt="" className="mw-app-icon" />
                  <span className="mw-app-text"><strong>{app.name}</strong><span>{app.domain}</span><small>{app.installs} installs</small></span>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mw-empty"><span aria-hidden="true">⌕</span><h3>No apps found</h3><p>Try another name or explore all nine apps.</p><button type="button" onClick={() => { setFilter("All"); setQuery(""); }}>Show all apps</button></div>
        )}
        <p className="mw-footnote">Install counts are published Google Play bands.</p>
      </section>
    </div>
  );
}
