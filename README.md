# Portfolio

Personal site for a React Native developer, positioned for freelance and contract work.
Next.js 16 (App Router) + Tailwind v4, statically exported — deploys free anywhere.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site → ./out
```

## The only two files you need to edit

| File | What's in it |
|---|---|
| [`content/site.ts`](content/site.ts) | Your name, email, links, availability, services, testimonials, skills |
| [`content/apps.ts`](content/apps.ts) | The nine projects — copy, stack, role, install counts |

Everything marked `// ← EDIT` is a placeholder. Nothing else needs touching to launch.

## Before you deploy — checklist

- [ ] **Name** — `site.name` is set to "Sajmal"; make it your full name
- [ ] **Social links** — `site.links.github` / `linkedin` / `x` are empty, so those icons don't render
- [ ] **Booking link** — add a [Cal.com](https://cal.com) URL to `site.links.booking`. A booking link converts noticeably better than an email address for freelance enquiries
- [ ] **Résumé** — drop `resume.pdf` in `public/` and set `site.links.resume = "/resume.pdf"`
- [ ] **`site.url`** — set to your real domain (drives OG tags and SEO)
- [ ] **Per-app `role` and `stack`** — I filled in what the store listings confirm. Add the real stack (state management, native modules, CI) for each
- [ ] **Testimonials** — `site.testimonials` is empty and the section hides itself. Message 2–3 past clients; this is the highest-trust element on the page and replies take days
- [ ] **`availabilityText`** — flip `site.available` to `false` when you're booked

## Deploy

```bash
npx vercel        # or: netlify deploy --prod --dir=out
```

Vercel auto-detects Next.js. Cloudflare Pages and Netlify both work too — the build
outputs a fully static `out/` directory, so any static host is fine.

## Notes on the build

- **Screenshots** — pulled from the live Play Store listings, resized to 620px wide
  and converted to WebP. 44MB of source PNGs → 1.9MB. Files live in `public/apps/<slug>/`.
- **No device bezels** — Play listings mix raw screen captures with marketing graphics
  that already contain a rendered phone, so a uniform frame would nest a phone inside
  a phone on half the set. Screenshots render as flat cards instead.
- **Avatar** — [`components/Avatar.tsx`](components/Avatar.tsx) is an animated inline
  SVG standing in for a photo. Replace the whole component with an `<img>` when you
  have a headshot.
- **Install counts** are Play Store bands ("10,000+"), and the hero's `30K+` is a
  conservative floor: three apps sit in the 10,000+ band, so the true total is higher.
- **Themes** — dark by default, light via the toggle, saved to `localStorage`.
  Both are defined in [`app/globals.css`](app/globals.css).
- **Ratings are not shown** — most of these listings don't publish a rating yet.

## Adding a project later

Append an object to the `apps` array in `content/apps.ts`, then drop
`icon.webp` and `1.webp … n.webp` into `public/apps/<slug>/` and set
`screenshots` to the count. No component changes needed.
