import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { PWAInstall } from "@/components/pwa-install"

export const metadata: Metadata = {
  title: "catadiGW",
  description: "Aplikasi pencatatan pengeluaran dan pemasukan uang yang elegan dan mudah digunakan",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["keuangan", "pencatatan", "pengeluaran", "pemasukan", "budget", "finance", "aplikasi keuangan", "catat keuangan"],
  authors: [{ name: "catatdiGW Team" }],
  creator: "catatdiGW Team",
  publisher: "catatdiGW",
  robots: "index, follow",
  metadataBase: new URL("https://catatdigw.gorillaworkout.id/"),
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://catatdigw.gorillaworkout.id/",
    siteName: "catatdiGW",
    title: "catadiGW",
    description: "Aplikasi pencatatan pengeluaran dan pemasukan uang yang elegan dan mudah digunakan",
    images: [
      {
        url: "/catatdigw.png",
        width: 192,
        height: 192,
        alt: "catatdiGW Logo",
        type: "image/png",
      },
      {
        url: "/catatdigw.webp",
        width: 192,
        height: 192,
        alt: "catatdiGW Logo",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "catadiGW",
    description: "Aplikasi pencatatan pengeluaran dan pemasukan uang yang elegan dan mudah digunakan",
    images: ["/catatdigw.png"],
    creator: "@catatdigw",
  },
  icons: {
    icon: [
      { url: "/catatdigw.png", sizes: "192x192", type: "image/png" },
      { url: "/catatdigw.webp", sizes: "192x192", type: "image/webp" },
      { url: "/catatdigw.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/catatdigw.png", sizes: "192x192", type: "image/png" },
      { url: "/catatdigw.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/catatdigw.png",
  },
  applicationName: "catatdiGW",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "catatdiGW",
  },
  formatDetection: {
    telephone: false,
  },
  verification: {
    google: "your-google-verification-code",
  },
}

export const viewport: Viewport = {
  minimumScale: 1,
  initialScale: 1,
  width: "device-width",
  viewportFit: "cover",
  themeColor: "#3b82f6",
  colorScheme: "dark",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="catatdiGW" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="catatdiGW" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#1f2937" />
        <meta name="msapplication-TileImage" content="/catatdigw.png" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* PWA Icons */}
        <link rel="apple-touch-icon" href="/catatdigw.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/catatdigw.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/catatdigw.png" />
        <link rel="icon" type="image/webp" sizes="192x192" href="/catatdigw.webp" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512x512.png" />
        <link rel="shortcut icon" href="/catatdigw.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preload critical assets */}
        <link rel="preload" href="/catatdigw.png" as="image" />
        <link rel="preload" href="/catatdigw.webp" as="image" />
        
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="dark" suppressHydrationWarning>
        {children}
        <PWAInstall />
      </body>
    </html>
  )
}
