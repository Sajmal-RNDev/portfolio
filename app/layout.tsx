import type { Metadata, Viewport } from "next";
import { site } from "@/content/site";
import "./globals.css";

const configuredUrl = site.url && !site.url.includes("example.com") ? site.url : undefined;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f5f6f2",
};

export const metadata: Metadata = {
  ...(configuredUrl ? { metadataBase: new URL(configuredUrl) } : {}),
  title: `${site.name} — ${site.role}`,
  description: site.subhead,
  keywords: ["Senior mobile developer", "React Native developer", "freelance mobile developer", "iOS Android app developer", "Expo developer", site.name],
  authors: [{ name: site.name }],
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.subhead,
    ...(configuredUrl ? { url: configuredUrl } : {}),
    siteName: site.name,
    type: "website",
  },
  twitter: { card: "summary", title: `${site.name} — ${site.role}`, description: site.subhead },
  robots: { index: true, follow: true },
};

const themeInit = `try { var t = localStorage.getItem('theme'); if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t); } catch (e) {}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeInit }} /></head><body>{children}</body></html>;
}
