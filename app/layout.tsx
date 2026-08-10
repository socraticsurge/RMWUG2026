import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://socraticsurge.github.io/RMWUG2026/"),
  title: "RMWUG 2026 · Research Methods by Vinay Chaganti",
  description:
    "The workshop operating system for 80 student-led, artifact-based Commerce research papers at St Mary's, Hyderabad.",
  openGraph: {
    title: "RMWUG 2026 · Eighty defensible studies",
    description: "One shared method, 80 individual papers, and peer-review pods.",
    url: "https://socraticsurge.github.io/RMWUG2026/",
    siteName: "RMWUG 2026",
    images: [{ url: "/RMWUG2026/og.png", width: 1200, height: 630 }],
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
