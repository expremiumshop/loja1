"use client"

interface BasicInfoProps {

name:string
setName:(value:string)=>void

description:string
setDescription:(value:string)=>void

brand:string
setBrand:(value:string)=>void

}


export default function BasicInfo({

name,
setName,

description,
setDescription,

brand,
setBrand,

}:BasicInfoProps){


return (

<div className="bg-white rounded-xl shadow p-6 space-y-5">


<h2 className="text-xl font-bold">
Informações básicas
</h2>



<div>

<label className="font-semibold">
Nome do produto
</label>


<input

value={name}

onChange={(e)=>setName(e.target.value)}

placeholder="Ex: Smartphone Samsung S24"

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

<label className="font-semibold">
Descrição
</label>


<textarea

value={description}

onChange={(e)=>setDescription(e.target.value)}

rows={6}

placeholder="Descrição completa do produto"

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

<label className="font-semibold">
Marca
</label>


<input

value={brand}

onChange={(e)=>setBrand(e.target.value)}

placeholder="Samsung, Nike, Apple..."

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

)

}