"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { site } from "@/content/site";
import "./personal.css";

const projectTypes = ["A new app", "An existing app", "A collaboration"];

export default function ContactScreen() {
  const [projectType, setProjectType] = useState(projectTypes[0]);
  const [message, setMessage] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const socials = [
    { name: "GitHub", href: site.links.github },
    { name: "LinkedIn", href: site.links.linkedin },
    { name: "X / Twitter", href: site.links.x },
    { name: "Résumé", href: site.links.resume },
  ].filter(link => link.href);
  const subject = `Let’s talk: ${projectType.toLowerCase()}`;
  const body = `Hi ${site.name},\n\nI’d like to talk about ${projectType.toLowerCase()}.\n\n${message.trim()}\n\nThanks,\n`;
  const draftLink = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  async function copyEmail() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(site.email);
      setCopyStatus("Email address copied.");
    } catch {
      setCopyStatus("Couldn’t copy automatically. Select the email address to copy it.");
    }
  }

  return (
    <div className="mc-screen">
      <header className="mc-heading"><p className="eyebrow">A GOOD PLACE TO START</p><h1 className="screen-heading" data-screen-title tabIndex={-1}>Let’s make<br />something good.</h1><p>Have an idea, a challenge, or a hello?<br />I’d love to hear it.</p></header>

      <section className="mc-person" aria-label={`${site.name}'s contact details`}>
        <div className="mc-person-top"><div className="mc-avatar"><img src="/portrait.webp" alt={site.name} width="72" height="72" /><span className={site.available ? "mc-available" : "mc-unavailable"} /></div><div><h2>{site.name}</h2><p>{site.role}</p><span>{site.location}</span></div></div>
        <div className="mc-availability"><span className={site.available ? "mc-available" : "mc-unavailable"} /><span>{site.available ? site.availabilityText : "Let’s stay in touch"}</span></div>
        <div className="mc-quick-actions">
          <a href={`mailto:${site.email}`}><span><Icon name="mail" width="20" height="20" /></span>Email</a>
          {site.phone && <a href={`tel:${site.phone.replace(/\s/g, "")}`}><span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m7 3 3 5-2 3c1.4 2.6 2.9 4.1 5.5 5.5l3-2 4.5 3v2c0 1.1-.9 2-2 2C9.6 21 3 14.4 3 5c0-1.1.9-2 2-2h2Z" /></svg></span>Call</a>}
          {site.links.booking && <a href={site.links.booking} target="_blank" rel="noopener noreferrer"><span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M7 3v4m10-4v4M3 11h18m-13 5h1m6 0h1" /></svg></span>Book a call</a>}
        </div>
      </section>

      <section className="mc-composer" aria-labelledby="mc-composer-title">
        <div className="mc-composer-title"><span className="mc-compose-icon"><Icon name="mail" width="19" height="19" /></span><h2 id="mc-composer-title">Start a conversation</h2></div>
        <div className="mc-recipient"><span>To</span><span>{site.name} <small>&lt;{site.email}&gt;</small></span></div>
        <fieldset className="mc-project-type"><legend>I’m thinking about…</legend><div>{projectTypes.map(type => <button key={type} type="button" aria-pressed={projectType === type} onClick={() => setProjectType(type)}>{type === projectType && <Icon name="check" width="13" height="13" />}{type}</button>)}</div></fieldset>
        <label className="mc-message-label" htmlFor="mc-message">A little about your idea <span>(optional)</span></label>
        <textarea id="mc-message" value={message} onChange={event => setMessage(event.target.value)} placeholder="What are you working on? Tell me a little about it…" rows={4} maxLength={3000} />
        <a className="app-button mc-draft-button" href={draftLink}>Open email draft <Icon name="arrow-up-right" width="18" height="18" /></a>
        <p className="mc-composer-note">Opens in your email app. You can review it before sending.</p>
      </section>

      <div className="mc-direct"><div><span className="mc-direct-label">Or, keep it simple</span><a href={`mailto:${site.email}`}>{site.email}</a></div><button onClick={copyEmail} aria-label="Copy email address" title="Copy email address"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></svg></button></div>
      <p className="mc-copy-status" role="status" aria-live="polite">{copyStatus}</p>
      {socials.length > 0 && <nav className="mc-socials" aria-label="Find me elsewhere">{socials.map(link => <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer">{link.name}<Icon name="arrow-up-right" width="14" height="14" /></a>)}</nav>}
      <p className="mc-signoff">Made for small screens.<br /><span>And the people on the other side.</span></p>
    </div>
  );
}
