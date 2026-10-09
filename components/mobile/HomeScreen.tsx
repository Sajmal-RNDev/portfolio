"use client";

import { apps, domains } from "@/content/apps";
import { site } from "@/content/site";
import Icon from "@/components/Icon";
import ThemeToggle from "@/components/ThemeToggle";

export default function HomeScreen({ onNavigate, onOpenProject, onReplay }: {
  onNavigate: (tab: "work" | "about" | "contact") => void;
  onOpenProject: (slug: string) => void;
  onReplay: () => void;
}) {
  const featured = apps.find(app => app.slug === "officekit");

  return (
    <div className="mh-screen">
      <div className="mh-topbar"><span className="mh-wordmark">{site.name.toLowerCase()}<span>.</span></span><div className="mh-topbar-actions"><button type="button" className="icon-button replay-intro" onClick={onReplay} aria-label="Replay intro" title="Replay intro"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 10a9 9 0 1 1 1.5 7M3 4v6h6" /><path d="m10 8 6 4-6 4Z" strokeWidth="1.3" /></svg></button><ThemeToggle /></div></div>
      <div className="mh-intro">
        <p className="eyebrow"><span className="status-dot" /> SENIOR MOBILE DEVELOPER</p>
        <h1 data-screen-title tabIndex={-1}>A mobile mind.<br /><span>A maker at heart.</span></h1>
        <p>A look inside what I do, what I build,<br />and the person behind it all.</p>
      </div>

      <button className="mh-profile" onClick={() => onNavigate("about")} type="button" aria-label={`Meet ${site.name}, ${site.role}`}>
        <div className="mh-profile-copy"><span className="mh-profile-hello">HEY, I’M</span><strong>{site.name}</strong><span className="mh-profile-role">{site.role}</span><span className="mh-profile-location"><Icon name="globe" width="12" height="12" /> {site.location}</span></div>
        <img src="/portrait.webp" width="180" height="210" alt="" className="mh-portrait" />
      </button>

      <div className="mh-quick-stats" aria-label="Experience at a glance"><div><strong>{String(apps.length).padStart(2, "0")}</strong><span>apps shipped</span></div><div><strong>{String(domains.length).padStart(2, "0")}</strong><span>industries</span></div><div><Icon name="code" width="27" height="27" /><span>React Native</span></div></div>

      <div className="mh-section-line"><h2 className="section-label">THE COLLECTION</h2><button type="button" className="small-link" onClick={() => onNavigate("work")}>See all <Icon name="arrow-right" width="14" height="14" /></button></div>
      <div className="mh-launcher" role="group" aria-label="Open a project">
        {apps.map(app => <button key={app.slug} type="button" onClick={() => onOpenProject(app.slug)} aria-label={`Open ${app.name} project`}><img src={`/apps/${app.slug}/icon.webp`} alt="" width="54" height="54" /><span>{app.name === "Blend-ed Cloud" ? "Blend-ed" : app.name === "Al Dhikr Academy" ? "Al Dhikr" : app.name}</span></button>)}
      </div>
      <p className="mh-tap-hint">A few ideas that made it onto home screens.</p>

      {featured && <button type="button" className="mh-feature" onClick={() => onOpenProject(featured.slug)} aria-label={`Explore featured project ${featured.name}`}><div className="mh-feature-top"><span className="eyebrow">IN THE SPOTLIGHT</span><Icon name="arrow-up-right" width="20" height="20" /></div><strong>Less paperwork.<br />More possibilities.</strong><span>OfficeKit · HR, made mobile.</span><div className="mh-feature-art" aria-hidden="true"><img src={`/apps/${featured.slug}/2.webp`} alt="" width="160" height="320" loading="lazy" /><img src={`/apps/${featured.slug}/3.webp`} alt="" width="160" height="320" loading="lazy" /></div></button>}

      <button type="button" className="mh-contact-card" onClick={() => onNavigate("contact")}><span className="mh-contact-icon"><Icon name="mail" width="21" height="21" /></span><span><strong>Have something in mind?</strong><small>{site.available ? "I’m open for new projects. Let’s talk." : "Let’s start a conversation."}</small></span><Icon name="arrow-up-right" width="18" height="18" /></button>
      <p className="mh-signoff">Thoughtfully built. Right down to the last tap.</p>
    </div>
  );
}
