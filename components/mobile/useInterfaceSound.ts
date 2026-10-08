"use client";

import { useCallback, useEffect, useRef } from "react";

type Priming = { promise: Promise<void>; cancel: () => void };
export const CLICK_SOUND = { src: "/audio/select-click-subtle.wav", leadMs: 100 } as const;
export const PHONE_FLIP_SOUND = { src: "/audio/phone-flip-whisper.wav", leadMs: 0 } as const;
// Give a cold USB audio device time to start; cancellation still prevents stale plays.
const MAX_PLAY_DELAY = 500;

function resetAudio(audio: HTMLAudioElement) {
  try { audio.pause(); } catch { /* Optional audio must not interrupt navigation. */ }
  try { audio.currentTime = 0; } catch { /* Seeking can fail before metadata loads. */ }
  audio.muted = false;
  audio.volume = 1;
}

/** Native media playback shared by the intro’s click and phone movement sounds. */
export default function useInterfaceSound(src: string) {
  const element = useRef<HTMLAudioElement | null>(null);
  const unlocked = useRef(false);
  const loading = useRef<Promise<void> | null>(null);
  const finishLoading = useRef<(() => void) | null>(null);
  const priming = useRef<Priming | null>(null);
  const request = useRef(0);
  const playDeadline = useRef<ReturnType<typeof setTimeout> | null>(null);

  const prepare = useCallback(() => {
    if (element.current) return element.current;
    try {
      const audio = new Audio(src);
      audio.preload = "auto";
      audio.volume = 1;
      audio.muted = false;
      element.current = audio;
      loading.current = new Promise<void>(resolve => {
        let settled = false;
        const finish = () => {
          if (settled) return;
          settled = true;
          clearTimeout(timeout);
          audio.removeEventListener("canplay", finish);
          audio.removeEventListener("error", finish);
          if (finishLoading.current === finish) finishLoading.current = null;
          resolve();
        };
        const timeout = setTimeout(finish, 8000);
        finishLoading.current = finish;
        audio.addEventListener("canplay", finish);
        audio.addEventListener("error", finish);
        if (audio.readyState >= 2) finish();
        else {
          try { audio.load(); } catch { finish(); }
        }
      });
      return audio;
    } catch {
      finishLoading.current?.();
      element.current = null;
      loading.current = null;
      return null;
    }
  }, [src]);

  const cancel = useCallback(() => {
    request.current += 1;
    if (playDeadline.current !== null) clearTimeout(playDeadline.current);
    playDeadline.current = null;
    priming.current?.cancel();
    if (element.current) resetAudio(element.current);
  }, []);

  const play = useCallback(() => {
    const audio = prepare();
    if (!audio) return;
    const id = ++request.current;
    const requestedAt = performance.now();
    const isCurrent = () => id === request.current && element.current === audio;
    const play = () => {
      if (!isCurrent() || performance.now() - requestedAt > MAX_PLAY_DELAY) return;
      if (playDeadline.current !== null) clearTimeout(playDeadline.current);
      resetAudio(audio);
      // A rejected or slow native play must never turn into a late, unrelated click.
      const deadline = setTimeout(() => {
        if (!isCurrent()) return;
        request.current += 1;
        playDeadline.current = null;
        resetAudio(audio);
      }, Math.max(0, MAX_PLAY_DELAY - (performance.now() - requestedAt)));
      playDeadline.current = deadline;
      const clearDeadline = () => {
        clearTimeout(deadline);
        if (playDeadline.current === deadline) playDeadline.current = null;
      };
      try {
        void Promise.resolve(audio.play()).then(() => {
          clearDeadline();
          if (!isCurrent()) return;
          if (performance.now() - requestedAt > MAX_PLAY_DELAY) {
            resetAudio(audio);
            return;
          }
          unlocked.current = true;
        }).catch(() => {
          clearDeadline();
          if (isCurrent()) resetAudio(audio);
        });
      } catch {
        clearDeadline();
        if (isCurrent()) resetAudio(audio);
      }
    };
    // Resetting a primed element can temporarily lower readyState while seeking.
    // Wait for that prime, then let native play buffer instead of dropping the tap.
    if (priming.current) void priming.current.promise.then(play);
    else play();
  }, [prepare]);

  const isReady = useCallback(() => unlocked.current && (element.current?.readyState ?? 0) >= 2, []);
  const preload = useCallback(() => {
    prepare();
    return loading.current ?? Promise.resolve();
  }, [prepare]);

  const primeAudio = useCallback((): Promise<void> => {
    if (unlocked.current) return Promise.resolve();
    if (priming.current) return priming.current.promise;
    const audio = prepare();
    if (!audio) return Promise.resolve();
    let settled = false;
    let resolvePrime: () => void = () => {};
    const promise = new Promise<void>(resolve => { resolvePrime = resolve; });
    const finish = (success: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      if (priming.current === owner) {
        priming.current = null;
        if (element.current === audio) {
          resetAudio(audio);
          unlocked.current = success;
        }
      }
      resolvePrime();
    };
    const owner: Priming = { promise, cancel: () => finish(false) };
    const timeout = setTimeout(() => finish(false), 1000);
    priming.current = owner;
    resetAudio(audio);
    audio.muted = true;
    try {
      // The same element is silently primed inside a genuine user gesture.
      void Promise.resolve(audio.play()).then(() => finish(true)).catch(() => finish(false));
    } catch { finish(false); }
    return promise;
  }, [prepare]);

  useEffect(() => {
    prepare();
    const unlock = (event: Event) => {
      if (!event.isTrusted
        || (event instanceof KeyboardEvent && ["Escape", "Shift", "Control", "Alt", "Meta"].includes(event.key))) return;
      void primeAudio();
    };
    document.addEventListener("pointerdown", unlock, true);
    document.addEventListener("pointerup", unlock, true);
    document.addEventListener("keydown", unlock, true);
    return () => {
      document.removeEventListener("pointerdown", unlock, true);
      document.removeEventListener("pointerup", unlock, true);
      document.removeEventListener("keydown", unlock, true);
      cancel();
      finishLoading.current?.();
      const audio = element.current;
      element.current = null;
      loading.current = null;
      unlocked.current = false;
      if (audio) {
        audio.removeAttribute("src");
        try { audio.load(); } catch { /* Release media even if its source failed. */ }
      }
    };
  }, [prepare, cancel, primeAudio]);

  return { play, cancel, isReady, preload, primeAudio };
}
