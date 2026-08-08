"use client"

import {
  Upload,
  X,
  ImagePlus,
  Star
} from "lucide-react"


interface ImagesProps {

images:File[]

setImages:(files:File[])=>void

previewImages:string[]

setPreviewImages:(images:string[])=>void

}



export default function Images({

images,
setImages,

previewImages,
setPreviewImages

}:ImagesProps){





function handleImages(e:any){


const files =
Array.from(e.target.files) as File[]



setImages([

...images,

...files

])



setPreviewImages([

...previewImages,

...files.map(file=>URL.createObjectURL(file))

])


}





function removeImage(index:number){


setImages(

images.filter((_,i)=>i!==index)

)


setPreviewImages(

previewImages.filter((_,i)=>i!==index)

)


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

Imagens do produto

</h2>





<div className="
border-2
border-dashed
rounded-xl
p-10
text-center
bg-gray-50
">


<ImagePlus

size={55}

className="mx-auto mb-4"

/>



<label

className="
cursor-pointer
inline-flex
items-center
gap-2
bg-blue-600
text-white
px-6
py-3
rounded-lg
font-semibold
"

>


<Upload size={20}/>


Adicionar imagens



<input

type="file"

multiple

accept="image/*"

onChange={handleImages}

className="hidden"

/>


</label>



<p className="
text-sm
text-gray-500
mt-3
">

A primeira imagem será a principal

</p>



</div>






<div className="
grid
grid-cols-2
md:grid-cols-4
gap-4
">


{

previewImages.map((img,index)=>(


<div

key={index}

className="
relative
border
rounded-xl
overflow-hidden
"

>



<img

src={img}

className="
w-full
h-36
object-cover
"

/>





{

index===0 && (

<div

className="
absolute
top-2
left-2
bg-yellow-400
text-white
px-2
py-1
rounded
text-xs
flex
items-center
gap-1
"

>

<Star size={12}/>

Principal

</div>

)

}







<button

type="button"

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


)

}