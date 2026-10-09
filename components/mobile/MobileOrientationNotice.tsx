"use client";

import { useEffect, useId, useRef } from "react";
import "./orientation.css";

export default function MobileOrientationNotice({ onAllowFoldable }: { onAllowFoldable: () => void }) {
  const headingId = useId();
  const messageId = useId();
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const previous = document.activeElement;
    heading.current?.focus({ preventScroll: true });
    return () => {
      if (previous instanceof HTMLElement && previous.isConnected && !previous.closest("[inert]")) {
        previous.focus({ preventScroll: true });
      }
    };
  }, []);

  return (
    <section className="orientation-notice" role="region" aria-labelledby={headingId} aria-describedby={messageId}>
      <div className="orientation-card">
        <div className="orientation-illustration" aria-hidden="true">
          <svg viewBox="0 0 112 112" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle className="orientation-orbit" cx="56" cy="56" r="49" />
            <g className="orientation-phone"><rect x="37" y="24" width="38" height="64" rx="9" /><path d="M51 30h10M50 81h12" /><circle cx="56" cy="54" r="5" /></g>
            <path className="orientation-turn" d="M84 33a34 34 0 0 1 6 31m-5-5 5 6 7-4" />
          </svg>
        </div>
        <div className="orientation-copy">
          <span className="orientation-eyebrow">A LITTLE TURN</span>
          <h1 id={headingId} ref={heading} tabIndex={-1}>Turn your phone upright.</h1>
          <p id={messageId}>This little world is made for portrait on your phone. Your place is saved.</p>
          <button type="button" className="orientation-foldable" onClick={onAllowFoldable}>I’m using a foldable <span aria-hidden="true">↗</span></button>
        </div>
      </div>
    </section>
  );
}
