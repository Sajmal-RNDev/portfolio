"use client";

import { useCallback, useEffect, useState } from "react";
import type { App } from "@/content/apps";
import AppCard from "./AppCard";
import AppDetail from "./AppDetail";

/** Keep the address bar in step so a detail view can be linked to directly. */
function writeHash(slug: string | null) {
  const { pathname, search } = window.location;
  // replaceState never scrolls, unlike assigning location.hash
  window.history.replaceState(null, "", slug ? `#${slug}` : pathname + search);
}

export default function WorkGallery({ apps }: { apps: App[] }) {
  const [index, setIndex] = useState<number | null>(null);

  /* open straight into an app when the page is loaded with #slug */
  useEffect(() => {
    const slug = decodeURIComponent(window.location.hash.slice(1));
    const i = apps.findIndex((a) => a.slug === slug);
    if (i !== -1) setIndex(i);
  }, [apps]);

  const open = useCallback(
    (i: number) => {
      setIndex(i);
      writeHash(apps[i].slug);
    },
    [apps],
  );

  const close = useCallback(() => {
    setIndex(null);
    writeHash(null);
  }, []);

  const step = useCallback(
    (by: number) =>
      setIndex((current) => {
        if (current === null) return current;
        const next = (current + by + apps.length) % apps.length;
        writeHash(apps[next].slug);
        return next;
      }),
    [apps],
  );

  const prev = useCallback(() => step(-1), [step]);
  const next = useCallback(() => step(1), [step]);

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {apps.map((app, i) => (
          <li key={app.slug} className="reveal">
            <AppCard app={app} index={i} onSelect={() => open(i)} />
          </li>
        ))}
      </ul>

      <AppDetail
        app={index === null ? null : apps[index]}
        index={index ?? 0}
        total={apps.length}
        onClose={close}
        onPrev={prev}
        onNext={next}
      />
    </>
  );
}
