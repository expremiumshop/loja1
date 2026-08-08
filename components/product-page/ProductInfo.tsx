"use client"

interface ProductInfoProps {

  product:any

}



export default function ProductInfo({

product

}:ProductInfoProps){



const discount = product.compare_at_price

?

Math.round(

(

(product.compare_at_price - product.price)

/

product.compare_at_price

)

*100

)

:

0




return (

<div

className="
space-y-5
"

>





{/* PREÇO */}

<div

className="
bg-gray-50
rounded-xl
p-5

"

>


<div

className="
flex
items-center
gap-3
flex-wrap

"

>


<span

className="
text-4xl
font-bold
text-red-600

"

>

€ {product.price}

</span>





{

product.compare_at_price &&

(

<span

className="
text-lg
text-gray-400
line-through

"

>

€ {product.compare_at_price}

</span>

)

}





{

discount > 0 &&

(

<span

className="
bg-red-600
text-white
px-3
py-1
rounded
font-semibold
text-sm

"

>

-{discount}%

</span>

)

}



</div>





<p

className="
mt-3
text-red-600
font-medium

"

>

🔥 Oferta especial por tempo limitado

</p>



</div>









{/* CUPOM */}

<div

className="
border
border-orange-200
bg-orange-50
rounded-lg
p-4
flex
justify-between
items-center

"

>


<div>


<p

className="
font-semibold
text-orange-700

"

>

Cupom EXPREMIUM

</p>



<p

className="
text-sm
text-gray-600

"

>

Economize nesta compra

</p>



</div>






<button

className="
bg-orange-500
text-white
px-4
py-2
rounded-lg
text-sm
font-semibold

"

>

Obter

</button>



</div>









{/* ESTOQUE */}

<div

className="
text-sm
text-gray-600

"

>


Restam


<span

className="
font-bold
text-red-600
mx-1

"

>

{product.stock}

</span>


unidades disponíveis



</div>







</div>


)

}