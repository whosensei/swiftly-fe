import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: `Swiftly`,
  description: `Supercharge your links`,
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@dipesshhhh',
    creator: '@dipesshhhh',
    title: `Swiftly`,
    description: `Supercharge your links`,  
    images: '/gradii-1200x630.png',
  },

  openGraph: {
    title: `Swiftly`,
    description: `Supercharge your links`,
    siteName: `Swiftly`,
    images: [
      {
        url: '/gradii-1200x630.png',
        width: 1200,
        height: 630,
        alt: `Swiftly - URL Shortener`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">

      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased h-full`}
      >
        <Analytics />
        {children}
      </body>
    </html>
  );
}
