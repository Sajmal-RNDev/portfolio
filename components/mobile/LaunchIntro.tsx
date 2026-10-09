"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type AnimationEvent, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { apps } from "@/content/apps";
import { site } from "@/content/site";
import Icon from "@/components/Icon";
import PhoneBack from "./PhoneBack";
import PhoneEdges from "./PhoneEdges";
import ThreePhone from "./ThreePhone";
import { PHONE_SIZE, SCREEN_CLIP } from "./phone3d/dimensions";
import type { DeviceClock } from "./useDeviceClock";
import { CLICK_SOUND } from "./useInterfaceSound";
import "./launch.css";

type Phase = "checking" | "back" | "ready" | "flipping" | "locked" | "swiping" | "scanning" | "verified" | "home" | "tapping" | "opening";
const SESSION_KEY = "portfolio-intro-seen";
const OPEN_DURATION = 1100;
const OPEN_EASING = "cubic-bezier(.22,.68,.13,1)";
const TAP_DURATION = 460;

export default function LaunchIntro({ replay = false, clock, onTap, onFlip, onCancelSounds, isSoundReady, preloadSounds, primeSounds, onReveal, onComplete }: {
  replay?: boolean;
  clock: DeviceClock;
  onTap: () => void;
  onFlip: () => void;
  onCancelSounds: () => void;
  isSoundReady: () => boolean;
  preloadSounds: () => Promise<void>;
  primeSounds: () => Promise<void>;
  onReveal: () => void;
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("checking");
  const [isStarting, setIsStarting] = useState(false);
  const [renderHardware, setRenderHardware] = useState(false);
  const [hardwareReady, setHardwareReady] = useState(false);
  const hardwareSettled = useRef<(() => void) | null>(null);
  const [expansion, setExpansion] = useState<CSSProperties>({});
  const phone = useRef<HTMLDivElement>(null);
  const phoneWrap = useRef<HTMLDivElement>(null);
  const appSurface = useRef<HTMLDivElement>(null);
  const sharedPortrait = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const expansionAnimations = useRef<Animation[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const finished = useRef(false);
  const opening = useRef(false);
  const unlockStarted = useRef(false);
  const pointerStart = useRef<number | null>(null);
  const tapPlayed = useRef(false);
  const flipPlayed = useRef(false);
  const starting = useRef(false);

  const revealHardware = useCallback(() => {
    setHardwareReady(true);
    hardwareSettled.current?.();
  }, []);
  const fallbackHardware = useCallback(() => {
    setHardwareReady(false);
    hardwareSettled.current?.();
  }, []);

  const playTapOnce = useCallback(() => {
    if (tapPlayed.current || finished.current || opening.current) return;
    tapPlayed.current = true;
    onTap();
  }, [onTap]);

  function syncTapSound(event: AnimationEvent<HTMLSpanElement>) {
    if (event.animationName !== "launch-icon-press") return;
    // Start the recording's silent lead-in early; its click lands at full press.
    timers.current.push(setTimeout(playTapOnce, Math.max(0, TAP_DURATION * .48 - CLICK_SOUND.leadMs)));
  }

  function syncFlipSound(event: AnimationEvent<HTMLDivElement>) {
    if (event.target !== phone.current || event.animationName !== "launch-phone-flip" || flipPlayed.current || finished.current) return;
    flipPlayed.current = true;
    // The soft whoosh peaks 320 ms into its recording; center it on the
    // 1400 ms turn's peak velocity without changing the requested sound level.
    timers.current.push(setTimeout(() => { if (!finished.current) onFlip(); }, 380));
  }

  async function startExperience() {
    if (phase !== "ready" || starting.current || finished.current) return;
    starting.current = true;
    setIsStarting(true);
    scene.current?.querySelector<HTMLButtonElement>(".launch-skip")?.focus({ preventScroll: true });
    // Prime both native players in this gesture, before the first audible motion.
    await primeSounds();
    if (finished.current) return;
    setIsStarting(false);
    setPhase("flipping");
  }

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const cancelExpansionAnimations = useCallback(() => {
    expansionAnimations.current.forEach(animation => animation.cancel());
    expansionAnimations.current = [];
  }, []);

  const complete = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    clearTimers();
    onCancelSounds();
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* The opening also works with storage disabled. */ }
    onComplete();
  }, [clearTimers, onCancelSounds, onComplete]);

  const openPortfolio = useCallback(() => {
    if (finished.current || opening.current) return;
    playTapOnce();
    opening.current = true;
    clearTimers();
    const from = phoneWrap.current?.getBoundingClientRect();
    const target = document.querySelector(".device-shell")?.getBoundingClientRect();
    const icon = scene.current?.querySelector<HTMLElement>(".launch-app-icon");
    const sourceImage = icon?.getBoundingClientRect();
    const destinationImage = document.querySelector<HTMLElement>(".mh-portrait");
    // An immediate manual tap can beat the hidden Home screen's entry motion.
    destinationImage?.closest(".app-screen")?.getAnimations().forEach(animation => animation.finish());
    const destination = destinationImage?.getBoundingClientRect();
    const glass = scene.current?.querySelector<HTMLElement>(".launch-glass");
    const animate = (element: HTMLElement, keyframes: Keyframe[], options: KeyframeAnimationOptions = {}) => {
      expansionAnimations.current.push(element.animate(keyframes, {
        duration: OPEN_DURATION, easing: OPEN_EASING, fill: "both", ...options,
      }));
    };

    // One portrait travels from the tapped icon into the profile card.
    // A square canvas and uniform scale keep the face from stretching.
    if (sourceImage && destination && sharedPortrait.current) {
      const portrait = sharedPortrait.current;
      const size = Math.max(destination.width, destination.height);
      const finalX = destination.x - (size - destination.width) / 2;
      const finalY = destination.y - (size - destination.height) / 2;
      const profile = destinationImage?.closest(".mh-profile")?.getBoundingClientRect();
      const viewport = destinationImage?.closest(".app-screen")?.getBoundingClientRect();
      const top = Math.max(destination.top, profile?.top ?? destination.top, viewport?.top ?? destination.top) - finalY;
      const right = finalX + size - Math.min(destination.right, profile?.right ?? destination.right, viewport?.right ?? destination.right);
      const bottom = finalY + size - Math.min(destination.bottom, profile?.bottom ?? destination.bottom, viewport?.bottom ?? destination.bottom);
      const left = Math.max(destination.left, profile?.left ?? destination.left, viewport?.left ?? destination.left) - finalX;
      const startTransform = `translate3d(${sourceImage.x}px, ${sourceImage.y}px, 0) scale(${sourceImage.width / size})`;
      Object.assign(portrait.style, { width: `${size}px`, height: `${size}px`, opacity: "1", transform: startTransform });
      animate(portrait, [
        { transform: startTransform, clipPath: `inset(0px round ${size / 4}px)` },
        { transform: `translate3d(${finalX}px, ${finalY}px, 0) scale(1)`, clipPath: `inset(${top}px ${right}px ${bottom}px ${left}px round 0px 22px 22px 0px)` },
      ]);
      animate(portrait, [{ opacity: 1, offset: 0 }, { opacity: 1, offset: .68 }, { opacity: 0, offset: 1 }], { easing: "linear" });
    }

    // Expand a full-size surface from the actual icon using transforms only.
    // No width, height or position interpolation is needed during the opening.
    if (sourceImage && glass && appSurface.current) {
      const bounds = glass.getBoundingClientRect();
      const scaleX = bounds.width / glass.clientWidth;
      const scaleY = bounds.height / glass.clientHeight;
      const x = (sourceImage.x - bounds.x) / scaleX;
      const y = (sourceImage.y - bounds.y) / scaleY;
      const width = sourceImage.width / scaleX;
      const height = sourceImage.height / scaleY;
      const sx = width / glass.clientWidth;
      const sy = height / glass.clientHeight;
      appSurface.current.style.opacity = "1";
      animate(appSurface.current, [
        { transform: `translate3d(${x}px, ${y}px, 0) scale(${sx}, ${sy})`, borderRadius: `${width / 4 / sx}px / ${height / 4 / sy}px` },
        { transform: "translate3d(0, 0, 0) scale(1)", borderRadius: getComputedStyle(glass).borderRadius },
      ]);
    }

    if (from && target) {
      const x = target.x + target.width / 2 - (from.x + from.width / 2);
      const y = target.y + target.height / 2 - (from.y + from.height / 2);
      const scaleX = target.width / from.width;
      const scaleY = target.height / from.height;
      setExpansion({
        "--launch-x": `${x}px`,
        "--launch-y": `${y}px`,
        "--launch-scale-x": scaleX,
        "--launch-scale-y": scaleY,
      } as CSSProperties);
      // Continue from the current pose, including an early tap during arrival.
      if (phone.current) {
        const pose = getComputedStyle(phone.current);
        const transform = pose.transform;
        const opacity = pose.opacity;
        animate(phone.current, [
          { transform },
          { transform: `translate(${x}px, ${y}px) translateZ(${-from.width * PHONE_SIZE.depth / PHONE_SIZE.width / 2}px) scale(${scaleX}, ${scaleY})` },
        ]);
        // Hold the phone until the real portfolio is visible underneath it.
        animate(phoneWrap.current!, [
          { opacity, offset: 0 },
          { opacity: 1, offset: .48 },
          { opacity: 0, offset: 1 },
        ], { easing: "linear" });
      }
    }
    setPhase("opening");
    onReveal();
  }, [clearTimers, onReveal, playTapOnce]);

  useLayoutEffect(() => {
    if (phase !== "opening") return;
    let cancelled = false;
    let paintFrame = 0;
    // Read after the opening styles commit so the background transition and
    // portfolio reveal are included alongside the phone and portrait motion.
    const animations = [
      ...(scene.current?.getAnimations({ subtree: true }) ?? []),
      ...(document.querySelector(".portfolio-stage")?.getAnimations({ subtree: true }) ?? []),
    ].filter(animation => animation.effect?.getComputedTiming().iterations !== Infinity);

    void Promise.allSettled(animations.map(animation => animation.finished)).then(() => {
      if (cancelled || finished.current) return;
      // Paint the fully revealed portfolio before removing the transparent intro.
      paintFrame = requestAnimationFrame(() => {
        paintFrame = requestAnimationFrame(() => {
          if (!cancelled && !finished.current) complete();
        });
      });
    });
    return () => { cancelled = true; cancelAnimationFrame(paintFrame); };
  }, [phase, complete]);

  const unlock = useCallback(() => {
    if (finished.current || unlockStarted.current) return;
    unlockStarted.current = true;
    clearTimers();
    setPhase("swiping");
    timers.current.push(setTimeout(() => setPhase("scanning"), 270));
    timers.current.push(setTimeout(() => setPhase("verified"), 680));
    timers.current.push(setTimeout(() => setPhase("home"), 950));
    timers.current.push(setTimeout(() => setPhase("tapping"), 1330));
    timers.current.push(setTimeout(openPortfolio, 1330 + TAP_DURATION));
  }, [clearTimers, openPortfolio]);

  function advanceDevice(event: AnimationEvent<HTMLDivElement>) {
    if (event.target !== phone.current || finished.current) return;
    if (event.animationName === "launch-rear-arrive") setPhase(isSoundReady() ? "flipping" : "ready");
    if (event.animationName === "launch-phone-flip") {
      setPhase("locked");
      timers.current.push(setTimeout(unlock, 80));
    }
  }

  useEffect(() => {
    finished.current = false;
    opening.current = false;
    unlockStarted.current = false;
    tapPlayed.current = false;
    flipPlayed.current = false;
    starting.current = false;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let seen = false;
    try { seen = sessionStorage.getItem(SESSION_KEY) === "1"; } catch { /* Use the first-visit experience. */ }
    const directLink = Boolean(window.location.hash && !["#home", "#/home"].includes(window.location.hash));
    if (motion.matches || directLink || (seen && !replay)) {
      complete();
      return clearTimers;
    }
    let cancelled = false;
    let focusFrame = 0;
    const hardware = new Promise<void>(resolve => { hardwareSettled.current = resolve; });
    setRenderHardware(true);
    const begin = () => {
      if (cancelled || finished.current) return;
      setPhase("back");
    };
    focusFrame = requestAnimationFrame(() => {
      scene.current?.querySelector<HTMLButtonElement>(".launch-skip")?.focus({ preventScroll: true });
    });
    // Preload the hardware images and both recordings before showing the phone.
    const artwork = Array.from(scene.current?.querySelectorAll<HTMLImageElement>(".phone-back img, .launch-front-art img") ?? []);
    Promise.all([Promise.allSettled(artwork.map(image => image.decode())), preloadSounds(), hardware]).then(begin, () => { if (!cancelled) complete(); });
    const reduceNow = () => { if (motion.matches) complete(); };
    motion.addEventListener("change", reduceNow);
    return () => {
      cancelled = true;
      hardwareSettled.current = null;
      clearTimers();
      // Cancel only after removal; cancelling a visible fill animation restores
      // the portrait's starting position and can flash it over the finished UI.
      cancelExpansionAnimations();
      onCancelSounds();
      cancelAnimationFrame(focusFrame);
      motion.removeEventListener("change", reduceNow);
    };
  }, [cancelExpansionAnimations, clearTimers, complete, onCancelSounds, preloadSounds, replay, unlock]);

  const isHome = phase === "home" || phase === "tapping" || phase === "opening";
  const isVerified = phase === "verified" || isHome;
  const isUnlocking = phase === "swiping" || phase === "scanning" || isVerified;
  function beginSwipe(event: PointerEvent<HTMLDivElement>) {
    if (phase !== "locked" || (event.target as HTMLElement).closest("button")) return;
    clearTimers();
    pointerStart.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function endSwipe(event: PointerEvent<HTMLDivElement>) {
    if (pointerStart.current === null) return;
    if (pointerStart.current - event.clientY > 24) unlock();
    else timers.current.push(setTimeout(unlock, 200));
    pointerStart.current = null;
  }
  function cancelSwipe() {
    if (pointerStart.current === null) return;
    pointerStart.current = null;
    timers.current.push(setTimeout(unlock, 200));
  }

  useEffect(() => {
    const active = document.activeElement;
    if (active instanceof HTMLButtonElement && active.disabled && scene.current?.contains(active)) {
      scene.current.querySelector<HTMLButtonElement>(".launch-skip")?.focus({ preventScroll: true });
    }
  }, [phase]);

  function handleKeys(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") { event.stopPropagation(); complete(); }
    if (event.key !== "Tab") return;
    const controls = Array.from(scene.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ?? []);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && (document.activeElement === first || !scene.current?.contains(document.activeElement))) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first?.focus();
    }
  }

  return (
    <div ref={scene} className="launch-scene" data-phase={phase} data-hardware={hardwareReady ? "webgl" : "photo"} style={{ "--tap-duration": `${TAP_DURATION}ms`, "--phone-screen-clip": SCREEN_CLIP } as CSSProperties} role="dialog" aria-modal="true" aria-label={`Opening ${site.name}’s portfolio`} onKeyDown={handleKeys}>
      <div className="launch-atmosphere" aria-hidden="true"><span /><span /><span /></div>
      <div className="launch-brand"><span>{site.name.toLowerCase()}.</span><span>A LITTLE WORLD, ONE TAP AWAY.</span></div>
      <div className="launch-controls">
        <button type="button" className="launch-sound" onClick={onTap} disabled={phase === "checking" || phase === "opening"} aria-label="Test click sound" title="Test click sound"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m11 4-6 5H2v6h3l6 5V4Z"/><path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></svg></button>
        <button type="button" className="launch-skip" onClick={complete}>Skip intro <span aria-hidden="true">↗</span></button>
      </div>
      <div className="launch-background-type" aria-hidden="true"><span>A little</span><span>world.</span></div>
      {renderHardware && <ThreePhone sceneRef={scene} phoneRef={phone} wrapperRef={phoneWrap} phase={phase} onReady={revealHardware} onUnavailable={fallbackHardware} />}
      <div className="launch-device-wrap" ref={phoneWrap}>
        <div className="launch-device" ref={phone} style={expansion} onAnimationStart={syncFlipSound} onAnimationEnd={advanceDevice}>
          <PhoneBack />
          <PhoneEdges />
          <div className="launch-front">
          <div className="launch-front-art" aria-hidden="true"><img src="/device/iphone-18-pro-burgundy-front-source.jpg" alt="" width="2880" height="1520" fetchPriority="high" decoding="async" /></div>
          <div className="launch-glass">
            <div className="launch-wallpaper" aria-hidden="true"><span className="launch-fold fold-one" /><span className="launch-fold fold-two" /><span className="launch-fold fold-three" /></div>
            <div className="launch-status" aria-hidden="true"><span><time dateTime={clock.dateTime || undefined} title={clock.label}>{clock.time}</time></span><span className="launch-signal">▮▮▮ <span>▰</span></span></div>
            <span className="launch-island" aria-hidden="true"><img src="/device/iphone-18-pro-burgundy-front-source.jpg" alt="" width="2880" height="1520" /></span>
            <div className="launch-lock-screen" data-unlocked={isHome} onPointerDown={beginSwipe} onPointerUp={endSwipe} onPointerCancel={cancelSwipe} inert={isHome} aria-label="Phone unlock animation">
              <div className="launch-lock-content" aria-hidden="true">
                <svg className="launch-padlock" data-verified={isVerified} width="24" height="29" viewBox="0 0 24 29" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path className="launch-lock-shackle" d="M7 12V8a5 5 0 0 1 10 0v4" /><rect x="3" y="12" width="18" height="14" rx="4" fill="currentColor" stroke="none" /><path d="M12 18v3" stroke="#2b4435" /></svg>
                <span className="launch-lock-date">{clock.date}</span><strong className="launch-lock-time"><time dateTime={clock.dateTime || undefined}>{clock.time}</time></strong>
                <div className="launch-lock-message"><span>A LITTLE WORLD,</span><span>ready to explore.</span></div>
              </div>
              <div className="launch-face-id" data-verified={isVerified} aria-hidden="true">
                <div className="launch-face-symbol"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round"><path className="launch-face-corners" d="M21 7H13a6 6 0 0 0-6 6v8M43 7h8a6 6 0 0 1 6 6v8M57 43v8a6 6 0 0 1-6 6h-8M21 57h-8a6 6 0 0 1-6-6v-8"/><g className="launch-face-features"><path d="M21 24v5m22-5v5M32 23v12l-4 2m-5 7c5 5 13 5 18 0" /></g><path className="launch-face-check" pathLength="1" d="m20 33 8 8 17-18" /></svg><span className="launch-face-scan" /></div>
                <span className="launch-face-label">{isVerified ? "Verified" : "Face ID"}</span>
              </div>
              <div className="launch-lock-actions" aria-hidden="true"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3h8v4l-2 3v10h-4V10L8 7Zm0 4h8m-4 6v2" /></svg></span><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m8 6 2-3h4l2 3h4v14H4V6Z" /><circle cx="12" cy="13" r="4" /></svg></span></div>
              <button type="button" className="launch-unlock" onClick={unlock} disabled={phase !== "locked"}>Swipe up or tap to open <span aria-hidden="true">⌃</span></button>
              <span className="launch-swipe-touch" aria-hidden="true" />
              <span className="launch-swipe-trail" aria-hidden="true" />
            </div>
            <div className="launch-home-screen" data-visible={isHome} inert={!isHome} aria-hidden={!isHome}>
              <div className="launch-home-heading" aria-hidden="true"><span>SAJMAL’S SPACE</span><strong>Make yourself<br /><em>at home.</em></strong></div>
              <div className="launch-app-grid">
              <div className="launch-app-position">
              <button type="button" className="launch-app" onClick={openPortfolio} disabled={!isHome || phase === "opening"} aria-label={`Open ${site.name}’s portfolio`}>
                <span className="launch-app-icon" onAnimationStart={syncTapSound}><img src="/portrait.webp" alt="" width="88" height="88" /><span className="launch-icon-glint" aria-hidden="true" /></span>
                <span className="launch-app-label">{site.name}</span>
              </button>
              <span className="launch-touch" aria-hidden="true"><span /></span>
              <span className="launch-ripple" aria-hidden="true" />
              </div>
              {apps.slice(0, 7).map(app => <div className="launch-grid-app" key={app.slug} aria-hidden="true"><img src={`/apps/${app.slug}/icon.webp`} alt="" width="60" height="60" /><span>{app.name.replace(" Cloud", "").replace(" Academy", "")}</span></div>)}
              </div>
              <div className="launch-home-dots" aria-hidden="true"><i /><i /></div>
              <div className="launch-home-dock" aria-hidden="true"><span><Icon name="home" width="24" height="24" /></span><span><Icon name="work" width="24" height="24" /></span><span><Icon name="mail" width="24" height="24" /></span><span><Icon name="code" width="24" height="24" /></span></div>
            </div>
            <span className="launch-home-indicator" aria-hidden="true" />
            <div ref={appSurface} className="launch-app-expansion" aria-hidden="true" />
          </div>
          </div>
        </div>
        <span className="launch-device-shadow" aria-hidden="true" />
      </div>
      {phase === "ready" && <button type="button" className="launch-start-device" onClick={startExperience} disabled={isStarting} aria-label="Tap the phone to start the portfolio" />}
      <div ref={sharedPortrait} className="launch-shared-portrait" aria-hidden="true"><img src="/portrait.webp" alt="" width="200" height="200" /></div>
      <div className="launch-caption" aria-hidden={phase !== "ready"}>
        <span className="launch-caption-line" />
        {phase === "ready" ? <button type="button" className="launch-start" onClick={startExperience} disabled={isStarting}>{isStarting ? "Opening…" : "Tap to begin"} <span aria-hidden="true">↗</span></button> : <span>{phase === "opening" ? "Welcome to my world." : phase === "tapping" || phase === "home" ? "One tap. A whole portfolio." : phase === "verified" ? "You’re in. Make yourself at home." : phase === "swiping" || phase === "scanning" ? "A familiar gesture. A new perspective." : "A little detail. From every angle."}</span>}
        <span className="launch-steps" aria-hidden="true"><i className="is-active" /><i className={isUnlocking ? "is-active" : ""} /><i className={isHome ? "is-active" : ""} /></span>
      </div>
    </div>
  );
}
