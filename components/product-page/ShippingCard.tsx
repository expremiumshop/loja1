import {
    Truck,
    MapPin,
    Clock
  } from "lucide-react"
  
  
  
  export default function ShippingCard(){
  
  
  return (
  
  <div
  
  className="
  border
  rounded-xl
  p-5
  bg-white
  space-y-4
  
  "
  
  >
  
  
  
  <div
  
  className="
  flex
  items-center
  gap-3
  
  "
  
  >
  
  <Truck
  
  className="
  w-6
  h-6
  text-blue-600
  
  "
  
  />
  
  
  <div>
  
  <h3
  
  className="
  font-semibold
  text-gray-900
  
  "
  
  >
  
  Entrega
  
  </h3>
  
  
  <p
  
  className="
  text-sm
  text-gray-500
  
  "
  
  >
  
  Entrega segura com rastreamento
  
  </p>
  
  
  </div>
  
  
  </div>
  
  
  
  
  
  
  
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
  bg-gray-50
  rounded-lg
  p-3
  flex
  gap-3
  
  "
  
  >
  
  
  <MapPin
  
  className="
  text-red-500
  "
  
  />
  
  
  <div>
  
  <p
  
  className="
  text-sm
  font-medium
  
  "
  
  >
  
  Destino
  
  </p>
  
  
  <p
  
  className="
  text-xs
  text-gray-500
  
  "
  
  >
  
  Selecionar endereço
  
  </p>
  
  
  </div>
  
  
  </div>
  
  
  
  
  
  
  
  <div
  
  className="
  bg-gray-50
  rounded-lg
  p-3
  flex
  gap-3
  
  "
  
  >
  
  
  <Clock
  
  className="
  text-green-600
  
  "
  
  />
  
  
  
  <div>
  
  
  <p
  
  className="
  text-sm
  font-medium
  
  "
  
  >
  
  Prazo estimado
  
  </p>
  
  
  <p
  
  className="
  text-xs
  text-gray-500
  
  "
  
  >
  
  7 - 15 dias úteis
  
  </p>
  
  
  </div>
  
  
  
  </div>
  
  
  
  </div>
  
  
  
  
  
  
  <div
  
  className="
  text-sm
  text-green-600
  font-medium
  
  "
  
  >
  
  ✓ Rastreamento disponível após envio
  
  </div>
  
  
  
  </div>
  
  
  )
  
  }