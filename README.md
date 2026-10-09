# Sajmal — mobile developer portfolio

A portfolio website with mobile-style navigation and interactions, built with Next.js App Router, React, TypeScript, Tailwind CSS and Three.js. The experience sits inside a phone frame on desktop and fills the screen on mobile. It opens from a normal web link and exports to static files.

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

[`app/page.tsx`](app/page.tsx) renders [`components/mobile/PortfolioApp.tsx`](components/mobile/PortfolioApp.tsx), which owns the device shell, screen navigation, browser history and focus management. Each screen scrolls inside the app viewport; the page itself stays fixed. The `.device-shell` frame, simulated status bar and home indicator appear on desktop. On phones and touch tablets, the shell becomes edge to edge, respects all four safe-area insets, and follows the visual viewport as browser chrome or the keyboard changes. Wider touch layouts use bounded columns and a compact landscape dock; inputs retain 16px text and primary controls offer at least 44px touch targets. Regular phones show a rotate-to-portrait screen in landscape. Tablets, iPads, and detected Flip/Fold devices can use either orientation; browsers that withhold foldable information have a session-only “I’m using a foldable” option. Screen state and drafts survive rotation. An interrupted intro restarts after returning to portrait.

On the first visit in a browser session, [`LaunchIntro.tsx`](components/mobile/LaunchIntro.tsx) presents an original Burgundy iPhone 18 Pro Max model, turns it to the lock screen, then animates an upward swipe and a Face ID-style verification. The lock screen slides away to reveal the portrait among real project icons, with a 700 ms pause on the app screen before a 600 ms tap animation and portfolio opening. The animated sequence takes about 5 seconds after the device model, lighting environment, fallback images and recordings are ready. On a fresh visit, the rear view waits for a real tap on the phone or the “Tap to begin” button. That gesture enables both sounds before the flip; the flip, swipe, verification and portrait tap then run automatically. Replay runs automatically once audio is enabled. The 1.4-second turn uses a symmetric quintic easing curve with gentle acceleration and deceleration, and animation completion advances the sequence without a timer interrupting the flip. The final handoff waits for the rendered background fade, portfolio reveal, and phone/portrait animations to finish, then paints the revealed portfolio before removing the intro. Finished animation styles are retained until unmount to prevent a flash of the starting portrait. The verification is decorative and never requests camera or biometric access. Visitors can swipe upward or click the unlock prompt, tap the portrait after unlock, choose Skip intro, or press Escape. Starting a manual swipe pauses the automatic unlock until the gesture ends. The Home toolbar includes Replay intro. Direct links to another screen and reduced-motion preferences bypass the opening. Session storage is optional; blocked storage falls back to playing the intro on each visit. The portfolio stays inert during the opening, with focus moved into the active screen afterward.

The intro hardware is rendered by [`ThreePhone.tsx`](components/mobile/ThreePhone.tsx) using Three.js. [`phone3d/model.ts`](components/mobile/phone3d/model.ts) builds an original, editable model with a 77.98 × 163.43 × 8.75 mm body, based on [Apple’s accessory dimensional drawing](https://developer.apple.com/download/files/accessories/dimensional-drawings/iphone-18-pro-max.pdf). The enclosure and DOM display share an interpolated continuous corner profile, with a 2.56 mm display inset. Camera positions, 16.58 mm outer diameters, 2.78 mm plateau rise and 2.11 mm lens rise follow the drawing. Ultra-wide, main and telephoto optics have different internal geometry and coatings. Lens internals, panel finishes and small details remain visual reconstructions, not official manufacturing CAD. The camera deck and barrels project beyond the rear panel; the logo is a geometric inlay. Separate physical materials model anodized aluminum, satin rear glass, polished edges/logo, optical coatings and transmissive camera glass.

A local 1K studio HDR from Poly Haven is prefiltered with PMREM for material reflections; broad studio lights shape the highlights. ACES tone mapping and sRGB output keep the finishes consistent. The renderer follows the exact DOM phone pose and perspective every moving frame. The live lock screen and app UI stay accessible HTML beneath a depth-tested transparent screen opening; the front cover adds reflective glass, while camera glass refracts the modeled optics. The front cover does not optically refract HTML.

Three.js loads only when the intro runs. Rendering idles while the phone waits, the pixel ratio is capped at 1.5, and GPU resources are released on Skip or completion. A procedural studio environment covers a failed HDR request. Device photographs and the existing CSS hardware remain a fallback for unavailable WebGL or context loss. The first successful 3D render precedes hiding that fallback. Both intro and final desktop shell use Pro Max body proportions; the final fixed portfolio bezel uses the local front photograph. Sources and licences are recorded in [`public/device/CREDITS.txt`](public/device/CREDITS.txt).

The lock screen and status bars share [`useDeviceClock.ts`](components/mobile/useDeviceClock.ts), which reads the visitor's local system time, timezone and browser locale. It updates at minute boundaries, rolls the date over at midnight, and refreshes when returning to the page. [`useInterfaceSound.ts`](components/mobile/useInterfaceSound.ts) preloads [`public/audio/select-click-subtle.wav`](public/audio/select-click-subtle.wav) in a native audio player at full volume. A separate player handles [`public/audio/phone-flip-whisper.wav`](public/audio/phone-flip-whisper.wav), an original 780 ms filtered-noise whoosh whose swell peaks during the fast part of the rotation. Two 1.2 kHz low-pass stages soften the brighter hiss, and its RMS level is 22 dB below the original. Playback begins 380 ms into the 1.4-second turn, placing its swell at peak rotation speed; the recording and volume remain unchanged. The click comes from the owner-provided `Select1.wav`; its 48 kHz, 24-bit stereo recording has its RMS level reduced by 17 dB, with two 2.2 kHz low-pass stages and a 4 ms attack fade to soften the initial click. It retains a 100 ms silent lead-in for audio-device startup. The portrait animation starts playback 100 ms before its press keyframe, aligning the audible click with the press. The sound also plays on a manual portrait tap and when opening a project from Home or Work. The speaker button beside Skip intro tests it directly. To satisfy [browser autoplay policies](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay), the rear view waits for a first tap that primes both players before the phone flips. Playback continues if the visitor switches between the portfolio and another window; Skip and component cleanup stop both sounds immediately. Skip remains available, and unavailable audio never prevents entry. Blocked or cancelled clicks are never played late.

The original device photographs are stored locally under [`public/device/`](public/device/), as the static bezel and WebGL fallback. Sources, accessed October 8, 2026:

- [Apple Store Burgundy rear photograph](https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-18-pro-finish-select-burgundy-202609?wid=1880&hei=2224&fmt=p-jpg&qlt=90): `iphone-18-pro-burgundy-rear-source.jpg` (1880 × 2224). The body crop is x356/y461, 680 × 1422; a two-pixel inset excludes the white backdrop.
- [Apple product-viewer front photograph](https://www.apple.com/v/iphone-18-pro/c/images/overview/product-viewer/3d_viewer__hgotqf9hvvee_large_2x.jpg): `iphone-18-pro-burgundy-front-source.jpg` (2880 × 1520). The body crop is x1760/y225, 516 × 1075; the Dynamic Island crop is x1959/y260, 114 × 46.
- [Apple iPhone 18 Pro technical specifications](https://www.apple.com/iphone-18-pro/specs/): body dimensions and finish. Device imagery and trademarks belong to Apple.

The floating glass dock in [`BottomDock.tsx`](components/mobile/BottomDock.tsx) uses a sliding selection pill, labelled touch targets and pressed-state feedback. Its styles live in [`dock.css`](components/mobile/dock.css). The dock opens Home, Work, About and Contact at `#home`, `#work`, `#about` and `#contact`. Projects open at `#project/<slug>` with their own Back button, screenshot gallery, contribution details and Google Play link. Browser Back/Forward and direct hash links work. Pressing Escape returns from a project; opening a project moves keyboard focus to its title, and returning restores focus to its opener when available.

Tab screens stay mounted so their scroll position, Work search/filter, expanded About services and Contact draft survive switching tabs. These values are kept in memory and reset on reload. Selecting the current tab scrolls that screen to the top.

Shared design tokens, the shell, Home styling and entering/exiting screen animations live in [`app/globals.css`](app/globals.css). [`components/mobile/work.css`](components/mobile/work.css) styles Work and project details; [`components/mobile/personal.css`](components/mobile/personal.css) styles About and Contact. CSS and the native Web Animations API drive the motion, with Three.js following the hardware pose. Motion respects reduced-motion preferences. The intro reserves space for its controls and safe areas before sizing the entire phone. The opening measures the tapped icon, expands its surface with transforms, and carries a single portrait into the Home profile card using a uniform scale. The hardware also scales uniformly to fit inside the viewport, rather than stretching to the full-screen app’s aspect ratio. Resizing during the handoff finishes the coordinated reveal at the new layout. The phone, surface and portrait share an easing curve; the destination phone stays fixed during the crossfade. Early taps preserve the current phone pose. Replay resets Home to the top for a consistent portrait destination. The theme button on Home switches between light and dark and saves the choice in local storage when available.

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
- Three.js rear/side/front reflections, actual camera-bump silhouette, live screen alignment, first-render readiness, WebGL/context-loss fallback, and GPU cleanup after Replay/Skip.
- Desktop phone framing, portrait phones from 320px, allowed tablet/foldable landscape, and the on-screen keyboard. Verify the portrait prompt on ordinary phones, full-device visibility throughout the intro, safe-area spacing, rotation recovery, and preserved drafts/scroll positions. Device detection is a browser hint, not guaranteed hardware identification; verify on physical Safari/Android devices before publishing.
- All four tab routes and a direct project link such as `#project/officekit`; test project Back, Escape and browser Back/Forward.
- Work search, filters, empty results and screenshot controls; verify tab scroll positions and input state survive navigation.
- Keyboard navigation and visible focus; ensure inactive screens cannot receive focus.
- Both themes, theme persistence after reload and the system reduced-motion preference.
- Contact project selection, message retention across tabs, encoded email draft and clipboard feedback.

The Next.js configuration uses `output: "export"`, unoptimised local images and trailing slashes. Deploy the generated `out/` folder to a static host such as Cloudflare Pages or Netlify, or use a Next.js-aware provider such as Vercel. No backend or environment variables are required.
