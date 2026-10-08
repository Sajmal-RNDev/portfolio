"use client";

import Icon from "@/components/Icon";
import { services, site, skills } from "@/content/site";
import "./personal.css";

const serviceIcons = ["phone", "layers", "spark", "code"] as const;
const process = [
  { title: "Understand first", text: "The people, the problem, and what a useful first release looks like." },
  { title: "Build with intention", text: "Clear architecture, small iterations, and care in every interaction." },
  { title: "Ship. Learn. Refine.", text: "Store delivery, real-world feedback, and room to keep improving." },
];

export default function AboutScreen({ onContact }: { onContact: () => void }) {
  return (
    <div className="ma-screen">
      <header className="ma-heading">
        <p className="eyebrow">THE PERSON BEHIND THE APPS</p>
        <h1 className="screen-heading" data-screen-title tabIndex={-1}>A little<br />about me.</h1>
      </header>

      <section className="ma-profile" aria-label={`Meet ${site.name}`}>
        <div className="ma-portrait">
          <span className="ma-portrait-orbit" aria-hidden="true" />
          <img src="/portrait.webp" alt={`${site.name}, senior mobile developer`} width="560" height="560" />
          <span className="ma-portrait-wave" aria-hidden="true">✳</span>
          <span className="ma-portrait-label">HELLO, I’M {site.name.toUpperCase()}</span>
        </div>
        <div className="ma-profile-caption">
          <div><strong>{site.name}</strong><span>{site.role}</span></div>
          <span className="ma-location"><Icon name="globe" width="14" height="14" />{site.location}</span>
        </div>
      </section>

      <div className="ma-introduction">
        <h2>A developer’s mind.<br /><span>A product instinct.</span></h2>
        <p>I care as much about how an app feels as how it’s built.</p>
        <p>{site.intro}</p>
        <p>My work spans HR, learning, business messaging, sport and commerce. I like being part of the whole journey: asking the right questions, polishing the details, and getting an app into people’s hands.</p>
      </div>

      <section className="ma-section" aria-labelledby="ma-services-title">
        <div className="ma-section-top"><h2 className="section-label" id="ma-services-title">How I can help</h2><span>Tap to explore</span></div>
        <div className="ma-services">
          {services.map((service, index) => (
            <details className="ma-service" key={service.title}>
              <summary><span className="ma-service-icon"><Icon name={serviceIcons[index % serviceIcons.length]} width="20" height="20" /></span><span>{service.title}</span><Icon className="ma-service-chevron" name="arrow-down" width="15" height="15" /></summary>
              <p>{service.body}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="ma-section" aria-labelledby="ma-skills-title">
        <h2 className="section-label" id="ma-skills-title">My everyday toolbox</h2>
        <div className="ma-skills">{skills.map(skill => <span key={skill}>{skill}</span>)}</div>
      </section>

      <section className="ma-section" aria-labelledby="ma-process-title">
        <h2 className="section-label" id="ma-process-title">The way I work</h2>
        <ol className="ma-process">
          {process.map((step, index) => <li key={step.title}><span className="ma-process-number">0{index + 1}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}
        </ol>
      </section>

      <div className="ma-endnote"><Icon name="spark" width="24" height="24" /><p>Good apps start with<br />a good conversation.</p><button className="app-button ma-contact-button" onClick={onContact}>Let’s talk <Icon name="arrow-up-right" width="18" height="18" /></button></div>
      {site.links.resume && <a className="ma-resume" href={site.links.resume} target="_blank" rel="noopener noreferrer">View my résumé <Icon name="arrow-up-right" width="16" height="16" /></a>}
    </div>
  );
}
