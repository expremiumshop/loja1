"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Package, ShoppingCart, Users, Megaphone, Palette, Settings } from "lucide-react"
import { supabase } from "@/lib/supabase"

const links = [
  ["/admin", "Dashboard", LayoutDashboard], ["/admin/products", "Produtos", Package],
  ["/admin/orders", "Pedidos", ShoppingCart], ["/admin/customers", "Clientes", Users],
  ["/admin/marketing", "Marketing", Megaphone], ["/admin/theme", "Personalizar Loja", Palette],
  ["/admin/configuracoes", "Configurações", Settings],
] as const

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    async function checkAccess() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.replace(`/login?next=${encodeURIComponent(pathname)}`)
      const { data } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle()
      if (!data) return router.replace("/")
      setAllowed(true)
    }
    checkAccess()
  }, [pathname, router])

  if (!allowed) return <main className="flex min-h-screen items-center justify-center bg-gray-100 text-gray-600">A verificar acesso...</main>

  return <div className="flex min-h-screen bg-gray-100"><aside className="w-64 bg-slate-900 p-6 text-white"><h1 className="mb-10 text-xl font-bold">PAINEL DE ADMINISTRAÇÃO</h1><nav className="space-y-3">{links.map(([href, label, Icon]) => <Link key={href} href={href} className="flex items-center gap-3 rounded-lg p-3 hover:bg-slate-800"><Icon size={20} />{label}</Link>)}</nav></aside><main className="flex-1 p-4 md:p-8">{children}</main></div>
}
