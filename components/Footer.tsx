'use client'

import { Mail, Camera, Share2, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function Footer() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setExpandedSection(
      expandedSection === section ? null : section
    )
  }

  const sections = [
    {
      title: 'COMPRAR',
      items: [
        { label: 'Todas as categorias', href: '/' },
        { label: 'Eletrónica', href: '/electronics' },
        { label: 'Moda', href: '/fashion' },
        { label: 'Beleza', href: '/beauty' },
        { label: 'Brinquedos', href: '/toys' },
        { label: 'Novidades', href: '/new' },
        { label: 'Ofertas', href: '/offers' },
      ],
    },
    {
      title: 'ATENDIMENTO',
      items: [
        { label: 'Central de ajuda', href: '/faq' },
        { label: 'Contacte-nos', href: '/contact' },
        { label: 'Como comprar', href: '/how-to-buy' },
        { label: 'Entregas', href: '/shipping' },
        { label: 'Devoluções e reembolsos', href: '/returns' },
        { label: 'Perguntas frequentes', href: '/faq' },
      ],
    },
    {
      title: 'SOBRE NÓS',
      items: [
        { label: 'Sobre nós', href: '/about' },
        { label: 'Como funciona', href: '/how-it-works' },
        { label: 'Trabalhe connosco', href: '/careers' },
        { label: 'Política de privacidade', href: '/privacy' },
        { label: 'Termos e condições', href: '/terms' },
      ],
    },
  ]

  return (
    <footer className="bg-foreground text-white">
      {/* =====================================================
          DESKTOP FOOTER
      ====================================================== */}

      <div className="hidden border-t border-white/10 md:block">
        <div className="mx-auto max-w-7xl px-6 py-12">

          <div className="mb-12 grid gap-8 md:grid-cols-5">

            {/* MARCA */}
            <div>
              <div className="mb-4">
                <h3 className="text-xl font-bold">
                  A NOSSA LOJA
                </h3>
              </div>

              <p className="text-sm leading-relaxed text-white/70">
                Encontre produtos de qualidade, boas ofertas e uma
                experiência de compra simples e segura.
              </p>

              <div className="mt-5 space-y-2 text-sm text-white/60">
                <p>🇲🇿 Loja online em Moçambique</p>
                <p>🚚 Entregas em várias regiões</p>
                <p>🔒 Compras seguras</p>
              </div>
            </div>

            {/* COMPRAR */}
            <div>
              <h4 className="mb-4 text-lg font-bold">
                COMPRAR
              </h4>

              <ul className="space-y-2">
                {sections[0].items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ATENDIMENTO */}
            <div>
              <h4 className="mb-4 text-lg font-bold">
                ATENDIMENTO
              </h4>

              <ul className="space-y-2">
                {sections[1].items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* SOBRE NÓS */}
            <div>
              <h4 className="mb-4 text-lg font-bold">
                SOBRE NÓS
              </h4>

              <ul className="space-y-2">
                {sections[2].items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* SIGA-NOS */}
            <div>
              <h4 className="mb-4 text-lg font-bold">
                SIGA-NOS
              </h4>

              <p className="mb-4 text-sm leading-relaxed text-white/60">
                Acompanhe a nossa loja nas redes sociais e fique
                por dentro das novidades e ofertas.
              </p>

              <div className="flex gap-3">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary"
                >
                  <Camera size={20} />
                </a>

                <a
                  href="#"
                  aria-label="Email"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary"
                >
                  <Mail size={20} />
                </a>

                <a
                  href="#"
                  aria-label="WhatsApp"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary"
                >
                  <MessageCircle size={20} />
                </a>

                <a
                  href="#"
                  aria-label="Partilhar"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary"
                >
                  <Share2 size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* PAGAMENTOS */}
          <div className="border-t border-white/10 py-6">
            <div className="flex flex-col items-center justify-between gap-5 md:flex-row">

              <p className="text-sm text-white/60">
                © 2026. Todos os direitos reservados.
              </p>

              <div className="flex flex-col items-center gap-3 md:flex-row">
                <span className="text-xs text-white/50">
                  Métodos de pagamento:
                </span>

                <div className="flex gap-2">
                  <div className="flex h-8 min-w-[55px] items-center justify-center rounded bg-white/10 px-2 text-xs font-bold">
                    M-Pesa
                  </div>

                  <div className="flex h-8 min-w-[55px] items-center justify-center rounded bg-white/10 px-2 text-xs font-bold">
                    e-Mola
                  </div>

                  <div className="flex h-8 min-w-[55px] items-center justify-center rounded bg-white/10 px-2 text-xs font-bold">
                    mKesh
                  </div>

                  <div className="flex h-8 w-10 items-center justify-center rounded bg-white/10 text-xs font-bold">
                    🏦
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-5 text-center text-xs text-white/40">
              Preços apresentados em Meticais (MZN)
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE FOOTER
      ====================================================== */}

      <div className="px-4 py-8 md:hidden">

        {/* MARCA */}
        <div className="mb-6">
          <div className="mb-4">
            <h3 className="font-bold">
              A NOSSA LOJA
            </h3>
          </div>

          <p className="text-xs leading-relaxed text-white/70">
            Encontre produtos de qualidade, boas ofertas e uma
            experiência de compra simples e segura.
          </p>

          <div className="mt-3 space-y-1 text-xs text-white/50">
            <p>🇲🇿 Loja online em Moçambique</p>
            <p>🚚 Entregas em várias regiões</p>
            <p>🔒 Compras seguras</p>
          </div>
        </div>

        {/* ACCORDION */}
        {sections.map((section) => (
          <div
            key={section.title}
            className="border-t border-white/10"
          >
            <button
              type="button"
              onClick={() => toggleSection(section.title)}
              className="flex w-full items-center justify-between py-4 transition-colors hover:bg-white/5"
            >
              <span className="text-sm font-semibold">
                {section.title}
              </span>

              <span
                className={`transition-transform ${
                  expandedSection === section.title
                    ? 'rotate-180'
                    : ''
                }`}
              >
                ▼
              </span>
            </button>

            {expandedSection === section.title && (
              <div className="space-y-2 pb-4">
                {section.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block pl-4 text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* PAGAMENTOS MOBILE */}
        <div className="border-t border-white/10 pt-6">
          <h4 className="mb-4 text-center text-sm font-semibold">
            MÉTODOS DE PAGAMENTO
          </h4>

          <div className="flex flex-wrap justify-center gap-2">
            <div className="rounded bg-white/10 px-3 py-2 text-xs font-bold">
              M-Pesa
            </div>

            <div className="rounded bg-white/10 px-3 py-2 text-xs font-bold">
              e-Mola
            </div>

            <div className="rounded bg-white/10 px-3 py-2 text-xs font-bold">
              mKesh
            </div>

            <div className="rounded bg-white/10 px-3 py-2 text-xs font-bold">
              🏦 Banco
            </div>
          </div>
        </div>

        {/* REDES SOCIAIS */}
        <div className="mt-6 border-t border-white/10 pt-6">

          <p className="mb-4 text-center text-xs text-white/50">
            SIGA A NOSSA LOJA
          </p>

          <div className="mb-5 flex justify-center gap-3">

            <a
              href="#"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary"
            >
              <Camera size={18} />
            </a>

            <a
              href="#"
              aria-label="Email"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary"
            >
              <Mail size={18} />
            </a>

            <a
              href="#"
              aria-label="WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary"
            >
              <MessageCircle size={18} />
            </a>

            <a
              href="#"
              aria-label="Partilhar"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary"
            >
              <Share2 size={18} />
            </a>

          </div>

          <p className="text-center text-xs text-white/40">
            © 2026. Todos os direitos reservados.
          </p>

          <p className="mt-2 text-center text-xs text-white/30">
            Compras online em Moçambique • Valores em MZN
          </p>

        </div>
      </div>
    </footer>
  )
}