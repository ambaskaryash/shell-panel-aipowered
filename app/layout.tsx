import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import type React from "react"
import "./globals.css"

const SITE_NAME = "AI ShellPanel"
const SITE_URL = "https://shellpanel.novitaswebworks.in"
const OG_IMAGE = `${SITE_URL}/og-image.png`

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "AI ShellPanel - AI-Powered Shell Command Analysis & Explainer",
  description:
    "Understand any shell command with AI-powered explanations, safety warnings, and comprehensive documentation. Learn Linux commands, bash scripting, and terminal usage with instant AI assistance.",
  keywords: [
  "ai shell command explainer",
  "shell command analyzer",
  "linux command explanation",
  "bash command explanation",
  "command line explanation",
  "shell command safety checker",
  "terminal command analyzer",
  "bash scripting assistant",
  "linux command examples",
  "bash command breakdown",
  "explain shell command",
  "ai command line assistant",
  "ai code analysis for shell",
  "shell scripting guide",
  "command line learning",
  "linux terminal help",
  "bash scripting help",
  "command documentation generator",
  "explain bash flags",
  "safe to run command checker",
  "docker command explanation",
  "kubectl command explanation",
  "git command explanation",
  "zsh command explanation",
  "mac terminal command help",
  "windows command prompt help",
  "powershell command explanation",
  "sed awk grep explanation",
  "regex in shell commands",
  "piping and redirection explanation",
  "command security warnings",
  "copy-paste command safety",
],

  authors: [{ name: "AI ShellPanel Team", url: SITE_URL }],
  creator: "AI ShellPanel",
  publisher: "AI ShellPanel",
  robots: "index, follow",
  openGraph: {
    title: "AI ShellPanel - AI-Powered Shell Command Analysis",
    description:
      "Understand any shell command with AI-powered explanations, safety warnings, and comprehensive documentation. Perfect for developers learning Linux commands.",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: OG_IMAGE,
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
    images: [OG_IMAGE],
    creator: "@shellpanel_ai", // Update if different or remove if not in use
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: "google-site-verification-code", // replace
    yandex: "yandex-verification-code", // replace
  },
  category: "technology",
  classification: "Development Tools",
  generator: "v0.app",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          // WebApplication schema aligned with new domain
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "AI ShellPanel",
              description:
                "Understand any shell command with AI-powered explanations, safety warnings, and comprehensive documentation.",
              url: SITE_URL,
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              publisher: {
                "@type": "Organization",
                name: "AI ShellPanel",
                url: SITE_URL,
              },
            }),
          }}
        />
        {/* Optional: Basic Organization schema for richer branding */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "AI ShellPanel",
              url: SITE_URL,
              logo: `${SITE_URL}/logo.png`, // add this asset or remove this field
            }),
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
