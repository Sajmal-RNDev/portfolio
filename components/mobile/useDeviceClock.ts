"use client";

import { useEffect, useState } from "react";

export type DeviceClock = {
  time: string;
  date: string;
  dateTime: string;
  label: string;
  ready: boolean;
};

const INITIAL_CLOCK: DeviceClock = {
  time: "--:--",
  date: "",
  dateTime: "",
  label: "Local device time",
  ready: false,
};

function readClock(): DeviceClock {
  const now = new Date();
  const locale = navigator.languages.length ? navigator.languages : navigator.language;
  // Recreate formatters so a changed device timezone is picked up without reload.
  const time = new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" })
    .formatToParts(now)
    .filter(part => part.type !== "dayPeriod")
    .map(part => part.value)
    .join("")
    .trim();
  const date = new Intl.DateTimeFormat(locale, {
    weekday: "long", month: "long", day: "numeric",
  }).format(now);
  const label = new Intl.DateTimeFormat(locale, {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
    hour: "numeric", minute: "2-digit", timeZoneName: "short",
  }).format(now);
  now.setSeconds(0, 0);
  return { time, date, dateTime: now.toISOString(), label, ready: true };
}

/** One local device clock can be shared by the intro and portfolio status bar. */
export default function useDeviceClock(): DeviceClock {
  // The server and initial client render match; browser locale is read after mount.
  const [clock, setClock] = useState<DeviceClock>(INITIAL_CLOCK);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const refresh = () => {
      clearTimeout(timer);
      const next = readClock();
      setClock(previous => previous.time === next.time && previous.date === next.date
        && previous.dateTime === next.dateTime && previous.label === next.label ? previous : next);
      // Align with the next minute, while checking for OS clock changes in between.
      const untilNextMinute = 60_000 - Date.now() % 60_000 + 20;
      timer = setTimeout(refresh, Math.min(untilNextMinute, 30_000));
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") refresh();
    };

    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("pageshow", refresh);
    window.addEventListener("languagechange", refresh);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("pageshow", refresh);
      window.removeEventListener("languagechange", refresh);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return clock;
}
