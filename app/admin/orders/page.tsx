"use client";

import Link from "next/link";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Search,
  Download,
  Plus,
  Eye,
  Pencil,
  Printer,
} from "lucide-react";

const stats = {
  today: 0,
  revenue: 0,
  pending: 0,
  shipped: 0,
  delivered: 0,
  cancelled: 0,
};

const orders = [];

export default function OrdersPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-3xl font-bold text-gray-900">
            Pedidos
          </h1>

          <p className="text-gray-600 mt-2">
            Gerencie todos os pedidos da sua loja.
          </p>

        </div>

        <div className="flex gap-3">

          <button className="flex items-center gap-2 bg-white border px-4 py-3 rounded-xl hover:bg-gray-50">

            <Download size={18} />

            Exportar

          </button>

          <Link
            href="/admin/orders/new"
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700"
          >

            <Plus size={18} />

            Criar Pedido

          </Link>

        </div>

      </div>

      {/* ESTATÍSTICAS */}

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">

        <StatCard
          title="Pedidos Hoje"
          value={stats.today}
          icon={<ShoppingBag size={22} />}
          color="blue"
        />

        <StatCard
          title="Receita Hoje"
          value={`${stats.revenue} MZN`}
          icon={<CheckCircle2 size={22} />}
          color="green"
        />

        <StatCard
          title="Pendentes"
          value={stats.pending}
          icon={<Clock size={22} />}
          color="yellow"
        />

        <StatCard
          title="Enviados"
          value={stats.shipped}
          icon={<Truck size={22} />}
          color="indigo"
        />

        <StatCard
          title="Entregues"
          value={stats.delivered}
          icon={<CheckCircle2 size={22} />}
          color="emerald"
        />

        <StatCard
          title="Cancelados"
          value={stats.cancelled}
          icon={<XCircle size={22} />}
          color="red"
        />

      </div>

      {/* PESQUISA */}

      <div className="bg-white rounded-xl shadow p-5 mb-6">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-3.5 text-gray-500"
          />

          <input
            placeholder="Pesquisar por nº do pedido, cliente ou produto..."
            className="w-full border rounded-lg pl-10 pr-4 py-3 text-gray-900"
          />

        </div>

      </div>

      {/* TABELA */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr className="text-left text-gray-700">

              <th className="p-4">Pedido</th>

              <th>Cliente</th>

              <th>Produtos</th>

              <th>Total</th>

              <th>Pagamento</th>

              <th>Estado</th>

              <th>Data</th>

              <th>Ações</th>

            </tr>

          </thead>

          <tbody>

            {orders.length === 0 ? (

              <tr>

                <td
                  colSpan={8}
                  className="text-center py-16 text-gray-500"
                >

                  Ainda não existem pedidos.

                </td>

              </tr>

            ) : (

              orders.map((order: any) => (

                <tr key={order.id}>

                  <td>{order.number}</td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: any) {

  const colors: any = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    indigo: "bg-indigo-100 text-indigo-600",
    emerald: "bg-emerald-100 text-emerald-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white rounded-xl shadow p-5">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-600 text-sm">

            {title}

          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-2">

            {value}

          </h2>

        </div>

        <div className={`p-3 rounded-xl ${colors[color]}`}>

          {icon}

        </div>

      </div>

    </div>
  );
}