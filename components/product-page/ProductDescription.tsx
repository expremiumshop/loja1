interface DescriptionProps {

    description:string | null
   
   }
   
   
   
   export default function ProductDescription({
   
   description
   
   }:DescriptionProps){
   
   
   return (
   
   
   <div
   
   className="
   mt-8
   space-y-5
   
   "
   
   >
   
   
   
   <h2
   
   className="
   text-2xl
   font-bold
   text-gray-900
   
   "
   
   >
   
   Descrição do produto
   
   </h2>
   
   
   
   
   
   <div
   
   className="
   prose
   max-w-none
   
   text-gray-700
   
   leading-relaxed
   
   "
   
   >
   
   
   {
   
   description ?
   
   (
   
   <p>
   
   {description}
   
   </p>
   
   )
   
   :
   
   (
   
   <p>
   
   Este produto oferece qualidade,
   segurança e uma excelente experiência
   de compra na EXPREMIUM SHOP.
   
   </p>
   
   )
   
   }
   
   
   
   </div>
   
   
   
   
   
   
   <div
   
   className="
   mt-6
   
   bg-gray-50
   
   rounded-xl
   
   p-5
   
   "
   
   >
   
   
   <h3
   
   className="
   font-bold
   mb-3
   
   "
   
   >
   
   Por que comprar na EXPREMIUM SHOP?
   
   </h3>
   
   
   
   <div
   
   className="
   grid
   
   grid-cols-1
   
   md:grid-cols-3
   
   gap-4
   
   "
   
   >
   
   
   
   <div>
   
   <p className="font-semibold">
   ✓ Produtos verificados
   </p>
   
   <p className="text-sm text-gray-500">
   Analisamos nossos produtos antes da venda.
   </p>
   
   </div>
   
   
   
   
   
   <div>
   
   <p className="font-semibold">
   ✓ Compra protegida
   </p>
   
   <p className="text-sm text-gray-500">
   Processo seguro e transparente.
   </p>
   
   </div>
   
   
   
   
   
   <div>
   
   <p className="font-semibold">
   ✓ Atendimento
   </p>
   
   <p className="text-sm text-gray-500">
   Suporte para nossos clientes.
   </p>
   
   </div>
   
   
   
   </div>
   
   
   
   </div>
   
   
   
   
   
   </div>
   
   
   )
   
   }