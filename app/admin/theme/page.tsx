"use client"

import { useState } from "react"

import {
  Palette,
  Layout,
  Smartphone,
  Layers,
  Sparkles,
  Monitor,
  Tablet,
  ShoppingBag,
  Settings2
} from "lucide-react"


export default function ThemePage() {


const [device,setDevice] = useState("desktop")

const [primary,setPrimary] = useState("#00C896")
const [background,setBackground] = useState("#FFFFFF")
const [textColor,setTextColor] = useState("#111111")

const [radius,setRadius] = useState(20)


return (

<div className="min-h-screen bg-slate-100 p-6">


<h1 className="text-3xl font-bold text-slate-900 mb-2">
🎨 Personalizar Loja 
</h1>

<p className="text-slate-600 mb-8">
Construtor visual avançado da sua loja
</p>



<div className="grid grid-cols-12 gap-6">


{/* SIDEBAR */}

<div className="col-span-12 lg:col-span-3 bg-white rounded-2xl shadow p-5">


<h2 className="font-bold text-lg mb-5 text-slate-900">
Design System
</h2>



<Menu icon={<Palette/>} text="Identidade Visual"/>

<Menu icon={<Layers/>} text="Cartões"/>

<Menu icon={<Layout/>} text="Layout"/>

<Menu icon={<Smartphone/>} text="Mobile Builder"/>

<Menu icon={<Sparkles/>} text="IA Design"/>

<Menu icon={<Settings2/>} text="Configurações"/>



</div>





{/* CONFIGURAÇÃO */}


<div className="col-span-12 lg:col-span-4 space-y-6">


<div className="bg-white rounded-2xl shadow p-6">


<h2 className="font-bold text-xl text-slate-900 mb-5">
🎨 Aparência Geral
</h2>



<ColorInput
title="Cor principal"
value={primary}
setValue={setPrimary}
/>



<ColorInput
title="Fundo da loja"
value={background}
setValue={setBackground}
/>



<ColorInput
title="Texto principal"
value={textColor}
setValue={setTextColor}
/>



</div>






<div className="bg-white rounded-2xl shadow p-6">


<h2 className="font-bold text-xl text-slate-900 mb-5">
🃏 Cartões de Produto
</h2>



<label className="font-medium text-slate-800">
Arredondamento
</label>


<input

type="range"

min="0"

max="40"

value={radius}

onChange={(e)=>setRadius(Number(e.target.value))}

className="w-full mt-3"

/>


<p className="text-slate-700 mt-2">

{radius}px

</p>



<div className="grid grid-cols-2 gap-3 mt-5">


<button className="border rounded-lg p-3 text-slate-900 hover:bg-slate-100">

Quadrado

</button>



<button className="border rounded-lg p-3 text-slate-900 hover:bg-slate-100">

Premium

</button>



<button className="border rounded-lg p-3 text-slate-900 hover:bg-slate-100">

Cápsula

</button>



<button className="border rounded-lg p-3 text-slate-900 hover:bg-slate-100">

Suave

</button>



</div>


</div>






<div className="bg-white rounded-2xl shadow p-6">


<h2 className="font-bold text-xl text-slate-900">

🤖 Design com IA

</h2>


<button
className="mt-4 w-full py-3 rounded-xl text-white font-bold"

style={{
background:primary
}}

>

✨ Criar Loja com IA

</button>


</div>



</div>







{/* PREVIEW */}



<div className="col-span-12 lg:col-span-5">


<div className="bg-white rounded-2xl shadow p-5">


<div className="flex gap-3 mb-5">


<button
onClick={()=>setDevice("desktop")}
className="flex items-center gap-2 border px-4 py-2 rounded-lg text-slate-900">

<Monitor size={18}/>
Desktop

</button>


<button
onClick={()=>setDevice("tablet")}
className="flex items-center gap-2 border px-4 py-2 rounded-lg text-slate-900">

<Tablet size={18}/>
Tablet

</button>


<button
onClick={()=>setDevice("mobile")}
className="flex items-center gap-2 border px-4 py-2 rounded-lg text-slate-900">

<Smartphone size={18}/>
Mobile

</button>


</div>





<div

className="mx-auto border shadow-lg overflow-hidden"

style={{

background,

borderRadius:radius,

width:
device==="mobile"
?"320px"
:
device==="tablet"
?"500px"
:
"100%"

}}

>



<div
className="p-5 text-white font-bold"

style={{
background:primary
}}
>

GS-COMMERCE HUB

</div>



<div className="p-5">


<h2
className="text-2xl font-bold"

style={{
color:textColor
}}

>

Nova coleção

</h2>


<p
className="mt-2"

style={{
color:textColor
}}
>

Produtos premium para sua loja

</p>





<div className="grid grid-cols-2 gap-4 mt-6">


<ProductCard radius={radius}/>

<ProductCard radius={radius}/>



</div>



</div>


</div>


</div>


</div>



</div>



</div>


)

}




function Menu({icon,text}:any){

return (

<div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 cursor-pointer text-slate-800">

{icon}

<span>
{text}
</span>


</div>

)

}





function ColorInput({title,value,setValue}:any){

return (

<div className="mb-5">


<label className="block text-slate-800 font-medium mb-2">

{title}

</label>


<div className="flex gap-3">


<input

type="color"

value={value}

onChange={(e)=>setValue(e.target.value)}

className="w-12 h-10"

/>


<input

value={value}

onChange={(e)=>setValue(e.target.value)}

className="border rounded-lg px-3 py-2 w-full text-slate-900"

/>


</div>


</div>


)

}





function ProductCard({radius}:any){

return (

<div

className="bg-white shadow p-4 border"

style={{

borderRadius:radius

}}

>


<div className="h-20 bg-slate-200 rounded-lg mb-3">

</div>


<h3 className="font-bold text-slate-900">

Produto Premium

</h3>


<p className="text-red-500 font-bold">

999 MZN

</p>


<button className="mt-3 w-full bg-black text-white rounded-lg py-2">

Comprar

</button>


</div>


)

}