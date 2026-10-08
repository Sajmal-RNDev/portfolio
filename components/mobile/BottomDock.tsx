"use client";

import type { CSSProperties, MouseEvent } from "react";
import Icon from "@/components/Icon";
import "./dock.css";

export type DockTab = "home" | "work" | "about" | "contact";

const destinations = [
  { key: "home", label: "Home", icon: "home" },
  { key: "work", label: "Work", icon: "work" },
  { key: "about", label: "About", icon: "person" },
  { key: "contact", label: "Contact", icon: "mail" },
] as const;

type BottomDockProps = {
  activeTab: DockTab;
  hidden?: boolean;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, tab: DockTab) => void;
};

export default function BottomDock({ activeTab, hidden = false, onNavigate }: BottomDockProps) {
  const activeIndex = destinations.findIndex(destination => destination.key === activeTab);

  return (
    <div className="dock-area" data-hidden={hidden} hidden={hidden}>
      <nav
        className="app-dock"
        aria-label="Portfolio sections"
        style={{ "--active-index": activeIndex } as CSSProperties}
      >
        <span className="app-dock-selection" aria-hidden="true" />
        {destinations.map(destination => (
          <a
            className="app-dock-link"
            key={destination.key}
            href={`#${destination.key}`}
            aria-current={activeTab === destination.key ? "page" : undefined}
            onClick={event => onNavigate(event, destination.key)}
          >
            <span className="app-dock-icon"><Icon name={destination.icon} width="21" height="21" /></span>
            <span className="app-dock-label">{destination.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
