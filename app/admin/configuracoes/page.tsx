"use client";

import Link from "next/link";

import {
  Store,
  Coins,
  CreditCard,
  Truck,
  Package,
  ShoppingCart,
  Users,
  Bell,
  Shield,
  UsersRound,
  Plug,
  Settings2,
  Megaphone,
  Globe,
  Search
} from "lucide-react";


export default function ConfiguracoesPage() {


const sections = [


{
title:"Informações da Loja",
description:"Nome, logo, contacto e dados principais da loja",
icon:<Store size={28}/>,
link:"/admin/configuracoes/store"
},


{
title:"Domínio",
description:"Conecte domínio personalizado, DNS e SSL da sua loja",
icon:<Globe size={28}/>,
link:"/admin/configuracoes/domain"
},


{
title:"SEO e Google",
description:"Título, descrição, palavras-chave e otimização da loja",
icon:<Search size={28}/>,
link:"/admin/configuracoes/seo"
},


{
title:"Moeda e Formatos",
description:"Moeda, preços e formatos de valores",
icon:<Coins size={28}/>,
link:"/admin/configuracoes/currency"
},


{
title:"Pagamentos",
description:"Configure métodos de pagamento e gateways",
icon:<CreditCard size={28}/>,
link:"/admin/configuracoes/payments"
},


{
title:"Entregas",
description:"Transportadoras, regiões e taxas de envio",
icon:<Truck size={28}/>,
link:"/admin/configuracoes/shipping"
},


{
title:"Produtos",
description:"Estoque, SKU e regras dos produtos",
icon:<Package size={28}/>,
link:"/admin/configuracoes/products"
},


{
title:"Checkout",
description:"Configure o processo de compra",
icon:<ShoppingCart size={28}/>,
link:"/admin/configuracoes/checkout"
},


{
title:"Clientes",
description:"Contas, grupos e permissões de clientes",
icon:<Users size={28}/>,
link:"/admin/configuracoes/customers"
},


{
title:"Notificações",
description:"Emails, alertas e mensagens automáticas",
icon:<Bell size={28}/>,
link:"/admin/configuracoes/notifications"
},


{
title:"Marketing",
description:"Pixels, SEO e integrações de marketing",
icon:<Megaphone size={28}/>,
link:"/admin/configuracoes/marketing"
},


{
title:"Segurança",
description:"Senha, sessões e proteção da conta",
icon:<Shield size={28}/>,
link:"/admin/configuracoes/security"
},


{
title:"Equipa",
description:"Administradores, funcionários e permissões",
icon:<UsersRound size={28}/>,
link:"/admin/configuracoes/team"
},


{
title:"Integrações",
description:"APIs, serviços externos e conexões",
icon:<Plug size={28}/>,
link:"/admin/configuracoes/integrations"
},


{
title:"Avançado",
description:"Backup, dados e configurações técnicas",
icon:<Settings2 size={28}/>,
link:"/admin/configuracoes/advanced"
}


];



return (

<main className="min-h-screen bg-gray-100 p-8">


<div className="max-w-7xl mx-auto">



<h1 className="text-3xl font-bold text-gray-900">
⚙ Configurações
</h1>


<p className="text-gray-600 mt-2 mb-8">
Controle completo da loja.
</p>




<div className="
grid
grid-cols-1
md:grid-cols-3
gap-6
">



{
sections.map((item,index)=>(


<Link

key={index}

href={item.link}

className="
bg-white
rounded-xl
shadow
p-6
hover:shadow-xl
transition
"


>


<div className="
bg-gray-100
text-gray-700
w-fit
p-3
rounded-lg
mb-4
">

{item.icon}

</div>




<h2 className="
text-xl
font-bold
text-gray-900
">

{item.title}

</h2>




<p className="
text-gray-600
mt-2
">

{item.description}

</p>



</Link>


))
}



</div>





</div>


</main>

);

}