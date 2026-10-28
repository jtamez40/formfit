import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://satinchef.com"),
  title: {
    default: "Satin Chef | Satin-Lined Cooking Caps",
    template: "%s | Satin Chef",
  },
  description:
    "Stay comfortable in the kitchen with Satin Chef's satin-lined cooking caps. Designed to protect your hair while keeping you cool and comfortable during every shift.",
  applicationName: "Satin Chef",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Satin Chef | Satin-Lined Cooking Caps",
    description:
      "Stay comfortable in the kitchen with Satin Chef's satin-lined cooking caps. Designed to protect your hair while keeping you cool and comfortable during every shift.",
    url: "https://satinchef.com",
    siteName: "Satin Chef",
    images: [
      {
        url: "/products/satinLined.jpeg",
        width: 2048,
        height: 2048,
        alt: "Satin Chef Satin-Lined Cooking Cap",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Satin Chef | Satin-Lined Cooking Caps",
    description:
      "Stay comfortable in the kitchen with Satin Chef's satin-lined cooking caps. Designed to protect your hair while keeping you cool and comfortable during every shift.",
    images: ["/products/satinLined.jpeg"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  other: {
    "codex-preview": "development",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
