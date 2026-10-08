# Sajmal — mobile developer portfolio

A portfolio website with mobile-style navigation and interactions, built with Next.js App Router, React, TypeScript and Tailwind CSS. The experience sits inside a phone frame on desktop and fills the screen on mobile. It opens from a normal web link and exports to static files.

## Local development

```bash
npm install
npm run dev       # http://localhost:3000
npm run check     # TypeScript validation
npm run build     # production build and static export to ./out
npm run start     # serve the exported site on port 3000
```

Run `build` before `start`. The start command uses the `serve` static file server through npm.

## Content

| File | Content |
| --- | --- |
| [`content/site.ts`](content/site.ts) | Name, role, introduction, contact details, availability, services and skills |
| [`content/apps.ts`](content/apps.ts) | Nine projects, descriptions, stack, roles, install bands and Google Play links |
| [`components/mobile/HomeScreen.tsx`](components/mobile/HomeScreen.tsx) | Home introduction, app launcher and featured project |
| [`components/mobile/AboutScreen.tsx`](components/mobile/AboutScreen.tsx) | About copy, service presentation and process |
| [`public/portrait.webp`](public/portrait.webp) | Profile portrait |
| `public/apps/<slug>/` | Each app's `icon.webp` and numbered screenshots |

Keep project contributions and technology choices accurate when updating the content. Install figures are Google Play download bands, not active-user counts. These numbers are not refreshed automatically.

To add an app, append its record to `content/apps.ts`, create its asset directory under `public/apps/`, and set `screenshots` to the number of images. Empty optional profile links are hidden.

## Design and interaction

[`app/page.tsx`](app/page.tsx) renders [`components/mobile/PortfolioApp.tsx`](components/mobile/PortfolioApp.tsx), which owns the device shell, screen navigation, browser history and focus management. Each screen scrolls inside the app viewport; the page itself stays fixed. The `.device-shell` frame, simulated status bar and home indicator appear on desktop. On mobile, the shell becomes edge to edge and respects safe areas.

On the first visit in a browser session, [`LaunchIntro.tsx`](components/mobile/LaunchIntro.tsx) presents the Burgundy iPhone 18 Pro rear, turns it to the lock screen, then animates an upward swipe and a Face ID-style verification. The lock screen slides away to reveal the portrait among real project icons, followed immediately by the tap and portfolio opening. The animated sequence takes about 4.5 seconds after the device images and tap recording decode. On a fresh visit, the rear view waits for a real tap on the phone or the “Tap to begin” button. That gesture enables both sounds before the flip; the flip, swipe, verification and portrait tap then run automatically. Replay runs automatically once audio is enabled. The turn uses a single easing curve, and animation completion advances the sequence without a timer interrupting the flip. The final handoff waits for the rendered background fade, portfolio reveal, and phone/portrait animations to finish, then paints the revealed portfolio before removing the intro. Finished animation styles are retained until unmount to prevent a flash of the starting portrait. The verification is decorative and never requests camera or biometric access. Visitors can swipe upward or click the unlock prompt, tap the portrait after unlock, choose Skip intro, or press Escape. Starting a manual swipe pauses the automatic unlock until the gesture ends. The Home toolbar includes Replay intro. Direct links to another screen and reduced-motion preferences bypass the opening. Session storage is optional; blocked storage falls back to playing the intro on each visit. The portfolio stays inert during the opening, with focus moved into the active screen afterward.

Device artwork and launch motion live in [`launch.css`](components/mobile/launch.css). [`PhoneBack.tsx`](components/mobile/PhoneBack.tsx) and [`phone-back.css`](components/mobile/phone-back.css) crop Apple's original rear photograph, preserving the real cameras and Apple logo. [`PhoneEdges.tsx`](components/mobile/PhoneEdges.tsx) joins the front and rear with CSS metal walls during rotation. Both the intro and desktop portfolio shell use the same photographed front bezel. The model follows Apple's published 71.9 × 150 × 8.75 mm body dimensions; the intermediate side walls are a CSS approximation.

The lock screen and status bars share [`useDeviceClock.ts`](components/mobile/useDeviceClock.ts), which reads the visitor's local system time, timezone and browser locale. It updates at minute boundaries, rolls the date over at midnight, and refreshes when returning to the page. [`useInterfaceSound.ts`](components/mobile/useInterfaceSound.ts) preloads [`public/audio/select-click-subtle.wav`](public/audio/select-click-subtle.wav) in a native audio player at full volume. A separate player handles [`public/audio/phone-flip-whisper.wav`](public/audio/phone-flip-whisper.wav), an original 780 ms filtered-noise whoosh whose swell peaks during the fast part of the rotation. Two 1.2 kHz low-pass stages soften the brighter hiss, and its RMS level is 22 dB below the original. Its duration and swell timing remain unchanged. The click comes from the owner-provided `Select1.wav`; its 48 kHz, 24-bit stereo recording has its RMS level reduced by 17 dB, with two 2.2 kHz low-pass stages and a 4 ms attack fade to soften the initial click. It retains a 100 ms silent lead-in for audio-device startup. The portrait animation starts playback 100 ms before its press keyframe, aligning the audible click with the press. The sound also plays on a manual portrait tap and when opening a project from Home or Work. The speaker button beside Skip intro tests it directly. To satisfy [browser autoplay policies](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay), the rear view waits for a first tap that primes both players before the phone flips. Playback continues if the visitor switches between the portfolio and another window; Skip and component cleanup stop both sounds immediately. Skip remains available, and unavailable audio never prevents entry. Blocked or cancelled clicks are never played late.

The original device photographs are stored locally under [`public/device/`](public/device/), with CSS cropping rather than image regeneration. Sources, accessed October 8, 2026:

- [Apple Store Burgundy rear photograph](https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-18-pro-finish-select-burgundy-202609?wid=1880&hei=2224&fmt=p-jpg&qlt=90): `iphone-18-pro-burgundy-rear-source.jpg` (1880 × 2224). The body crop is x356/y461, 680 × 1422; a two-pixel inset excludes the white backdrop.
- [Apple product-viewer front photograph](https://www.apple.com/v/iphone-18-pro/c/images/overview/product-viewer/3d_viewer__hgotqf9hvvee_large_2x.jpg): `iphone-18-pro-burgundy-front-source.jpg` (2880 × 1520). The body crop is x1760/y225, 516 × 1075; the Dynamic Island crop is x1959/y260, 114 × 46.
- [Apple iPhone 18 Pro technical specifications](https://www.apple.com/iphone-18-pro/specs/): body dimensions and finish. Device imagery and trademarks belong to Apple.

The floating glass dock in [`BottomDock.tsx`](components/mobile/BottomDock.tsx) uses a sliding selection pill, labelled touch targets and pressed-state feedback. Its styles live in [`dock.css`](components/mobile/dock.css). The dock opens Home, Work, About and Contact at `#home`, `#work`, `#about` and `#contact`. Projects open at `#project/<slug>` with their own Back button, screenshot gallery, contribution details and Google Play link. Browser Back/Forward and direct hash links work. Pressing Escape returns from a project; opening a project moves keyboard focus to its title, and returning restores focus to its opener when available.

Tab screens stay mounted so their scroll position, Work search/filter, expanded About services and Contact draft survive switching tabs. These values are kept in memory and reset on reload. Selecting the current tab scrolls that screen to the top.

Shared design tokens, the shell, Home styling and entering/exiting screen animations live in [`app/globals.css`](app/globals.css). [`components/mobile/work.css`](components/mobile/work.css) styles Work and project details; [`components/mobile/personal.css`](components/mobile/personal.css) styles About and Contact. CSS and the native Web Animations API provide the motion without an animation library and respect reduced-motion preferences. The opening measures the tapped icon, expands its surface with transforms, and carries a single portrait into the Home profile card using a uniform scale. The phone, surface and portrait share an easing curve; the destination phone stays fixed during the crossfade. Early taps preserve the current phone pose. Replay resets Home to the top for a consistent portrait destination. The theme button on Home switches between light and dark and saves the choice in local storage when available.

The Contact composer creates an encoded `mailto:` draft in the visitor's email client. It does not send a message or use a form backend. Email, phone, booking and profile links come from `content/site.ts`; optional links only appear when configured.

Store images include both raw app captures and promotional artwork. Preserve their original framing when adding images so an existing device mockup is not placed inside another device frame.

## Personalise before publishing

- Confirm the name, email, phone number, location and project availability in `content/site.ts`.
- Replace `site.url` with the production domain; it is used by metadata and sharing links.
- Add genuine GitHub, LinkedIn, booking or résumé links as needed. For a local résumé, place the PDF in `public/` and set `site.links.resume` to its path.
- Check each project's role, technology stack, descriptions and current install band against your own contributions and store listings.

## Validation and deployment

Run `npm run check` and `npm run build` after changes. For interface changes, check:

- First-visit rear view, flip, swipe, verification and app-grid sequence; manual swipe/short-swipe recovery; automatic tap, manual portrait tap, Skip, Escape, Replay and session persistence; ensure direct links and reduced motion bypass the intro.
- Local clock/date, minute and midnight rollover, and returning from a background tab; verify the first rear view waits for interaction, then plays one flip whoosh and one portrait click; verify automatic Replay, sound continuity when changing tabs, and immediate cancellation after Skip. Under CPU throttling or a delayed opening animation, verify the intro remains until the actual reveal finishes and Skip/Escape still completes immediately.
- Desktop phone framing and edge-to-edge mobile at 320px and wider, including landscape and the on-screen keyboard.
- All four tab routes and a direct project link such as `#project/officekit`; test project Back, Escape and browser Back/Forward.
- Work search, filters, empty results and screenshot controls; verify tab scroll positions and input state survive navigation.
- Keyboard navigation and visible focus; ensure inactive screens cannot receive focus.
- Both themes, theme persistence after reload and the system reduced-motion preference.
- Contact project selection, message retention across tabs, encoded email draft and clipboard feedback.

The Next.js configuration uses `output: "export"`, unoptimised local images and trailing slashes. Deploy the generated `out/` folder to a static host such as Cloudflare Pages or Netlify, or use a Next.js-aware provider such as Vercel. No backend or environment variables are required.
