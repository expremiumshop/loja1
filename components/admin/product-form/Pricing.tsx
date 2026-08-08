"use client"


interface PricingProps {

price:string
setPrice:(value:string)=>void

comparePrice:string
setComparePrice:(value:string)=>void

cost:string
setCost:(value:string)=>void

currency:string
setCurrency:(value:string)=>void

}



export default function Pricing({

price,
setPrice,

comparePrice,
setComparePrice,

cost,
setCost,

currency,
setCurrency

}:PricingProps){



const profit =

price && cost

?

Number(price) - Number(cost)

:

0





return (

<div className="
bg-white
rounded-xl
shadow
p-6
space-y-6
">


<h2 className="
text-xl
font-bold
">

Preço

</h2>





<div className="
grid
md:grid-cols-2
gap-5
">



<div>

<label className="
font-semibold
">

Preço de venda

</label>


<input

type="number"

value={price}

onChange={(e)=>setPrice(e.target.value)}

placeholder="32"

className="
w-full
border
rounded-lg
p-3
mt-2
"

/>


</div>







<div>

<label className="
font-semibold
">

Preço comparativo

</label>


<input

type="number"

value={comparePrice}

onChange={(e)=>setComparePrice(e.target.value)}

placeholder="49"

className="
w-full
border
rounded-lg
p-3
mt-2
"

/>


<p className="
text-xs
text-gray-500
mt-1
">

Preço antigo para mostrar desconto

</p>


</div>





</div>








<div className="
grid
md:grid-cols-2
gap-5
">





<div>

<label className="
font-semibold
">

Custo do produto

</label>


<input

type="number"

value={cost}

onChange={(e)=>setCost(e.target.value)}

placeholder="Quanto pagou pelo produto"

className="
w-full
border
rounded-lg
p-3
mt-2
"

/>


</div>







<div>

<label className="
font-semibold
">

Moeda

</label>



<select

value={currency}

onChange={(e)=>setCurrency(e.target.value)}

className="
w-full
border
rounded-lg
p-3
mt-2
"

>


<option value="EUR">
Euro (€)
</option>


<option value="USD">
Dólar ($)
</option>


<option value="MZN">
Metical (MT)
</option>


<option value="BRL">
Real (R$)
</option>



</select>


</div>





</div>








<div className="
bg-gray-50
rounded-lg
p-4
">


<p className="
font-semibold
">

Lucro estimado

</p>


<p className="
text-2xl
font-bold
text-green-600
">

{currency} {profit.toFixed(2)}

</p>



</div>





</div>

)

}