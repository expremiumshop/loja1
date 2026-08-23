"use client"

import Link from "next/link"

const categories = [
  {
    name: "Eletrónicos",
    slug: "eletronicos",
  },
  {
    name: "Casa e Jardim",
    slug: "casa-e-jardim",
  },
  {
    name: "Moda",
    slug: "moda",
  },
  {
    name: "Beleza",
    slug: "beleza",
  },
  {
    name: "Desporto",
    slug: "desporto",
  },
  {
    name: "Acessórios",
    slug: "acessorios",
  },
]

export function CategoryMenu() {
  return (
    <nav className="w-full border-t bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-4 py-3">
        <Link
          href="/products"
          className="shrink-0 font-medium text-gray-900 hover:text-emerald-600"
        >
          Todas as categorias
        </Link>

        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="shrink-0 text-sm text-gray-600 transition hover:text-emerald-600"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default CategoryMenu