"use client"


interface InventoryProps {

sku:string
setSku:(value:string)=>void

barcode:string
setBarcode:(value:string)=>void

stock:string
setStock:(value:string)=>void

minStock:string
setMinStock:(value:string)=>void

allowBackorder:boolean
setAllowBackorder:(value:boolean)=>void

}



export default function Inventory({

sku,
setSku,

barcode,
setBarcode,

stock,
setStock,

minStock,
setMinStock,

allowBackorder,
setAllowBackorder

}:InventoryProps){



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

Inventário

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

SKU

</label>


<input

value={sku}

onChange={(e)=>setSku(e.target.value)}

placeholder="Ex: SAM-S24-001"

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

Código interno do produto

</p>


</div>








<div>

<label className="
font-semibold
">

Código de barras

</label>


<input

value={barcode}

onChange={(e)=>setBarcode(e.target.value)}

placeholder="EAN / UPC"

className="
w-full
border
rounded-lg
p-3
mt-2
"

/>


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

Quantidade em estoque

</label>


<input

type="number"

value={stock}

onChange={(e)=>setStock(e.target.value)}

placeholder="100"

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

Estoque mínimo

</label>


<input

type="number"

value={minStock}

onChange={(e)=>setMinStock(e.target.value)}

placeholder="5"

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

Aviso quando o estoque estiver baixo

</p>


</div>




</div>









<div className="
border
rounded-lg
p-4
flex
items-center
justify-between
">


<div>


<p className="
font-semibold
">

Vender sem estoque

</p>


<p className="
text-sm
text-gray-500
">

Permitir pedidos mesmo quando acabar

</p>


</div>





<input

type="checkbox"

checked={allowBackorder}

onChange={(e)=>setAllowBackorder(e.target.checked)}

className="
w-5
h-5
"

/>



</div>







</div>


)

}