import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
  import { Analytics } from '@vercel/analytics/next'

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "AI ShellPanel - AI-Powered Shell Command Analysis & Explainer",
  description:
    "Understand any shell command with AI-powered explanations, safety warnings, and comprehensive documentation. Learn Linux commands, bash scripting, and terminal usage with instant AI assistance.",
  keywords: [
    "shell command explainer",
    "AI shell command analysis",
    "Linux command tutorial",
    "bash scripting help",
    "terminal command documentation",
    "shell command safety checker",
    "Linux command examples",
    "bash command breakdown",
    "AI programming assistant",
    "shell scripting guide",
    "command line tutorial",
    "Linux terminal help",
    "bash command explanation",
    "AI code analysis",
    "shell command documentation"
  ],
  authors: [{ name: "AI ShellPanel Team", url: "https://explainshell-prodapp.vercel.app/" }],
  creator: "AI ShellPanel",
  publisher: "AI ShellPanel",
  robots: "index, follow",
  openGraph: {
    title: "AI ShellPanel - AI-Powered Shell Command Analysis",
    description:
      "Understand any shell command with AI-powered explanations, safety warnings, and comprehensive documentation. Perfect for developers learning Linux commands.",
    url: "https://explainshell-prodapp.vercel.app/",
    siteName: "AI ShellPanel",
    images: [
      {
        url: "https://explainshell-prodapp.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI ShellPanel - Shell Command Analysis Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI ShellPanel - AI-Powered Shell Command Analysis",
    description:
      "Understand any shell command with AI-powered explanations, safety warnings, and comprehensive documentation.",
    images: ["https://explainshell-prodapp.vercel.app/og-image.png"],
    creator: "@shellpanel_ai",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://explainshell-prodapp.vercel.app",
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
  category: "technology",
  classification: "Development Tools",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "AI ShellPanel",
              description: "Understand any shell command with AI-powered explanations, safety warnings, and comprehensive documentation.",
              url: "https://explainshell-prodapp.vercel.app",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD"
              }
            })
          }}
        />
      </head>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
