"use client";


import { useEffect, useState } from "react";
import { Search, Globe, ImageIcon, Save, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";



export default function SEOPage(){


const [loading,setLoading] = useState(false);
const [uploading,setUploading] = useState(false);



const [form,setForm] = useState({

title:"",
description:"",
keywords:"",
og_image:""

});






useEffect(()=>{


async function loadSEO(){


const {data,error}= await supabase
.from("seo_settings")
.select("*")
.limit(1);



if(error){

console.log(error.message);
return;

}



if(data && data.length > 0){


setForm({

title:data[0].title || "",
description:data[0].description || "",
keywords:data[0].keywords || "",
og_image:data[0].og_image || ""

});


}



}



loadSEO();



},[]);








function updateField(
field:string,
value:string
){


setForm({

...form,

[field]:value

});


}









async function uploadImage(
e:any
){


try{


setUploading(true);



const file=e.target.files[0];


if(!file)return;



const fileName =
`${Date.now()}-${file.name}`;



const {error}=await supabase.storage
.from("seo")
.upload(
fileName,
file
);



if(error){

alert(error.message);
return;

}




const {data}=supabase.storage
.from("seo")
.getPublicUrl(fileName);




updateField(
"og_image",
data.publicUrl
);



alert("Imagem adicionada com sucesso");



}catch(error:any){


alert(error.message);


}finally{


setUploading(false);


}



}









async function saveSEO(){


setLoading(true);



const {error}=await supabase
.from("seo_settings")
.upsert({

id:1,

...form

});





if(error){

alert(error.message);

}else{

alert("SEO guardado com sucesso");

}




setLoading(false);


}









return (

<main className="min-h-screen bg-gray-100 p-8">


<div className="max-w-5xl mx-auto">



<h1 className="text-3xl font-bold text-gray-900">
🔎 SEO e Google
</h1>


<p className="text-gray-600 mt-2 mb-8">
Configure como a sua loja aparece no Google.
</p>





<div className="
bg-white
border
border-gray-200
rounded-2xl
shadow-sm
p-6
space-y-6
">







<div>

<label className="
block
text-gray-900
font-semibold
mb-2
">

Nome da Loja

</label>


<input

className="
w-full
bg-white
text-gray-900
border
border-gray-300
rounded-xl
p-4
"

value="FOCHINETI FASHION"

readOnly

/>

</div>









<div>

<label className="
block
text-gray-900
font-semibold
mb-2
">

Título SEO do Google

</label>


<input

value={form.title}

onChange={(e)=>updateField("title",e.target.value)}

className="
w-full
bg-white
text-gray-900
border
border-gray-300
rounded-xl
p-4
"

/>

</div>









<div>

<label className="
block
text-gray-900
font-semibold
mb-2
">

Descrição da Loja

</label>


<textarea

value={form.description}

onChange={(e)=>updateField("description",e.target.value)}

className="
w-full
bg-white
text-gray-900
border
border-gray-300
rounded-xl
p-4
h-32
"

/>

</div>









<div>

<label className="
block
text-gray-900
font-semibold
mb-2
">

Palavras-chave

</label>


<input

value={form.keywords}

onChange={(e)=>updateField("keywords",e.target.value)}

className="
w-full
bg-white
text-gray-900
border
border-gray-300
rounded-xl
p-4
"

/>

</div>









<div>


<label className="
block
text-gray-900
font-semibold
mb-2
">

Imagem Google / Redes Sociais

</label>





<div className="
border-2
border-dashed
border-gray-300
rounded-xl
p-10
text-center
bg-gray-50
">


{

form.og_image ?

<img

src={form.og_image}

className="
w-32
h-32
object-cover
rounded-xl
mx-auto
"

/>

:

<ImageIcon
size={40}
className="
mx-auto
text-gray-500
"
/>


}





<p className="
text-gray-600
mt-3
">

Adicionar logo ou imagem da FOCHINETI FASHION

</p>





<label

className="
inline-flex
items-center
gap-2
mt-4
bg-gray-900
text-white
px-5
py-2
rounded-lg
cursor-pointer
"

>


<Upload size={18}/>


{

uploading

?

"Enviando..."

:

"Selecionar imagem"

}



<input

type="file"

accept="image/*"

onChange={uploadImage}

className="hidden"

/>


</label>



</div>


</div>









<button

onClick={saveSEO}

disabled={loading}

className="
flex
items-center
gap-2
bg-gray-900
hover:bg-black
text-white
font-semibold
px-8
py-3
rounded-xl
"

>


<Save size={20}/>


{

loading

?

"Guardando..."

:

"Guardar SEO"

}


</button>






</div>








<div className="
mt-8
bg-white
border
border-gray-200
rounded-2xl
shadow-sm
p-6
">


<h2 className="
text-xl
font-bold
text-gray-900
mb-5
">

Pré-visualização no Google

</h2>





<div className="
border
rounded-xl
p-5
">



<div className="
flex
items-center
gap-2
text-sm
text-gray-500
">

<Globe size={18}/>

https://fochinetifashion.vercel.app/

</div>





<h3 className="
text-blue-700
text-xl
font-semibold
mt-3
">

{form.title || "FOCHINETI FASHION - Loja Online Premium"}

</h3>




<p className="
text-gray-700
mt-2
">

{form.description || "Compre produtos premium online com segurança. Tecnologia, moda, acessórios e novidades."}

</p>




</div>


</div>








</div>


</main>

)


}