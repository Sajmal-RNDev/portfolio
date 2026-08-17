import type { Metadata } from "next";
import FloatingShapes from "@/components/FloatingShapes";
import ParticleLogo from "@/components/ParticleLogo";
import { site } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} — ${site.role}`,
  description: site.subhead,
  keywords: [
    "React Native developer",
    "freelance mobile developer",
    "iOS Android app developer",
    "Expo developer",
    site.name,
  ],
  authors: [{ name: site.name }],
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.subhead,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.subhead,
  },
  robots: { index: true, follow: true },
};

/** Applies the saved theme before first paint so there's no flash. */
const themeInit = `
try {
  var t = localStorage.getItem('theme');
  if (t) document.documentElement.setAttribute('data-theme', t);
} catch (e) {}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        {/* one continuous wash behind every section, so nothing seams */}
        <div className="page-bg" aria-hidden="true">
          <span className="orb orb-a" />
          <span className="orb orb-b" />
          <span className="orb orb-c" />
          <span className="stars" />
          {/* the react atom, which scatters as you scroll */}
          <ParticleLogo />
          {/* pointer + scroll reactive wireframe field */}
          <FloatingShapes />
        </div>
        {children}
      </body>
    </html>
  );
}
