import Image from "next/image"
import Link from "next/link"



interface RelatedProductsProps {

products:any[]

}



export default function RelatedProducts({

products

}:RelatedProductsProps){



if(!products || products.length===0){

return null

}



return (

<section

className="
mt-10

"

>


<div

className="
flex
items-center
justify-between
mb-5

"

>


<h2

className="
text-2xl
font-bold
text-gray-900

"

>

Você também pode gostar

</h2>



<Link

href="/products"

className="
text-orange-600
font-semibold
text-sm

"

>

Ver todos

</Link>


</div>






<div

className="

grid

grid-cols-2

sm:grid-cols-3

lg:grid-cols-6

gap-4

"

>



{

products.map((item)=>(


<Link

key={item.id}

href={`/products/${item.slug}`}

className="

bg-white

rounded-xl

border

overflow-hidden

hover:shadow-lg

transition

"

>




{/* IMAGEM */}

<div

className="
relative

aspect-square

bg-gray-100

"

>


{

item.image &&

(

<Image

src={item.image}

alt={item.name}

fill

className="
object-cover

"

/>

)

}


</div>







<div

className="
p-3

"

>


<h3

className="
text-sm

font-medium

line-clamp-2

min-h-[40px]

"

>

{item.name}

</h3>







<div

className="
mt-3

flex

items-center

gap-2

"

>


<span

className="
text-red-600

font-bold

"

>

€

{item.price}

</span>




{

item.compare_at_price &&

(

<span

className="
text-xs

text-gray-400

line-through

"

>

€

{item.compare_at_price}

</span>

)

}


</div>







{

item.compare_at_price &&

(

<p

className="
text-xs

text-green-600

font-semibold

mt-1

"

>

Oferta disponível

</p>


)

}




</div>





</Link>



))

}



</div>



</section>


)

}