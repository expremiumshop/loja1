"use client"

import Link from "next/link"
import { useState } from "react"
import { Upload, X, ImagePlus } from "lucide-react"


export default function NewProductPage(){

const [images,setImages] = useState<string[]>([])


function handleImages(e:any){

const files = Array.from(e.target.files)

files.forEach((file:any)=>{

const url = URL.createObjectURL(file)

setImages(prev=>[
...prev,
url
])

})

}



function removeImage(index:number){

setImages(
images.filter((_,i)=>i!==index)
)

}




return (

<div className="min-h-screen bg-gray-200 p-8 text-gray-900">


<div className="max-w-7xl mx-auto">



{/* HEADER */}

<div className="flex justify-between items-center mb-8">


<div>

<h1 className="text-3xl font-bold text-gray-900">
Adicionar Produto
</h1>


<p className="text-gray-700 mt-2">
Criar novo produto
</p>


</div>



<Link

href="/admin/products"

className="
bg-gray-900
text-white
px-5
py-3
rounded-lg
hover:bg-black
"

>

Voltar

</Link>


</div>










<div className="grid lg:grid-cols-3 gap-8">





{/* PRINCIPAL */}



<div className="lg:col-span-2 space-y-8">






<div className="
bg-white
rounded-xl
shadow
p-6
">


<h2 className="
text-xl
font-bold
text-gray-900
mb-6
">

Informações do Produto

</h2>





<label className="block font-semibold text-gray-800 mb-2">
Nome do produto
</label>


<input

placeholder="Ex: Smartphone Samsung"

className="
w-full
bg-white
border
border-gray-300
text-gray-900
rounded-lg
p-3
mb-5
"

/>







<label className="block font-semibold text-gray-800 mb-2">
Descrição
</label>


<textarea

rows={6}

placeholder="Descrição do produto"

className="
w-full
bg-white
border
border-gray-300
text-gray-900
rounded-lg
p-3
"

/>



</div>









{/* IMAGEM */}



<div className="
bg-white
rounded-xl
shadow
p-6
">


<h2 className="
text-xl
font-bold
text-gray-900
mb-6
">

Imagens do Produto

</h2>





<div className="
border-2
border-dashed
border-gray-400
rounded-xl
p-10
text-center
bg-gray-50
">


<ImagePlus

size={55}

className="
mx-auto
text-gray-500
mb-4
"

/>




<p className="
text-gray-700
mb-5
">

Adicionar imagens do produto

</p>






<label

className="
cursor-pointer
inline-flex
items-center
gap-2
bg-blue-600
hover:bg-blue-700
text-white
px-6
py-3
rounded-lg
font-semibold
"

>


<Upload size={20}/>

Adicionar imagem



<input

type="file"

multiple

accept="image/*"

onChange={handleImages}

className="hidden"

/>


</label>



</div>








<div className="
grid
grid-cols-3
gap-4
mt-6
">


{

images.map((img,index)=>(


<div
key={index}
className="relative"
>


<img

src={img}

className="
h-32
w-full
object-cover
rounded-lg
"

/>




<button

onClick={()=>removeImage(index)}

className="
absolute
top-2
right-2
bg-red-600
text-white
rounded-full
p-1
"

>

<X size={16}/>

</button>



</div>


))


}



</div>



</div>









{/* PREÇO */}



<div className="
bg-white
rounded-xl
shadow
p-6
">


<h2 className="
text-xl
font-bold
text-gray-900
mb-5
">

Preço

</h2>



<div className="grid md:grid-cols-2 gap-5">


<input

placeholder="Preço normal"

className="
border
border-gray-300
bg-white
text-gray-900
p-3
rounded-lg
"

/>




<input

placeholder="Preço promocional"

className="
border
border-gray-300
bg-white
text-gray-900
p-3
rounded-lg
"

/>


</div>



</div>




</div>









{/* LADO DIREITO */}



<div className="space-y-8">





<div className="
bg-white
rounded-xl
shadow
p-6
">


<h2 className="
text-xl
font-bold
text-gray-900
mb-5
">

Organização

</h2>




<label className="text-gray-800 font-semibold">
Categoria
</label>


<select

className="
w-full
mt-2
mb-5
border
border-gray-300
bg-white
text-gray-900
p-3
rounded-lg
"

>


<option>
Selecionar categoria
</option>

<option>
Eletrónicos
</option>

<option>
Moda
</option>

<option>
Casa
</option>

<option>
Beleza
</option>


</select>





<label className="text-gray-800 font-semibold">
Marca
</label>


<input

placeholder="Samsung"

className="
w-full
mt-2
border
border-gray-300
bg-white
text-gray-900
p-3
rounded-lg
"

/>



</div>









<div className="
bg-white
rounded-xl
shadow
p-6
">


<h2 className="
text-xl
font-bold
text-gray-900
mb-5
">

Inventário

</h2>



<input

placeholder="SKU"

className="
w-full
border
border-gray-300
bg-white
text-gray-900
p-3
rounded-lg
mb-4
"

/>




<input

placeholder="Quantidade"

type="number"

className="
w-full
border
border-gray-300
bg-white
text-gray-900
p-3
rounded-lg
"

/>



</div>








<div className="
bg-white
rounded-xl
shadow
p-6
">


<h2 className="
text-xl
font-bold
text-gray-900
mb-5
">

Status

</h2>



<select

className="
w-full
border
border-gray-300
bg-white
text-gray-900
p-3
rounded-lg
"

>

<option>
Ativo
</option>

<option>
Rascunho
</option>


</select>


</div>






</div>



</div>









<div className="
flex
gap-4
mt-8
">


<button

className="
bg-gray-700
hover:bg-gray-800
text-white
px-8
py-4
rounded-xl
font-bold
"

>

Salvar rascunho

</button>




<button

className="
bg-blue-600
hover:bg-blue-700
text-white
px-8
py-4
rounded-xl
font-bold
"

>

Publicar Produto

</button>



</div>





</div>

</div>


)

}