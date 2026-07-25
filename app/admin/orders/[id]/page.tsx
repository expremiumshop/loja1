"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Printer,
  Truck,
  User,
  CreditCard,
  MapPin,
  Package,
} from "lucide-react";

export default function OrderDetailsPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-4"
          >
            <ArrowLeft size={18} />
            Voltar para pedidos
          </Link>

          <h1 className="text-3xl font-bold text-gray-900">
            Pedido #1001
          </h1>

          <p className="text-gray-600 mt-2">
            Criado em 21 Julho 2026 às 14:30
          </p>

        </div>

        <div className="flex gap-3">

          <button className="bg-green-600 text-white px-5 py-3 rounded-xl">
            Confirmar Pagamento
          </button>

          <button className="bg-blue-600 text-white px-5 py-3 rounded-xl">
            Marcar como Enviado
          </button>

          <button className="bg-white border px-5 py-3 rounded-xl flex items-center gap-2">
            <Printer size={18} />
            Imprimir
          </button>

        </div>

      </div>

      {/* GRID */}

      <div className="grid lg:grid-cols-3 gap-8">

        {/* LADO ESQUERDO */}

        <div className="lg:col-span-2 space-y-6">

          {/* PRODUTOS */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Produtos
            </h2>

            <table className="w-full">

              <thead>

                <tr className="border-b text-gray-600">

                  <th className="text-left py-3">
                    Produto
                  </th>

                  <th>
                    Quantidade
                  </th>

                  <th>
                    Preço
                  </th>

                  <th>
                    Total
                  </th>

                </tr>

              </thead>

              <tbody>

                <tr className="border-b">

                  <td className="py-4 font-medium text-gray-900">
                    Nenhum produto
                  </td>

                  <td className="text-center">
                    0
                  </td>

                  <td className="text-center">
                    0 MZN
                  </td>

                  <td className="text-center">
                    0 MZN
                  </td>

                </tr>

              </tbody>

            </table>

          </div>

          {/* RESUMO */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Resumo Financeiro
            </h2>

            <div className="space-y-4">

              <Row label="Subtotal" value="0 MZN" />

              <Row label="Entrega" value="0 MZN" />

              <Row label="Desconto" value="0 MZN" />

              <Row label="IVA" value="0 MZN" />

              <hr />

              <Row
                label="TOTAL"
                value="0 MZN"
                bold
              />

            </div>

          </div>

        </div>

        {/* LADO DIREITO */}

        <div className="space-y-6">

          <Card
            icon={<User size={20} />}
            title="Cliente"
          >

            <p className="text-gray-600">
              Nenhum cliente associado.
            </p>

          </Card>

          <Card
            icon={<CreditCard size={20} />}
            title="Pagamento"
          >

            <p className="text-gray-600">
              Estado: Pendente
            </p>

            <p className="text-gray-600 mt-2">
              Método: —
            </p>

          </Card>

          <Card
            icon={<MapPin size={20} />}
            title="Endereço"
          >

            <p className="text-gray-600">
              Ainda não informado.
            </p>

          </Card>
        
          <Card
            icon={<Truck size={20} />}
            title="Envio"
          >
            <p className="text-gray-600">
              Transportadora: —
            </p>

            <p className="text-gray-600 mt-2">
              Código de rastreio: —
            </p>
          </Card>

          <Card
            icon={<Package size={20} />}
            title="Linha do Tempo"
          >
            <div className="space-y-4">

              <TimelineItem
                title="Pedido criado"
                time="21 Jul 2026 • 14:30"
                done
              />

              <TimelineItem
                title="Pagamento confirmado"
                time="Aguardando"
              />

              <TimelineItem
                title="Preparando pedido"
                time="Aguardando"
              />

              <TimelineItem
                title="Pedido enviado"
                time="Aguardando"
              />

              <TimelineItem
                title="Pedido entregue"
                time="Aguardando"
              />

            </div>
          </Card>

        </div>

      </div>

    </main>
  );
}

/* COMPONENTES */

function Row({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">

      <span
        className={
          bold
            ? "font-bold text-gray-900"
            : "text-gray-600"
        }
      >
        {label}
      </span>

      <span
        className={
          bold
            ? "font-bold text-gray-900"
            : "text-gray-900"
        }
      >
        {value}
      </span>

    </div>
  );
}

function Card({
  title,
  icon,
  children,
}: any) {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <div className="flex items-center gap-3 mb-5">

        <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">

          {icon}

        </div>

        <h2 className="text-lg font-bold text-gray-900">

          {title}

        </h2>

      </div>

      {children}

    </div>
  );
}

function TimelineItem({
  title,
  time,
  done = false,
}: {
  title: string;
  time: string;
  done?: boolean;
}) {
  return (
    <div className="flex gap-3">

      <div className="pt-1">

        {done ? (
          <CheckCircle2
            size={20}
            className="text-green-600"
          />
        ) : (
          <Clock
            size={20}
            className="text-gray-400"
          />
        )}

      </div>

      <div>

        <p className="font-semibold text-gray-900">

          {title}

        </p>

        <p className="text-sm text-gray-500">

          {time}

        </p>

      </div>

    </div>
  );
}

