"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type DeviceHints = { model?: string; formFactors?: string[]; mobile?: boolean };
type LayoutNavigator = Navigator & {
  userAgentData?: { mobile?: boolean; getHighEntropyValues?: (hints: string[]) => Promise<DeviceHints> };
  devicePosture?: EventTarget & { type?: string };
};
type SegmentedWindow = Window & {
  viewport?: { segments?: readonly DOMRect[] };
  getWindowSegments?: () => readonly DOMRect[];
};

const FOLDABLE_SESSION = "portfolio-foldable-layout";
const FOLDABLE_MODEL = /\bSM-F[79]\d{2}[A-Z0-9]*\b|\bGalaxy\s+(?:Z\s+)?(?:Fold|Flip)\b|\bPixel(?:\s+\d+)?(?:\s+Pro)?\s+Fold\b|\b(?:Motorola\s+)?Razr\b|\bOnePlus\s+Open\b/i;

function rememberFoldable() {
  try { sessionStorage.setItem(FOLDABLE_SESSION, "1"); } catch { /* The current visit still works without storage. */ }
}

/** Prefer physical orientation: a software keyboard can invert viewport ratios. */
function isScreenLandscape() {
  const orientation = screen.orientation?.type;
  if (orientation?.startsWith("landscape")) return true;
  if (orientation?.startsWith("portrait")) return false;
  if (typeof window.orientation === "number") return Math.abs(window.orientation) % 180 === 90;
  if (screen.width > 0 && screen.height > 0 && screen.width !== screen.height) return screen.width > screen.height;
  return matchMedia("(orientation: landscape)").matches;
}

/** Phones use portrait; tablets and positively identified foldables can rotate. */
export default function useDeviceLayout() {
  const [layout, setLayout] = useState({ ready: false, portraitRequired: false });
  const foldable = useRef(false);
  const refreshRef = useRef<(() => void) | null>(null);

  const allowFoldable = useCallback(() => {
    foldable.current = true;
    rememberFoldable();
    refreshRef.current?.();
  }, []);

  useEffect(() => {
    let cancelled = false;
    let hintsOpen = true;
    let hints: DeviceHints = {};
    let hintsTimer: ReturnType<typeof setTimeout> | undefined;
    const nav = navigator as LayoutNavigator;
    const segmentedWindow = window as SegmentedWindow;
    const coarse = matchMedia("(pointer: coarse)");
    const horizontalSegments = matchMedia("(horizontal-viewport-segments: 2)");
    const verticalSegments = matchMedia("(vertical-viewport-segments: 2)");
    const foldedPosture = matchMedia("(device-posture: folded)");
    const orientationQuery = matchMedia("(orientation: landscape)");
    const queries = [coarse, horizontalSegments, verticalSegments, foldedPosture, orientationQuery];
    try { foldable.current ||= sessionStorage.getItem(FOLDABLE_SESSION) === "1"; } catch { /* Keep in-memory detection. */ }

    const refresh = () => {
      if (cancelled) return;
      const ua = navigator.userAgent;
      const touch = navigator.maxTouchPoints > 0 || coarse.matches;
      const shortestScreen = Math.min(screen.width, screen.height);
      const formFactors = hints.formFactors?.map(value => value.toLowerCase()) ?? [];
      const iPad = /iPad/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
      const tablet = iPad || formFactors.includes("tablet") || /Tablet|PlayBook|Silk\//i.test(ua)
        || (touch && shortestScreen >= 600);

      let segmentCount = segmentedWindow.viewport?.segments?.length ?? 0;
      try { segmentCount = Math.max(segmentCount, segmentedWindow.getWindowSegments?.().length ?? 0); } catch { /* Experimental APIs may be unavailable. */ }
      const hasFold = segmentCount > 1 || horizontalSegments.matches || verticalSegments.matches
        || foldedPosture.matches || nav.devicePosture?.type === "folded"
        || FOLDABLE_MODEL.test(`${ua} ${hints.model ?? ""}`);
      // API presence and the generic "continuous" posture also occur on slabs.
      if (hasFold && !foldable.current) { foldable.current = true; rememberFoldable(); }

      const desktop = /Windows NT|X11|Macintosh/i.test(ua) || formFactors.includes("desktop");
      const phone = !tablet && (/iPhone|iPod|Mobile|Mobi|Windows Phone|IEMobile/i.test(ua)
        || hints.mobile === true || nav.userAgentData?.mobile === true
        || (touch && shortestScreen > 0 && shortestScreen < 600 && !desktop));
      const portraitRequired = phone && !foldable.current && isScreenLandscape();
      setLayout(previous => previous.ready && previous.portraitRequired === portraitRequired
        ? previous : { ready: true, portraitRequired });
    };
    refreshRef.current = refresh;
    refresh();

    // Extra device hints improve reduced Android UAs; readiness never waits on them.
    if ((navigator.maxTouchPoints > 0 || coarse.matches) && nav.userAgentData?.getHighEntropyValues) {
      hintsTimer = setTimeout(() => { hintsOpen = false; }, 1200);
      try {
        void nav.userAgentData.getHighEntropyValues(["model", "formFactors"]).then(values => {
          if (cancelled || !hintsOpen) return;
          clearTimeout(hintsTimer);
          hintsOpen = false;
          hints = values;
          refresh();
        }).catch(() => { clearTimeout(hintsTimer); hintsOpen = false; });
      } catch { clearTimeout(hintsTimer); hintsOpen = false; }
    }

    queries.forEach(query => {
      if (query.addEventListener) query.addEventListener("change", refresh);
      else query.addListener(refresh);
    });
    screen.orientation?.addEventListener?.("change", refresh);
    nav.devicePosture?.addEventListener?.("change", refresh);
    window.addEventListener("orientationchange", refresh);
    window.addEventListener("resize", refresh);
    window.addEventListener("pageshow", refresh);
    window.visualViewport?.addEventListener("resize", refresh);
    return () => {
      cancelled = true;
      hintsOpen = false;
      clearTimeout(hintsTimer);
      refreshRef.current = null;
      queries.forEach(query => {
        if (query.removeEventListener) query.removeEventListener("change", refresh);
        else query.removeListener(refresh);
      });
      screen.orientation?.removeEventListener?.("change", refresh);
      nav.devicePosture?.removeEventListener?.("change", refresh);
      window.removeEventListener("orientationchange", refresh);
      window.removeEventListener("resize", refresh);
      window.removeEventListener("pageshow", refresh);
      window.visualViewport?.removeEventListener("resize", refresh);
    };
  }, []);

  return { ...layout, allowFoldable };
}
