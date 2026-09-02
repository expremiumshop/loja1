"use client";

import Link from "next/link";

import {
  Store,
  Shield,
  Search,
} from "lucide-react";

export default function ConfiguracoesPage() {
  const sections = [
    {
      title: "Informações da Loja",
      description: "Nome, logo, contacto e dados principais da loja",
      icon: <Store size={28} />,
      link: "/admin/configuracoes/store",
    },

    {
      title: "SEO e Google",
      description: "Título, descrição, palavras-chave e otimização da loja",
      icon: <Search size={28} />,
      link: "/admin/configuracoes/seo",
    },

    {
      title: "Segurança",
      description: "Senha, sessões e proteção da conta",
      icon: <Shield size={28} />,
      link: "/admin/configuracoes/security",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-900">
          ⚙ Configurações
        </h1>

        <p className="mt-2 mb-8 text-gray-600">
          Controle completo da loja.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {sections.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="
                rounded-xl
                bg-white
                p-6
                shadow
                transition
                hover:shadow-xl
              "
            >
              <div
                className="
                  mb-4
                  w-fit
                  rounded-lg
                  bg-gray-100
                  p-3
                  text-gray-700
                "
              >
                {item.icon}
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                {item.title}
              </h2>

              <p className="mt-2 text-gray-600">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}