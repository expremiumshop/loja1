"use client"

import {
  Timer,
  TicketPercent
} from "lucide-react"

import {
  useEffect,
  useState
} from "react"



export default function PromotionBar(){


const [time,setTime]=useState({

hours:2,

minutes:15,

seconds:40

})





useEffect(()=>{


const timer=setInterval(()=>{


setTime(prev=>{


let seconds = prev.seconds - 1

let minutes = prev.minutes

let hours = prev.hours



if(seconds < 0){

seconds = 59

minutes--

}



if(minutes < 0){

minutes = 59

hours--

}



if(hours < 0){

hours = 0

minutes = 0

seconds = 0

}



return {

hours,

minutes,

seconds

}


})


},1000)



return ()=>clearInterval(timer)


},[])






return (

<div

className="
bg-gradient-to-r
from-orange-500
to-red-500
text-white
rounded-xl
p-5
space-y-5
shadow-sm

"

>







{/* TITULO */}

<div

className="
flex
items-center
gap-3

"

>


<div

className="
bg-white/20
rounded-full
p-2

"

>

<Timer

size={26}

/>

</div>





<div>


<h3

className="
font-bold
text-lg

"

>

Oferta especial por tempo limitado

</h3>



<p

className="
text-sm
opacity-90

"

>

Aproveite antes que termine

</p>



</div>



</div>









{/* TEMPO + CUPOM */}

<div

className="
flex
flex-wrap
items-center
gap-4

"

>






{/* CONTADOR */}

<div

className="
bg-white
text-red-600
rounded-lg
px-5
py-3
font-bold
text-lg

"

>

{String(time.hours).padStart(2,"0")}:

{String(time.minutes).padStart(2,"0")}:

{String(time.seconds).padStart(2,"0")}


</div>









{/* CUPOM */}

<div

className="
bg-white/20
border
border-white/30
rounded-lg
px-5
py-3
flex
items-center
gap-2
font-semibold

"

>

<TicketPercent

size={21}

/>


<div>


<p>

Cupom

</p>


<p

className="
text-xs
opacity-80

"

>

Economize nesta compra

</p>


</div>



</div>







</div>







</div>

)

}