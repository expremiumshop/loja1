"use client"

import Link from "next/link"

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Megaphone,
  Palette,
  Settings
} from "lucide-react"


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {


return (

<div className="min-h-screen bg-gray-100 flex">


{/* MENU ADMIN */}

<aside className="
w-64
bg-slate-900
text-white
p-6
">


<h1 className="
text-xl
font-bold
mb-10
">
PAINEL DE ADMINISTRAÇÃO
</h1>



<nav className="space-y-3">



<Link
href="/admin"
className="
flex
items-center
gap-3
p-3
rounded-lg
hover:bg-slate-800
"
>

<LayoutDashboard size={20}/>

Dashboard

</Link>




<Link
href="/admin/products"
className="
flex
items-center
gap-3
p-3
rounded-lg
hover:bg-slate-800
"
>

<Package size={20}/>

Produtos

</Link>




<Link
href="/admin/orders"
className="
flex
items-center
gap-3
p-3
rounded-lg
hover:bg-slate-800
"
>

<ShoppingCart size={20}/>

Pedidos

</Link>




<Link
href="/admin/customers"
className="
flex
items-center
gap-3
p-3
rounded-lg
hover:bg-slate-800
"
>

<Users size={20}/>

Clientes

</Link>




<Link
href="/admin/marketing"
className="
flex
items-center
gap-3
p-3
rounded-lg
hover:bg-slate-800
"
>

<Megaphone size={20}/>

Marketing

</Link>





{/* PERSONALIZAR LOJA */}

<Link
href="/admin/theme"
className="
flex
items-center
gap-3
p-3
rounded-lg
hover:bg-slate-800
"
>

<Palette size={20}/>

Personalizar Loja

</Link>





{/* CONFIGURAÇÕES */}

<Link
href="/admin/configuracoes"
className="
flex
items-center
gap-3
p-3
rounded-lg
hover:bg-slate-800
"
>

<Settings size={20}/>

Configurações

</Link>




</nav>


</aside>





{/* CONTEÚDO */}

<main className="
flex-1
p-8
">


{children}


</main>



</div>


)

}