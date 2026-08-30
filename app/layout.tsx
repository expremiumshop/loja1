import { Analytics } from "@vercel/analytics/next"

import type {
  Metadata,
  Viewport,
} from "next"

import Script from "next/script"

import { CartProvider } from "@/context/CartContext"
import { ConditionalBottomNavigation } from "@/components/ConditionalBottomNavigation"

import "./globals.css"

// =====================================================
// METADATA
// =====================================================

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://fochinetifashion.vercel.app/"
  ),

  title: {
    default: "FOCHINETI FASHION",
    template: "%s | FOCHINETI FASHION",
  },

  applicationName: "FOCHINETI FASHION",

  description:
    "A Fochineti Fashion é uma loja moçambicana dedicada à comercialização de produtos de qualidade, selecionados cuidadosamente para oferecer excelência, variedade e preços competitivos.",

  keywords: [
    "FOCHINETI FASHION",
    "Loja online",
    "Moda",
    "Roupas",
    "Calçados",
    "Acessórios",
    "Produtos de qualidade",
    "Compras online",
    "Moçambique",
    "África do Sul",
    "Tanzânia",
  ],

  authors: [
    {
      name: "FOCHINETI FASHION",
    },
  ],

  creator: "FOCHINETI FASHION",

  publisher: "FOCHINETI FASHION",

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
      "https://fochinetifashion.vercel.app/",
  },

  // =====================================================
  // OPEN GRAPH
  // =====================================================

  openGraph: {
    title: "FOCHINETI FASHION",

    description:
      "Qualidade, variedade e preços competitivos. Compre na Fochineti Fashion e receba os seus produtos em qualquer província de Moçambique.",

    url:
      "https://fochinetifashion.vercel.app/",

    siteName: "FOCHINETI FASHION",

    locale: "pt_MZ",

    type: "website",

    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FOCHINETI FASHION",
      },
    ],
  },

  // =====================================================
  // TWITTER
  // =====================================================

  twitter: {
    card: "summary_large_image",

    title: "FOCHINETI FASHION",

    description:
      "Qualidade, variedade e preços competitivos. Compre na Fochineti Fashion.",

    images: ["/og-image.jpg"],
  },

  // =====================================================
  // ÍCONES
  // =====================================================

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

// =====================================================
// VIEWPORT
// =====================================================

export const viewport: Viewport = {
  width: "device-width",

  initialScale: 1,

  themeColor: "#ffffff",

  colorScheme: "light",
}

// =====================================================
// ROOT LAYOUT
// =====================================================

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
                "@context": "https://schema.org",

                "@type": "WebSite",

                name: "FOCHINETI FASHION",

                url:
                  "https://fochinetifashion.vercel.app/",
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
                "@context": "https://schema.org",

                "@type": "Organization",

                name: "FOCHINETI FASHION",

                url:
                  "https://fochinetifashion.vercel.app/",

                logo:
                  "https://fochinetifashion.vercel.app/logo.png",

                description:
                  "Loja moçambicana dedicada à comercialização de produtos de qualidade, com fornecedores nacionais e internacionais.",
              }),
            }}
          />

          {/* =================================================
              CONTEÚDO DA APLICAÇÃO
              ================================================= */}

          {children}

          {/* =================================================
              NAVEGAÇÃO INFERIOR MOBILE

              APARECE NA LOJA
              NÃO APARECE NO /admin
              ================================================= */}

          <ConditionalBottomNavigation />

          {/* =================================================
              ANALYTICS
              ================================================= */}

          {process.env.NODE_ENV === "production" && (
            <Analytics />
          )}

        </CartProvider>
      </body>
    </html>
  )
}