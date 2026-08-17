/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONFIG — fill these in before you deploy.
 *  Every value marked  // ← EDIT  is a placeholder.
 * ─────────────────────────────────────────────────────────────
 */

export const site = {
  name: "Sajmal", // ← EDIT: your full name
  handle: "@sajmal", // ← EDIT: shown as the page's title line
  role: "React Native Developer",

  /** Two short lines under the name. Lower case, plain, no pitch. */
  intro:
    "react native developer. i build cross-platform mobile apps and take them all the way to the store — architecture, delivery, submission, and the unglamorous parts in between.",
  introSecondary:
    "nine apps live on google play across HR, edtech, messaging and commerce — two of them serving workforces of 10,000+. available for contract and freelance work.",

  /** The one line that does the most work on the whole site. */
  headline: "I build and ship React Native apps that reach real users.",

  /** Supporting line — who you help and what they get. */
  subhead:
    "Nine apps live on Google Play across HR, edtech, messaging and commerce — including two serving workforces of 10,000+. Available for contract and freelance work.",

  /** Set to false when you're booked — it's the highest-signal element on the page. */
  available: true,
  availabilityText: "Available for new projects", // ← EDIT

  email: "sajmal.wa@gmail.com", // ← EDIT if you want a different contact address

  /** Shown as written; spaces are stripped for the tel: link. Empty hides it. */
  phone: "+91 96560 48073", // ← EDIT
  location: "Kerala, India", // ← EDIT

  /** Leave a value empty and the link disappears from the site. */
  links: {
    github: "", // ← EDIT e.g. "https://github.com/yourhandle"
    linkedin: "", // ← EDIT
    x: "", // ← EDIT
    /** A Cal.com or Calendly link converts far better than a form. */
    booking: "", // ← EDIT e.g. "https://cal.com/yourhandle/30min"
    resume: "", // ← EDIT e.g. "/resume.pdf" (drop the file in /public)
  },

  /** Domain you'll deploy to — used for SEO metadata. */
  url: "https://example.com", // ← EDIT
};

/**
 * The "work (gets paid)" rows. Only things that are actually true —
 * add roles here as they happen.
 */
export const work = [
  {
    title: "react native developer",
    meta: "freelance / contract",
    body: "building and shipping cross-platform apps for clients across HR, edtech, messaging and commerce — from empty repo through to store release.",
    href: "",
  },
]; // ← EDIT

export const services = [
  {
    title: "Build from zero",
    body: "Empty repo to App Store and Play Store. Architecture, delivery pipeline, store submission — you get a shipped app, not a prototype.",
  },
  {
    title: "Join an existing app",
    body: "Drop into a live React Native codebase and ship features without destabilising it. Comfortable inheriting code I didn't write.",
  },
  {
    title: "Fix and speed up",
    body: "Slow lists, janky animation, long cold starts, crash-rate problems. Diagnose the real bottleneck and fix it at the root.",
  },
  {
    title: "Cross-platform from web",
    body: "Take an existing web product to iOS and Android with a shared codebase, without shipping a wrapped website.",
  },
];

/**
 * ── TESTIMONIALS ──
 * Leave this array empty and the section won't render.
 * Message 2–3 past clients today: this is the single highest-trust
 * element on a freelance site, and replies take days to arrive.
 */
export const testimonials: {
  quote: string;
  name: string;
  title: string;
}[] = [
  // {
  //   quote: "Shipped ahead of schedule and handled the store submission end to end.",
  //   name: "Client Name",
  //   title: "CTO, Company",
  // },
];

export const skills = [
  "React Native",
  "TypeScript",
  "Expo",
  "JavaScript",
  "React Navigation",
  "Redux / State management",
  "REST APIs",
  "Push notifications",
  "Play Store & App Store release",
  "Native module integration",
]; // ← EDIT: trim anything you'd rather not be asked about in an interview
