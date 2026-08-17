/**
 * ─────────────────────────────────────────────────────────────
 *  YOUR PROJECT DATA — this is the only file you need to edit
 *  to add, remove, or reorder work on the site.
 *
 *  Everything below was pulled from your live Play Store listings.
 *  Fields marked  // ← EDIT  are ones only you can fill in
 *  accurately (your exact role, the stack, the outcome).
 * ─────────────────────────────────────────────────────────────
 */

export type App = {
  slug: string;
  name: string;
  tagline: string;
  client: string;
  domain: string;
  installs: string;
  storeUrl: string;
  screenshots: number;
  /** Two or three sentences: the problem, then what you built. */
  summary: string;
  /** Short, concrete capabilities. Keep to 3–5. */
  highlights: string[];
  /** Confirmed tech only — add yours. */
  stack: string[];
  /** Your role on the project. */ // ← EDIT
  role: string;
  /** Optional: a number worth bragging about. */ // ← EDIT
  metric?: string;
  featured?: boolean;
};

export const apps: App[] = [
  {
    slug: "officekit",
    name: "OfficeKit",
    tagline: "End-to-end HR management in your pocket",
    client: "M2H Infotech LLP",
    domain: "HR & Workforce",
    installs: "10,000+",
    storeUrl: "https://play.google.com/store/apps/details?id=com.officekit",
    screenshots: 5,
    summary:
      "The mobile companion to OfficeKit's HR platform. Employees check attendance, leave and travel reports and manage their own records, while department heads approve or reject requests from the same app — turning a desktop-bound HR workflow into something that runs from a phone.",
    highlights: [
      "Leave, attendance and travel approval flows",
      "Report views for employees and department heads",
      "Personal records, holidays and company news",
      "Role-aware UI — employees and approvers see different surfaces",
    ],
    stack: ["React Native", "REST API integration"], // ← EDIT: add your real stack
    role: "React Native Developer", // ← EDIT
    featured: true,
  },
  {
    slug: "hr-desk",
    name: "HR Desk",
    tagline: "HR self-service and approvals for a 10k+ user workforce",
    client: "LuLu Exchange",
    domain: "HR & Workforce",
    installs: "10,000+",
    storeUrl: "https://play.google.com/store/apps/details?id=com.hrdesk",
    screenshots: 5,
    summary:
      "A workforce app built for LuLu Exchange, one of the largest remittance networks in the Gulf. Staff pull attendance and leave reports and review their own records; managers action leave and attendance approvals inline. Shipped to a workforce of over ten thousand users.",
    highlights: [
      "Leave and attendance approvals for managers",
      "Self-service reports and personal information",
      "Organisation-wide holidays and news feed",
      "Built for an enterprise user base at scale",
    ],
    stack: ["React Native", "REST API integration"], // ← EDIT
    role: "React Native Developer", // ← EDIT
    featured: true,
  },
  {
    slug: "blend-ed",
    name: "Blend-ed Cloud",
    tagline: "Open edX learning, built for mobile",
    client: "Blended Edtech Pvt. Ltd.",
    domain: "EdTech",
    installs: "50+",
    storeUrl: "https://play.google.com/store/apps/details?id=com.blendedcloud",
    screenshots: 4,
    summary:
      "A mobile learning client for the Blend-ed platform, built on Open edX. Learners access enrolled courses, work through interactive lessons, video and quizzes, and keep progress in sync — so a course started on desktop continues on a phone without losing place.",
    highlights: [
      "Open edX platform integration",
      "In-app video lessons and quizzes",
      "Course progress synced across devices",
      "Clean, distraction-free learner navigation",
    ],
    stack: ["React Native", "Open edX APIs"],
    role: "React Native Developer", // ← EDIT
    featured: true,
  },
  {
    slug: "happilee",
    name: "Happilee",
    tagline: "WhatsApp marketing automation for growing businesses",
    client: "AppsKit",
    domain: "Business Messaging",
    installs: "1,000+",
    storeUrl: "https://play.google.com/store/apps/details?id=com.happilee",
    screenshots: 6,
    summary:
      "A WhatsApp marketing platform aimed at business owners and sales teams. Handles bulk broadcasts, automated replies and lead capture from one mobile surface, so a small sales team can keep response times low without sitting at a desk.",
    highlights: [
      "Unlimited broadcast campaigns",
      "Automated and instant chat replies",
      "Lead generation and customer engagement tools",
      "WhatsApp Business API integration",
    ],
    stack: ["React Native", "WhatsApp Business API"],
    role: "React Native Developer", // ← EDIT
    featured: true,
  },
  {
    slug: "urban-chat",
    name: "Urban Chat",
    tagline: "24/7 customer engagement over WhatsApp",
    client: "AppsKit",
    domain: "Business Messaging",
    installs: "500+",
    storeUrl:
      "https://play.google.com/store/apps/details?id=com.urbanchat.appskit",
    screenshots: 6,
    summary:
      "A WhatsApp-first sales and support tool. Businesses reply to every chat instantly, run unlimited broadcast campaigns and keep products available around the clock — built so a sales executive can run the whole channel from their phone.",
    highlights: [
      "Instant replies across all active chats",
      "Unlimited broadcast messaging",
      "Round-the-clock product availability",
      "Built for sales executives working mobile-first",
    ],
    stack: ["React Native", "WhatsApp Business API"],
    role: "React Native Developer", // ← EDIT
  },
  {
    slug: "school-plus",
    name: "School Plus",
    tagline: "Closing the loop between schools and parents",
    client: "M2H Infotech LLP",
    domain: "EdTech",
    installs: "10,000+",
    storeUrl:
      "https://play.google.com/store/apps/details?id=com.m2hinfotech.eschool",
    screenshots: 5,
    summary:
      "A school management app connecting students, teachers, parents and administration. Parents follow progress, exam schedules, results and events without waiting for a parent-teacher meeting; teachers push updates to every parent at once instead of one by one.",
    highlights: [
      "Parent-teacher communication channel",
      "Exam schedules, results and progress tracking",
      "Broadcast notifications for events and news",
      "Separate experiences for parents, teachers and admin",
    ],
    stack: ["React Native", "Push notifications"],
    role: "React Native Developer", // ← EDIT
  },
  {
    slug: "headcoach",
    name: "HeadCoach",
    tagline: "Mental performance training for competitive athletes",
    client: "HeadCoach",
    domain: "Health & Sport",
    installs: "100+",
    storeUrl:
      "https://play.google.com/store/apps/details?id=com.headcoachproject",
    screenshots: 6,
    summary:
      "A daily mental-training programme for competitive athletes, structured around eight performance skills. Athletes run a five-minute check-in, receive a performance strategy matched to the skill they're developing, then complete a guided reflection by text or voice after training.",
    highlights: [
      "Daily check-in and focus setting",
      "Structured post-training reflection — text or voice",
      "Programme built around eight performance skills",
      "Sport-specific guided review flows",
    ],
    stack: ["React Native", "Voice capture"],
    role: "React Native Developer", // ← EDIT
  },
  {
    slug: "bread-factory",
    name: "Bread Factory",
    tagline: "Online ordering for an 80-year-old bakery brand",
    client: "Azad Group India",
    domain: "Commerce",
    installs: "100+",
    storeUrl:
      "https://play.google.com/store/apps/details?id=com.anonymous.Azad",
    screenshots: 6,
    summary:
      "The official ordering app for Bread Factory, part of the Azad Group — a Thiruvananthapuram restaurant name with an eighty-year legacy. Customers browse freshly baked breads, cakes, pastries and desserts and order directly, bringing an established offline brand onto mobile.",
    highlights: [
      "Full product catalogue with categories",
      "Cart and checkout flow",
      "Built for a established regional F&B brand",
      "Ordering for bakery, cakes and desserts",
    ],
    stack: ["React Native", "Expo"],
    role: "React Native Developer", // ← EDIT
  },
  {
    slug: "al-dhikr",
    name: "Al Dhikr Academy",
    tagline: "Course delivery on Open edX, on the go",
    client: "Al Dhikr Academy",
    domain: "EdTech",
    installs: "50+",
    storeUrl: "https://play.google.com/store/apps/details?id=com.aldhikr.org",
    screenshots: 4,
    summary:
      "A branded mobile learning app for Al Dhikr Academy, built on Open edX. Learners access enrolled courses, interactive lessons, video and quizzes from their phone, with a navigation model kept deliberately simple for a non-technical audience.",
    highlights: [
      "Open edX platform integration",
      "Interactive lessons, video and quizzes",
      "Offline-friendly course navigation",
      "White-labelled for the academy's brand",
    ],
    stack: ["React Native", "Open edX APIs"],
    role: "React Native Developer", // ← EDIT
  },
];

export const featured = apps.filter((a) => a.featured);
export const domains = [...new Set(apps.map((a) => a.domain))];
