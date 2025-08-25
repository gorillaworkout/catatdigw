import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { PWAInstall } from "@/components/pwa-install"

export const metadata: Metadata = {
  title: "catatandiGW - Pencatatan Keuangan",
  description: "Aplikasi pencatatan pengeluaran dan pemasukan uang yang elegan dan mudah digunakan",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["keuangan", "pencatatan", "pengeluaran", "pemasukan", "budget", "finance"],
  authors: [{ name: "catatandiGW Team" }],
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-192x192.png",
  },
  viewport: "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  themeColor: "#3b82f6",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <head>
        <meta name="application-name" content="catatandiGW" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="catatandiGW" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#1f2937" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="dark">
        {children}
        <PWAInstall />
      </body>
    </html>
  )
}
