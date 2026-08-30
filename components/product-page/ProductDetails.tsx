interface ProductDetailsProps {

    product:any
   
   }
   
   
   
   export default function ProductDetails({
   
   product
   
   }:ProductDetailsProps){
   
   
   
   return (
   
   <div
   
   className="
   space-y-6
   
   "
   
   >
   
   
   <h2
   
   className="
   text-2xl
   font-bold
   text-gray-900
   
   "
   
   >
   
   Detalhes do produto
   
   </h2>
   
   
   
   
   
   <div
   
   className="
   grid
   
   grid-cols-1
   
   md:grid-cols-2
   
   gap-4
   
   "
   
   >
   
   
   
   <div
   
   className="
   border
   rounded-lg
   p-4
   bg-gray-50
   
   "
   
   >
   
   <p
   
   className="
   text-sm
   text-gray-500
   
   "
   
   >
   
   Categoria
   
   </p>
   
   
   <p
   
   className="
   font-semibold
   
   "
   
   >
   
   {product.category || "Sem categoria"}
   
   </p>
   
   
   </div>
   
   
   
   
   
   
   <div
   
   className="
   border
   rounded-lg
   p-4
   bg-gray-50
   
   "
   
   >
   
   <p
   
   className="
   text-sm
   text-gray-500
   
   "
   
   >
   
   Disponibilidade
   
   </p>
   
   
   <p
   
   className="
   font-semibold
   text-green-600
   
   "
   
   >
   
   Em estoque
   
   </p>
   
   
   </div>
   
   
   
   
   
   
   
   
   <div
   
   className="
   border
   rounded-lg
   p-4
   bg-gray-50
   
   "
   
   >
   
   <p
   
   className="
   text-sm
   text-gray-500
   
   "
   
   >
   
   Garantia
   
   </p>
   
   
   <p
   
   className="
   font-semibold
   
   "
   
   >
   
   Garantia
   
   </p>
   
   
   </div>
   
   
   
   
   
   
   
   <div
   
   className="
   border
   rounded-lg
   p-4
   bg-gray-50
   
   "
   
   >
   
   <p
   
   className="
   text-sm
   text-gray-500
   
   "
   
   >
   
   Envio
   
   </p>
   
   
   <p
   
   className="
   font-semibold
   
   "
   
   >
   
   Internacional
   
   </p>
   
   
   </div>
   
   
   
   </div>
   
   
   
   
   
   
   
   {/* CARACTERISTICAS */}
   
   <div
   
   className="
   border
   rounded-xl
   p-5
   
   "
   
   >
   
   
   <h3
   
   className="
   font-bold
   mb-4
   
   "
   
   >
   
   Características
   
   </h3>
   
   
   
   <ul
   
   className="
   space-y-2
   text-gray-600
   text-sm
   
   "
   
   >
   
   
   <li>
   ✓ Produto original verificado
   </li>
   
   
   <li>
   ✓ Material de alta qualidade
   </li>
   
   
   <li>
   ✓ Compra segura
   </li>
   
   
   <li>
   ✓ Suporte ao cliente
   </li>
   
   
   
   </ul>
   
   
   </div>
   
   
   
   
   
   </div>
   
   
   )
   
   }