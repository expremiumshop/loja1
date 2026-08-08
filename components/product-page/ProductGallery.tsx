"use client"

import Image from "next/image"
import { useState } from "react"



interface ProductGalleryProps {

  image:string | null

  name:string

}



export default function ProductGallery({

image,

name

}:ProductGalleryProps){



const images=[

image,

image,

image,

image,

].filter(Boolean) as string[]



const [activeImage,setActiveImage]=useState(
images[0]
)



return (


<div
className="
w-full
"
>


<div
className="
flex
flex-col
lg:flex-row
gap-5
"
>



{/* MINIATURAS */}

<div
className="
order-2
lg:order-1

flex
lg:flex-col

gap-3

overflow-auto
"
>


{
images.map((img,index)=>(


<button

key={index}

onClick={()=>setActiveImage(img)}

className={`

relative

w-20

h-20

rounded-lg

overflow-hidden

border-2

transition


${
activeImage===img

?

"border-red-500"

:

"border-gray-200"

}

`}

>


<Image

src={img}

alt={name}

fill

className="
object-cover
"

/>


</button>


))
}



</div>








{/* IMAGEM PRINCIPAL */}


<div
className="
order-1
lg:order-2

relative

w-full

aspect-square

rounded-xl

overflow-hidden

bg-white

group

"
>


<Image

src={activeImage}

alt={name}

fill

priority

className="
object-contain

transition

duration-500

group-hover:scale-110

"

/>


</div>





</div>







{/* INFORMAÇÃO EXTRA DA GALERIA */}

<div
className="
mt-5

flex

items-center

justify-between

text-sm

text-gray-500

"
>


<span>


</span>


<span>

</span>


</div>




</div>


)

}