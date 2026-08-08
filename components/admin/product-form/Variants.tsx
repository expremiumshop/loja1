"use client"

import {
  Plus,
  X
} from "lucide-react"



interface VariantsProps {


hasVariants:boolean
setHasVariants:(value:boolean)=>void


hasColors:boolean
setHasColors:(value:boolean)=>void


hasSizes:boolean
setHasSizes:(value:boolean)=>void


hasModels:boolean
setHasModels:(value:boolean)=>void


colors:string[]
setColors:(value:string[])=>void


sizes:string[]
setSizes:(value:string[])=>void


models:string[]
setModels:(value:string[])=>void


}



export default function Variants({

hasVariants,
setHasVariants,

hasColors,
setHasColors,

hasSizes,
setHasSizes,

hasModels,
setHasModels,

colors,
setColors,

sizes,
setSizes,

models,
setModels

}:VariantsProps){





function addItem(

type:"color"|"size"|"model"

){


if(type==="color"){

setColors([
...colors,
""
])

}



if(type==="size"){

setSizes([
...sizes,
""
])

}



if(type==="model"){

setModels([
...models,
""
])

}



}





function updateItem(

type:"color"|"size"|"model",

index:number,

value:string

){



if(type==="color"){

const copy=[...colors]

copy[index]=value

setColors(copy)

}



if(type==="size"){

const copy=[...sizes]

copy[index]=value

setSizes(copy)

}



if(type==="model"){

const copy=[...models]

copy[index]=value

setModels(copy)

}



}







function removeItem(

type:"color"|"size"|"model",

index:number

){


if(type==="color"){

setColors(
colors.filter((_,i)=>i!==index)
)

}



if(type==="size"){

setSizes(
sizes.filter((_,i)=>i!==index)
)

}



if(type==="model"){

setModels(
models.filter((_,i)=>i!==index)
)

}



}





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

Variantes do produto

</h2>







<div className="
flex
items-center
justify-between
border
rounded-lg
p-4
">


<div>

<p className="
font-semibold
">

Este produto possui variantes?

</p>


<p className="
text-sm
text-gray-500
">

Ex: cor, tamanho, modelo

</p>


</div>





<input

type="checkbox"

checked={hasVariants}

onChange={(e)=>
setHasVariants(e.target.checked)
}

className="
w-5
h-5
"

/>



</div>







{
hasVariants && (


<div className="
space-y-6
">







{/* CORES */}


<div className="
border
rounded-lg
p-4
">


<label className="
flex
gap-3
items-center
font-semibold
">


<input

type="checkbox"

checked={hasColors}

onChange={(e)=>
setHasColors(e.target.checked)
}

/>


Cores


</label>






{
hasColors && (

<div className="
mt-4
space-y-3
">


{
colors.map((color,index)=>(


<div

key={index}

className="
flex
gap-2
"


>


<input

value={color}

onChange={(e)=>
updateItem(
"color",
index,
e.target.value
)
}

placeholder="Ex: Preto"

className="
flex-1
border
rounded-lg
p-3
"

/>


<button

type="button"

onClick={()=>
removeItem(
"color",
index
)
}

className="
bg-red-500
text-white
p-3
rounded-lg
"

>

<X size={18}/>

</button>



</div>


))

}



<button

type="button"

onClick={()=>
addItem("color")
}

className="
flex
items-center
gap-2
text-blue-600
font-semibold
"

>

<Plus size={18}/>

Adicionar cor

</button>



</div>


)

}


</div>










{/* TAMANHOS */}


<div className="
border
rounded-lg
p-4
">


<label className="
flex
gap-3
items-center
font-semibold
">


<input

type="checkbox"

checked={hasSizes}

onChange={(e)=>
setHasSizes(e.target.checked)
}

/>


Tamanhos


</label>






{
hasSizes && (


<div className="
mt-4
space-y-3
">


{
sizes.map((size,index)=>(


<div

key={index}

className="
flex
gap-2
"


>


<input

value={size}

onChange={(e)=>
updateItem(
"size",
index,
e.target.value
)
}

placeholder="Ex: M"

className="
flex-1
border
rounded-lg
p-3
"

/>


<button

type="button"

onClick={()=>
removeItem(
"size",
index
)
}

className="
bg-red-500
text-white
p-3
rounded-lg
"

>

<X size={18}/>

</button>



</div>


))

}



<button

type="button"

onClick={()=>
addItem("size")
}

className="
flex
items-center
gap-2
text-blue-600
font-semibold
"

>

<Plus size={18}/>

Adicionar tamanho

</button>



</div>


)

}


</div>









{/* MODELOS */}


<div className="
border
rounded-lg
p-4
">


<label className="
flex
gap-3
items-center
font-semibold
">


<input

type="checkbox"

checked={hasModels}

onChange={(e)=>
setHasModels(e.target.checked)
}

/>


Modelos


</label>





{
hasModels && (

<div className="
mt-4
space-y-3
">


{
models.map((model,index)=>(


<div

key={index}

className="
flex
gap-2
"


>


<input

value={model}

onChange={(e)=>
updateItem(
"model",
index,
e.target.value
)
}

placeholder="Modelo 1"

className="
flex-1
border
rounded-lg
p-3
"

/>


<button

type="button"

onClick={()=>
removeItem(
"model",
index
)
}

className="
bg-red-500
text-white
p-3
rounded-lg
"

>

<X size={18}/>

</button>



</div>


))

}



<button

type="button"

onClick={()=>
addItem("model")
}

className="
flex
items-center
gap-2
text-blue-600
font-semibold
"

>

<Plus size={18}/>

Adicionar modelo

</button>



</div>

)


}



</div>







</div>

)

}



</div>


)

}