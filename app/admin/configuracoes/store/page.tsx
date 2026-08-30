"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Save, Store, Upload } from "lucide-react";


export default function StoreSettingsPage(){


const [loading,setLoading] = useState(false);
const [uploading,setUploading] = useState(false);


const [form,setForm] = useState({

store_name:"",
logo_url:"",
favicon:"",
phone:"",
email:"",
whatsapp:"",
primary_color:"#000000",
domain:""

});




useEffect(()=>{


async function loadStore(){


const {data,error}= await supabase
.from("store_settings")
.select("*")
.limit(1);



if(error){

console.log(error.message);
return;

}



if(data && data.length > 0){


const store=data[0];


setForm({

store_name:store.store_name || "",
logo_url:store.logo_url || "",
favicon:store.favicon || "",
phone:store.phone || "",
email:store.email || "",
whatsapp:store.whatsapp || "",
primary_color:store.primary_color || "#000000",
domain:store.domain || ""

});


}


}


loadStore();


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







async function uploadLogo(
event:any
){


try{


setUploading(true);



const file = event.target.files[0];


if(!file) return;



const fileName =
`${Date.now()}-${file.name}`;



const {error}= await supabase.storage
.from("logos")
.upload(
fileName,
file
);



if(error){

alert(error.message);
return;

}



const {data}=supabase.storage
.from("logos")
.getPublicUrl(fileName);



updateField(
"logo_url",
data.publicUrl
);



alert("Logo enviado com sucesso");



}catch(error:any){


alert(error.message);


}finally{


setUploading(false);


}


}










async function saveStore(){


setLoading(true);



const {error}= await supabase
.from("store_settings")
.upsert({

id:1,

...form

});




if(error){

alert(error.message);

}else{

alert(
"Configurações guardadas com sucesso"
);

}



setLoading(false);


}







return (

<main className="min-h-screen bg-gray-100 p-8">


<div className="max-w-5xl mx-auto">



<h1 className="
text-3xl
font-bold
text-gray-900
flex
items-center
gap-3
mb-2
">

<Store size={32}/>

Informações da Loja

</h1>


<p className="
text-gray-600
mb-8
">

Configure os dados principais da sua loja.

</p>







<div className="
bg-white
rounded-3xl
shadow-lg
p-8
space-y-6
">







<div>

<label className="font-semibold text-gray-900">

Logotipo da Loja

</label>


<div className="
mt-3
border
border-gray-300
rounded-2xl
p-5
flex
items-center
gap-5
">


{form.logo_url ? (

<img

src={form.logo_url}

className="
w-24
h-24
rounded-xl
object-contain
border
"

/>

):(


<div className="
w-24
h-24
rounded-xl
bg-gray-100
flex
items-center
justify-center
text-gray-400
">

Logo

</div>


)}




<label className="
cursor-pointer
bg-gray-900
text-white
px-5
py-3
rounded-xl
flex
items-center
gap-2
">


<Upload size={18}/>


{

uploading

?

"Enviando..."

:

"Adicionar Logo"

}


<input

type="file"

accept="image/*"

onChange={uploadLogo}

className="hidden"

/>


</label>


</div>


</div>








<div>

<label className="font-semibold text-gray-900">

Nome da Loja

</label>


<input

value={form.store_name}

onChange={(e)=>updateField("store_name",e.target.value)}

className="
mt-2
w-full
rounded-xl
border
border-gray-300
p-4
text-gray-900
"

/>

</div>









<div className="
grid
md:grid-cols-2
gap-5
">


<div>

<label className="font-semibold text-gray-900">

Email

</label>


<input

value={form.email}

onChange={(e)=>updateField("email",e.target.value)}

className="
mt-2
w-full
rounded-xl
border
border-gray-300
p-4
text-gray-900
"

/>

</div>





<div>

<label className="font-semibold text-gray-900">

Telefone

</label>


<input

value={form.phone}

onChange={(e)=>updateField("phone",e.target.value)}

className="
mt-2
w-full
rounded-xl
border
border-gray-300
p-4
text-gray-900
"

/>

</div>


</div>









<div>

<label className="font-semibold text-gray-900">

WhatsApp

</label>


<input

value={form.whatsapp}

onChange={(e)=>updateField("whatsapp",e.target.value)}

className="
mt-2
w-full
rounded-xl
border
border-gray-300
p-4
text-gray-900
"

/>

</div>









<div>

<label className="font-semibold text-gray-900">

Domínio

</label>


<input

value={form.domain}

onChange={(e)=>updateField("domain",e.target.value)}

placeholder="fochinetifashion.vercel.app"

className="
mt-2
w-full
rounded-xl
border
border-gray-300
p-4
text-gray-900
"

/>

</div>









<div>

<label className="font-semibold text-gray-900">

Cor principal da loja

</label>


<div className="
flex
items-center
gap-4
mt-3
">


<input

type="color"

value={form.primary_color}

onChange={(e)=>updateField("primary_color",e.target.value)}

className="
w-14
h-14
rounded-full
border
cursor-pointer
"

/>


<span className="text-gray-700">

{form.primary_color}

</span>


</div>


</div>








<button

onClick={saveStore}

disabled={loading}

className="
flex
items-center
gap-3
bg-gray-900
hover:bg-black
text-white
font-bold
px-8
py-4
rounded-2xl
"


>


<Save size={20}/>


{

loading

?

"Guardando..."

:

"Guardar alterações"

}


</button>





</div>


</div>


</main>

)


}