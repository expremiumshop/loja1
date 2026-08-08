"use client"

import {
  Star,
  Image as ImageIcon
} from "lucide-react"



export default function ReviewsSection(){



return (

<section

className="
bg-white
border
rounded-xl
p-6
space-y-6

"

>





{/* TITULO */}

<h2

className="
text-2xl
font-bold
text-gray-900

"

>

Avaliações do produto

</h2>









{/* RESUMO */}

<div

className="
grid

grid-cols-1

md:grid-cols-3

gap-6

"

>







{/* NOTA */}

<div

className="
border
rounded-xl
p-5
text-center

"

>


<p

className="
text-5xl
font-bold
text-orange-500

"

>

4.8

</p>



<div

className="
flex
justify-center
gap-1
my-3

"

>


{

[1,2,3,4,5].map(i=>(


<Star

key={i}

size={20}

fill="currentColor"

className="
text-orange-500

"

/>


))


}


</div>



<p

className="
text-sm
text-gray-500

"

>

Avaliação média

</p>


</div>









{/* BARRAS */}

<div

className="
md:col-span-2
space-y-3

"

>


{

[

"5 estrelas",

"4 estrelas",

"3 estrelas",

"2 estrelas",

"1 estrela"

].map((item,index)=>(


<div

key={item}

className="
flex
items-center
gap-3

"

>


<span

className="
w-20
text-sm

"

>

{item}

</span>



<div

className="
flex-1
h-3
bg-gray-200
rounded-full
overflow-hidden

"

>


<div

className="
h-full
bg-orange-500
rounded-full

"

style={{

width:

index===0

?

"85%"

:

"10%"

}}

/>



</div>



</div>



))


}



</div>





</div>









{/* COMENTÁRIOS */}

<div

className="
border-t
pt-5
space-y-4

"

>



<h3

className="
font-bold

"

>

Comentários dos clientes

</h3>




<div

className="
border
rounded-lg
p-4
text-gray-500
text-sm

"

>


Ainda não existem avaliações.

Quando clientes avaliarem este produto,
elas aparecerão aqui.


</div>



</div>









{/* FOTOS */}

<div

className="
border-t
pt-5

"

>


<div

className="
flex
items-center
gap-2
font-semibold

"

>

<ImageIcon size={20}/>


Fotos dos clientes


</div>


<div

className="
mt-4
grid
grid-cols-3
md:grid-cols-6
gap-3

"

>


{

[1,2,3,4,5,6].map(item=>(


<div

key={item}

className="
aspect-square
bg-gray-100
rounded-lg

"

/>


))


}


</div>


</div>





</section>


)

}