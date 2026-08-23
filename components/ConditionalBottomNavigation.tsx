"use client"

import { usePathname } from "next/navigation"

import { BottomNavigation } from "@/components/BottomNavigation"

export function ConditionalBottomNavigation() {
  const pathname = usePathname()

  // =====================================================
  // NÃO MOSTRAR NO PAINEL ADMIN
  // =====================================================

  if (pathname.startsWith("/admin")) {
    return null
  }

  // =====================================================
  // MOSTRAR NA LOJA
  // =====================================================

  return <BottomNavigation />
}