import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { DM_Sans } from "next/font/google"
import type React from "react"
import "./globals.css"

const SITE_NAME = "AI ShellPanel"
const SITE_URL = "https://shellpanel.novitaswebworks.in"

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AI ShellPanel — Explain Any Shell Command Safely",
    template: "%s | AI ShellPanel",
  },
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
  creator: SITE_NAME,
  publisher: SITE_NAME,
  // Strengthened robots for Google; use a "noindex" switch for staging when needed
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "AI ShellPanel - AI-Powered Shell Command Analysis",
    description:
      "Understand any shell command with AI-powered explanations, safety warnings, and comprehensive documentation. Perfect for developers learning Linux commands.",
    url: "/",
    siteName: SITE_NAME,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI ShellPanel - Shell Command Analysis Tool",
      },
      // Optional fallback for platforms that prefer 1024×512
      {
        url: "/og-image-1024x512.png",
        width: 1024,
        height: 512,
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
    images: ["/og-image.png", "/og-image-1024x512.png"],
    creator: "@shellpanel_ai", // Update or remove if not used
  },
  // Light/dark theme color helps mobile UI and SERP theming
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0c" },
  ],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "/", // resolves via metadataBase to SITE_URL
  },
  verification: {
    google: "google-site-verification-code", // replace
    yandex: "yandex-verification-code", // replace
  },
  category: "technology",
  classification: "Development Tools"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${dmSans.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Performance hints */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Preload hero/OG if above the fold (optional; safe to remove if not needed) */}
        <link rel="preload" as="image" href="/og-image.png" />
        {/* Security/Privacy tweaks */}
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Permissions-Policy" content="interest-cohort=()" />
        {/* WebApplication schema aligned with new domain */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: SITE_NAME,
              description:
                "Understand any shell command with AI-powered explanations, safety warnings, and comprehensive documentation.",
              url: SITE_URL,
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "INR",
              },
              publisher: {
                "@type": "Organization",
                name: SITE_NAME,
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
              name: SITE_NAME,
              url: SITE_URL,
              logo: `${SITE_URL}/logo.png`, // add asset or remove
            }),
          }}
        />
        {/* Optional: FAQ schema — add when you include an FAQ section on the page
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Is it safe to run a command copied from the internet?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Not always. Commands may delete files, exfiltrate data, or escalate privileges. Use a safety checker and run in a sandbox or container first."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How do I understand bash flags like -r, -f, -v?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Flags modify behavior (e.g., -r recursive, -f force, -v verbose). Our explainer identifies flags and clarifies effects with examples."
                  }
                }
              ]
            }),
          }}
        /> */}
      </head>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        {/* Defer heavy work; keep interaction responsive */}
        <Analytics />
      </body>
    </html>
  )
}
