"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { apps } from "@/content/apps";
import { site } from "@/content/site";
import BottomDock from "./BottomDock";
import LaunchIntro from "./LaunchIntro";
import HomeScreen from "./HomeScreen";
import WorkScreen from "./WorkScreen";
import AboutScreen from "./AboutScreen";
import ContactScreen from "./ContactScreen";
import ProjectScreen from "./ProjectScreen";
import useDeviceClock from "./useDeviceClock";
import { SCREEN_CLIP } from "./phone3d/dimensions";
import useInterfaceSound, { CLICK_SOUND, PHONE_FLIP_SOUND } from "./useInterfaceSound";

type Tab = "home" | "work" | "about" | "contact";
type Route = Tab | `project/${string}`;
const tabs = [
  { key: "home", label: "Home", icon: "home" },
  { key: "work", label: "Work", icon: "work" },
  { key: "about", label: "About", icon: "person" },
  { key: "contact", label: "Contact", icon: "mail" },
] as const;
const isProject = (route: Route) => route.startsWith("project/");
const panelKey = (route: Route) => isProject(route) ? "project" : route;
function parseRoute(hash: string): Route {
  const path = hash.replace(/^#\/?/, "");
  if (tabs.some(tab => tab.key === path)) return path as Tab;
  if (path.startsWith("project/") && apps.some(app => app.slug === path.slice(8))) return path as Route;
  return "home";
}

export default function PortfolioApp() {
  const clock = useDeviceClock();
  const { play: playTap, cancel: cancelTap, isReady: isTapReady, preload: preloadTap, primeAudio: primeTap } = useInterfaceSound(CLICK_SOUND.src);
  const { play: playFlip, cancel: cancelFlip, isReady: isFlipReady, preload: preloadFlip, primeAudio: primeFlip } = useInterfaceSound(PHONE_FLIP_SOUND.src);
  const preloadSounds = useCallback(async () => { await Promise.all([preloadTap(), preloadFlip()]); }, [preloadTap, preloadFlip]);
  const primeSounds = useCallback(async () => { await Promise.all([primeTap(), primeFlip()]); }, [primeTap, primeFlip]);
  const isSoundReady = useCallback(() => isTapReady() && isFlipReady(), [isTapReady, isFlipReady]);
  const cancelSounds = useCallback(() => { cancelTap(); cancelFlip(); }, [cancelTap, cancelFlip]);
  const [route, setRoute] = useState<Route>("home");
  const [lastProject, setLastProject] = useState<string | null>(null);
  const [exiting, setExiting] = useState<string | null>(null);
  const [direction, setDirection] = useState("forward");
  const [launchActive, setLaunchActive] = useState(true);
  const [launchRevealed, setLaunchRevealed] = useState(false);
  const [launchRun, setLaunchRun] = useState(0);
  const routeRef = useRef<Route>("home");
  const position = useRef(0);
  const screenRefs = useRef(new Map<string, HTMLElement>());
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusFrame = useRef<number | null>(null);
  const backFocus = useRef<HTMLElement | null>(null);
  const initialLoad = useRef(true);

  const revealLaunch = useCallback(() => setLaunchRevealed(true), []);
  const completeLaunch = useCallback(() => {
    setLaunchActive(false);
    setLaunchRevealed(true);
    requestAnimationFrame(() => {
      screenRefs.current.get(panelKey(routeRef.current))?.querySelector<HTMLElement>("[data-screen-title]")?.focus({ preventScroll: true });
    });
  }, []);
  const replayLaunch = useCallback(() => {
    screenRefs.current.get("home")?.scrollTo({ top: 0, behavior: "instant" });
    setLaunchRun(run => run + 1);
    setLaunchRevealed(false);
    setLaunchActive(true);
  }, []);

  const changeScreen = useCallback((next: Route, backwards = false, initial = false) => {
    const previous = routeRef.current;
    if (next === previous && !initial) return;
    if (exitTimer.current) clearTimeout(exitTimer.current);
    if (focusFrame.current) cancelAnimationFrame(focusFrame.current);
    if (isProject(next)) setLastProject(next.slice(8));
    setDirection(backwards ? "back" : "forward");
    setExiting(initial || panelKey(next) === panelKey(previous) ? null : panelKey(previous));
    routeRef.current = next;
    setRoute(next);
    exitTimer.current = setTimeout(() => setExiting(null), 460);
    focusFrame.current = requestAnimationFrame(() => {
      const panel = screenRefs.current.get(panelKey(next));
      if (isProject(next)) panel?.scrollTo({ top: 0, behavior: "instant" });
      if (backwards && isProject(previous) && backFocus.current?.isConnected && panel?.contains(backFocus.current)) {
        backFocus.current.focus({ preventScroll: true });
      } else if (!initial || next !== "home") {
        panel?.querySelector<HTMLElement>("[data-screen-title]")?.focus({ preventScroll: true });
      }
    });
  }, []);

  useEffect(() => {
    const viewport = window.visualViewport;
    const fitViewport = () => {
      if (viewport && viewport.scale === 1 && matchMedia("(max-width: 640px), (max-height: 560px) and (pointer: coarse)").matches) {
        document.documentElement.style.setProperty("--app-height", `${viewport.height}px`);
      } else document.documentElement.style.removeProperty("--app-height");
    };
    fitViewport();
    viewport?.addEventListener("resize", fitViewport);
    window.addEventListener("resize", fitViewport);
    return () => {
      viewport?.removeEventListener("resize", fitViewport);
      window.removeEventListener("resize", fitViewport);
      document.documentElement.style.removeProperty("--app-height");
    };
  }, []);

  useEffect(() => {
    const next = parseRoute(window.location.hash);
    position.current = window.history.state?.portfolioPosition ?? 0;
    window.history.replaceState({ ...window.history.state, portfolioPosition: position.current }, "", `#${next}`);
    changeScreen(next, false, true);
    initialLoad.current = false;
    const onLocationChange = () => {
      const nextPosition = window.history.state?.portfolioPosition;
      const nextRoute = parseRoute(window.location.hash);
      const backwards = typeof nextPosition === "number" ? nextPosition < position.current : isProject(routeRef.current);
      if (typeof nextPosition === "number") position.current = nextPosition;
      changeScreen(nextRoute, backwards);
    };
    window.addEventListener("popstate", onLocationChange);
    window.addEventListener("hashchange", onLocationChange);
    return () => {
      window.removeEventListener("popstate", onLocationChange);
      window.removeEventListener("hashchange", onLocationChange);
      if (exitTimer.current) clearTimeout(exitTimer.current);
      if (focusFrame.current) cancelAnimationFrame(focusFrame.current);
    };
  }, [changeScreen]);

  const navigate = useCallback((next: Route, replace = false) => {
    const previous = routeRef.current;
    if (next === previous) {
      screenRefs.current.get(panelKey(next))?.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
      return;
    }
    if (isProject(next)) backFocus.current = document.activeElement as HTMLElement;
    position.current += 1;
    const state = { ...window.history.state, portfolioPosition: position.current, portfolioFrom: replace ? undefined : previous };
    if (replace) window.history.replaceState(state, "", `#${next}`);
    else window.history.pushState(state, "", `#${next}`);
    const oldIndex = tabs.findIndex(tab => tab.key === previous);
    const newIndex = tabs.findIndex(tab => tab.key === next);
    changeScreen(next, isProject(previous) || (!isProject(next) && newIndex < oldIndex));
  }, [changeScreen]);

  const back = useCallback(() => {
    if (window.history.state?.portfolioFrom) window.history.back();
    else navigate("work", true);
  }, [navigate]);

  useEffect(() => {
    if (!isProject(route)) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.defaultPrevented) back();
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [route, back]);

  useEffect(() => {
    if (initialLoad.current) return;
    const app = isProject(route) ? apps.find(app => app.slug === route.slice(8)) : null;
    const title = app?.name ?? tabs.find(tab => tab.key === route)?.label;
    document.title = `${title === "Home" ? site.name : `${title} · ${site.name}`} — ${site.role}`;
  }, [route]);

  const openProject = (slug: string) => {
    playTap();
    navigate(`project/${slug}`);
  };
  const project = apps.find(app => app.slug === (isProject(route) ? route.slice(8) : lastProject));
  const activePanel = panelKey(route);
  function tabClick(event: MouseEvent<HTMLAnchorElement>, key: Tab) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    navigate(key);
  }

  return (
    <>
    {launchActive && <LaunchIntro key={launchRun} replay={launchRun > 0} clock={clock} onTap={playTap} onFlip={playFlip} onCancelSounds={cancelSounds} isSoundReady={isSoundReady} preloadSounds={preloadSounds} primeSounds={primeSounds} onReveal={revealLaunch} onComplete={completeLaunch} />}
    <div className="portfolio-stage" data-launch={launchActive ? launchRevealed ? "opening" : "waiting" : "done"} inert={launchActive} aria-hidden={launchActive}>
      <div className="desktop-identity" aria-hidden="true"><span>{site.name.toLowerCase()}.</span><span>A PORTFOLIO, IN YOUR POCKET.</span></div>
      <div className="desktop-note" aria-hidden="true"><span className="status-dot" /><span>{site.available ? site.availabilityText : "A selection of my work"}</span></div>
      <div className="device-shell" style={{ "--phone-screen-clip": SCREEN_CLIP } as CSSProperties}>
        <main className="device-display" aria-label={`${site.name}’s portfolio`}>
          <div className="device-status" aria-hidden="true"><span><time dateTime={clock.dateTime || undefined} title={clock.label}>{clock.time}</time></span><span className="device-island" /><div className="device-status-icons"><svg width="15" height="12" viewBox="0 0 15 12" fill="currentColor"><rect x="0" y="8" width="2.5" height="4" rx=".5"/><rect x="4" y="5" width="2.5" height="7" rx=".5"/><rect x="8" y="2" width="2.5" height="10" rx=".5"/><rect x="12" y="0" width="2.5" height="12" rx=".5"/></svg><svg width="16" height="12" viewBox="0 0 18 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 4a11 11 0 0 1 14 0M5 7a6 6 0 0 1 8 0M8 10a1.5 1.5 0 0 1 2 0"/></svg><span className="device-battery" /></div></div>
          <div className="screen-stack" data-direction={direction}>
            {tabs.map(tab => <section key={tab.key} ref={element => { if (element) screenRefs.current.set(tab.key, element); else screenRefs.current.delete(tab.key); }} className="app-screen" data-screen={tab.key} data-active={activePanel === tab.key} data-exiting={exiting === tab.key} inert={activePanel !== tab.key} aria-hidden={activePanel !== tab.key} aria-label={`${tab.label} screen`}>
              {tab.key === "home" && <HomeScreen onNavigate={navigate} onOpenProject={openProject} onReplay={replayLaunch} />}
              {tab.key === "work" && <WorkScreen onOpenProject={openProject} />}
              {tab.key === "about" && <AboutScreen onContact={() => navigate("contact")} />}
              {tab.key === "contact" && <ContactScreen />}
            </section>)}
            {project && <section ref={element => { if (element) screenRefs.current.set("project", element); else screenRefs.current.delete("project"); }} className="app-screen app-project-screen" data-screen="project" data-active={activePanel === "project"} data-exiting={exiting === "project"} inert={activePanel !== "project"} aria-hidden={activePanel !== "project"} aria-label={`${project.name} project`}><ProjectScreen key={project.slug} app={project} onBack={back} /></section>}
          </div>
          <BottomDock activeTab={isProject(route) ? "work" : route as Tab} hidden={isProject(route)} onNavigate={tabClick} />
          <div className="device-home-area" aria-hidden="true"><span /></div>
        </main>
      </div>
      <p className="desktop-hint"><span>MADE FOR EXPLORING</span> A few taps. A little about me. <span aria-hidden="true">↗</span></p>
    </div>
    </>
  );
}
