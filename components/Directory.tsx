"use client";

import { useState } from "react";

export type Row = {
  title: string;
  /** right-hand meta: tag, year, install count — whatever fits */
  meta?: string;
  body?: string;
  href?: string;
};

export type Group = {
  /** filter key, also the tab label */
  key: string;
  /** section heading, e.g. "apps (live on google play)" */
  label: string;
  rows: Row[];
};

function Item({ row }: { row: Row }) {
  const title = row.href ? (
    <a
      href={row.href}
      target={row.href.startsWith("http") ? "_blank" : undefined}
      rel={row.href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
    >
      {row.title}
    </a>
  ) : (
    row.title
  );

  return (
    <li>
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-medium">{title}</span>
        {row.meta && (
          <span className="shrink-0 font-mono text-xs text-faint">
            {row.meta}
          </span>
        )}
      </div>
      {row.body && (
        <p className="mt-1 text-sm leading-relaxed text-muted">{row.body}</p>
      )}
    </li>
  );
}

export default function Directory({ groups }: { groups: Group[] }) {
  const [filter, setFilter] = useState("all");
  const shown = filter === "all" ? groups : groups.filter((g) => g.key === filter);
  const tabs = ["all", ...groups.map((g) => g.key)];

  return (
    <>
      <div className="mt-12 flex items-baseline justify-between gap-4 border-b border-line pb-2">
        <h2 className="text-lg font-semibold">{filter}</h2>
        <nav className="flex gap-3 font-mono text-xs">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilter(t)}
              aria-current={t === filter ? "true" : undefined}
              className={
                t === filter
                  ? "text-text"
                  : "text-faint transition-colors hover:text-muted"
              }
            >
              {t}
            </button>
          ))}
        </nav>
      </div>

      {shown.map((g) => (
        <section key={g.key} className="mt-9">
          <h3 className="text-sm font-medium text-muted">{g.label}</h3>
          <ul className="mt-4 space-y-5">
            {g.rows.map((row) => (
              <Item key={row.title} row={row} />
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
