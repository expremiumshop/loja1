import { Analytics } from "@vercel/analytics/next"

import type {
  Metadata,
  Viewport,
} from "next"

import Script from "next/script"

import { CartProvider } from "@/context/CartContext"

import { BottomNavigation } from "@/components/BottomNavigation"

import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://expremiumshop.com"
  ),

  title: {
    default: "EXPREMIUM SHOP",
    template: "%s | EXPREMIUM SHOP",
  },

  applicationName: "EXPREMIUM SHOP",

  description:
    "Discover quality products with exclusive offers on electronics, fashion, beauty, home, accessories and much more.",

  keywords: [
    "Expremium Shop",
    "Online Store",
    "Marketplace",
    "Electronics",
    "Fashion",
    "Beauty",
    "Home",
    "Accessories",
    "Shopping",
    "Mozambique",
    "South Africa",
    "International Store",
  ],

  authors: [
    {
      name: "EXPREMIUM SHOP",
    },
  ],

  creator: "EXPREMIUM SHOP",
  publisher: "EXPREMIUM SHOP",

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical:
      "https://expremiumshop.com",
  },

  openGraph: {
    title: "EXPREMIUM SHOP",

    description:
      "Premium online shopping with quality products and exclusive offers.",

    url: "https://expremiumshop.com",

    siteName: "EXPREMIUM SHOP",

    locale: "en_US",

    type: "website",

    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "EXPREMIUM SHOP",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "EXPREMIUM SHOP",

    description:
      "Premium online shopping with quality products and exclusive offers.",

    images: ["/og-image.jpg"],
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
      },

      {
        url: "/icon-32.png",
        sizes: "32x32",
        type: "image/png",
      },

      {
        url: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },

      {
        url: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],

    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",

  category: "shopping",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  colorScheme: "light",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt">
      <body>
        <CartProvider>

          {/* =================================================
              SCHEMA DO SITE
          ================================================= */}

          <Script
            id="website-schema"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context":
                  "https://schema.org",

                "@type": "WebSite",

                name: "EXPREMIUM SHOP",

                url: "https://expremiumshop.com",
              }),
            }}
          />

          {/* =================================================
              SCHEMA DA ORGANIZAÇÃO
          ================================================= */}

          <Script
            id="organization-schema"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context":
                  "https://schema.org",

                "@type":
                  "Organization",

                name: "EXPREMIUM SHOP",

                url: "https://expremiumshop.com",

                logo:
                  "https://expremiumshop.com/logo.png",
              }),
            }}
          />

          {/* =================================================
              CONTEÚDO DA APLICAÇÃO
          ================================================= */}

          {children}

          {/* =================================================
              NAVEGAÇÃO INFERIOR MOBILE
              
              FICA DISPONÍVEL EM TODA A LOJA
          ================================================= */}

          <BottomNavigation />

          {/* =================================================
              ANALYTICS
          ================================================= */}

          {process.env.NODE_ENV ===
            "production" && (
            <Analytics />
          )}

        </CartProvider>
      </body>
    </html>
  )
}