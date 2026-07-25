import Link from "next/link"

export default function ProductsAdminPage() {

    const products = [
      {
        id: 1,
        name: "Auscultadores Bluetooth Pro",
        category: "Eletrónicos",
        price: "3999 MZN",
        stock: 15
      },
      {
        id: 2,
        name: "Smartwatch Premium",
        category: "Tecnologia",
        price: "5999 MZN",
        stock: 8
      },
      {
        id: 3,
        name: "Perfume Masculino",
        category: "Beleza",
        price: "2500 MZN",
        stock: 20
      }
    ];
  
  
    return (
  
      <main className="min-h-screen bg-gray-100 p-8">
  
  
        {/* Cabeçalho */}
  
        <div className="flex justify-between items-center mb-8">
  
          <h1 className="text-4xl font-bold text-gray-900">
            Gestão de Produtos
          </h1>
  
  
          <Link
href="/admin/products/new"
className="
bg-blue-600
text-white
px-5
py-3
rounded-lg
font-semibold
hover:bg-blue-700
"
>
+ Adicionar Produto
</Link>
  
  
        </div>
  
  
  
        {/* Tabela */}
  
        <div
          className="
          bg-white
          rounded-xl
          shadow-lg
          overflow-hidden
          border
          "
        >
  
  
          <table className="w-full">
  
  
            <thead className="bg-gray-900 text-white">
  
              <tr>
  
                <th className="p-4 text-left">
                  Nome
                </th>
  
  
                <th className="p-4 text-left">
                  Categoria
                </th>
  
  
                <th className="p-4 text-left">
                  Preço
                </th>
  
  
                <th className="p-4 text-left">
                  Estoque
                </th>
  
  
                <th className="p-4 text-center">
                  Ações
                </th>
  
  
              </tr>
  
            </thead>
  
  
  
            <tbody>
  
  
              {products.map((product)=>(
  
                <tr
                  key={product.id}
                  className="
                  border-b
                  hover:bg-gray-50
                  "
                >
  
  
                  <td className="p-4 font-medium text-gray-900">
  
                    {product.name}
  
                  </td>
  
  
  
                  <td className="p-4 text-gray-700">
  
                    {product.category}
  
                  </td>
  
  
  
                  <td className="p-4 text-green-600 font-bold">
  
                    {product.price}
  
                  </td>
  
  
  
                  <td className="p-4 text-gray-900 font-semibold">
  
                    {product.stock} unidades
  
                  </td>
  
  
  
                  <td className="p-4 text-center">
  
  
                    <button
                      className="
                      bg-yellow-500
                      hover:bg-yellow-600
                      text-white
                      px-4
                      py-2
                      rounded-lg
                      mr-2
                      "
                    >
                      Editar
                    </button>
  
  
  
                    <button
                      className="
                      bg-red-600
                      hover:bg-red-700
                      text-white
                      px-4
                      py-2
                      rounded-lg
                      "
                    >
                      Apagar
                    </button>
  
  
                  </td>
  
  
                </tr>
  
  
              ))}
  
  
            </tbody>
  
  
          </table>
  
  
        </div>
  
  
      </main>
  
    );
  }