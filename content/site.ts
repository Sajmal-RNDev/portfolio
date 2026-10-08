/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONFIG — fill these in before you deploy.
 *  Every value marked  // ← EDIT  is a placeholder.
 * ─────────────────────────────────────────────────────────────
 */

export const site = {
  name: "Sajmal", // ← EDIT: your full name
  handle: "@sajmal", // ← EDIT: shown as the page's title line
  role: "Senior Mobile Developer",

  /** Short introduction for the portfolio and future profile views. */
  intro:
    "I'm a senior mobile developer building thoughtful React Native experiences, from the first architecture decision to the final store release.",
  introSecondary:
    "My work spans nine published apps across HR, learning, business messaging, sport and commerce. Available for contract and freelance projects.",

  /** The one line that does the most work on the whole site. */
  headline: "Thoughtfully built.\nReady for the real world.",

  /** Supporting line — who you help and what they get. */
  subhead:
    "Senior mobile developer specialising in React Native. I turn complex product ideas into considered mobile experiences, from architecture to store release.",

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
 * Work history. Only things that are actually true —
 * add roles here as they happen.
 */
export const work = [
  {
    title: "senior mobile developer",
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
