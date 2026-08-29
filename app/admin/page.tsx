"use client"

import { useEffect, useState } from "react"
import {
  Users,
  Package,
  DollarSign,
  Eye,
  TrendingUp,
  ShoppingCart,
  BarChart3,
  RefreshCw,
} from "lucide-react"

import { supabase } from "@/lib/supabase"

type Product = {
  id: string
  active: boolean
  stock: number
  price: number
}

type Order = {
  id: string
  customer_name: string
  phone: string
  total: number
  status: string
  created_at: string
}

type DashboardStats = {
  receita: number
  pedidos: number
  clientes: number
  produtos: number
  produtosAtivos: number
  produtosInativos: number
  estoqueTotal: number
  valorEstoque: number
  produtosEstoqueBaixo: number
  visitantes: number
  conversao: string
  vendasHoje: number
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats>({
    receita: 0,
    pedidos: 0,
    clientes: 0,
    produtos: 0,
    produtosAtivos: 0,
    produtosInativos: 0,
    estoqueTotal: 0,
    valorEstoque: 0,
    produtosEstoqueBaixo: 0,
    visitantes: 0,
    conversao: "0%",
    vendasHoje: 0,
  })

  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState("")

  function formatMZN(value: number) {
    return `${value.toLocaleString("pt-MZ")} MZN`
  }

  async function loadDashboard() {
    try {
      setRefreshing(true)
      setError("")

      // =====================================================
      // PRODUTOS
      // =====================================================

      const {
        data: products,
        error: productsError,
      } = await supabase
        .from("products")
        .select("id, active, stock, price")

      if (productsError) {
        throw new Error(
          `Erro ao carregar produtos: ${productsError.message}`
        )
      }

      const productList: Product[] = products || []

      const totalProducts = productList.length

      const activeProducts = productList.filter(
        (product) => product.active === true
      ).length

      const inactiveProducts = productList.filter(
        (product) => product.active !== true
      ).length

      const totalStock = productList.reduce(
        (total, product) =>
          total + Number(product.stock || 0),
        0
      )

      const stockValue = productList.reduce(
        (total, product) => {
          const price = Number(product.price || 0)
          const stock = Number(product.stock || 0)

          return total + price * stock
        },
        0
      )

      const lowStockProducts = productList.filter(
        (product) => {
          const stock = Number(product.stock || 0)

          return stock > 0 && stock <= 5
        }
      ).length

      // =====================================================
      // PEDIDOS
      // =====================================================

      const {
        data: orders,
        error: ordersError,
      } = await supabase
        .from("orders")
        .select(
          "id, customer_name, phone, total, status, created_at"
        )
        .order("created_at", {
          ascending: false,
        })

      if (ordersError) {
        throw new Error(
          `Erro ao carregar pedidos: ${ordersError.message}`
        )
      }

      const orderList: Order[] = orders || []

      const ordersCount = orderList.length

      // =====================================================
      // CLIENTES
      // =====================================================
      // Não usamos a tabela "customers" porque ela
      // não existe no seu banco atual.
      //
      // Aqui contamos clientes únicos pelo telefone.

      const uniquePhones = new Set(
        orderList
          .map((order) => order.phone?.trim())
          .filter(Boolean)
      )

      const customersCount = uniquePhones.size

      // =====================================================
      // RECEITA
      // =====================================================
      // Consideramos como venda concluída alguns estados
      // comuns de pedido.

      const paidStatuses = [
        "paid",
        "completed",
        "complete",
        "confirmed",
        "concluido",
        "concluído",
        "pago",
      ]

      const completedOrders = orderList.filter(
        (order) =>
          paidStatuses.includes(
            String(order.status || "").toLowerCase()
          )
      )

      const totalRevenue = completedOrders.reduce(
        (total, order) =>
          total + Number(order.total || 0),
        0
      )

      // =====================================================
      // VENDAS HOJE
      // =====================================================

      const today = new Date()

      const todayString =
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(today.getDate()).padStart(2, "0")

      const todaySales = completedOrders.filter(
        (order) => {
          const orderDate = new Date(order.created_at)

          const orderDateString =
            orderDate.getFullYear() +
            "-" +
            String(
              orderDate.getMonth() + 1
            ).padStart(2, "0") +
            "-" +
            String(
              orderDate.getDate()
            ).padStart(2, "0")

          return orderDateString === todayString
        }
      ).length

      // =====================================================
      // VISITANTES
      // =====================================================
      // Ainda não existe tabela de visitantes no seu banco.
      // Portanto, mantemos 0 até criarmos essa funcionalidade.

      const visitors = 0

      // =====================================================
      // CONVERSÃO
      // =====================================================
      // Sem visitantes reais, não podemos calcular
      // uma taxa de conversão verdadeira.

      const conversion = "0%"

      // =====================================================
      // ÚLTIMOS PEDIDOS
      // =====================================================

      setRecentOrders(orderList.slice(0, 5))

      // =====================================================
      // ATUALIZAR ESTATÍSTICAS
      // =====================================================

      setStats({
        receita: totalRevenue,
        pedidos: ordersCount,
        clientes: customersCount,
        produtos: totalProducts,
        produtosAtivos: activeProducts,
        produtosInativos: inactiveProducts,
        estoqueTotal: totalStock,
        valorEstoque: stockValue,
        produtosEstoqueBaixo: lowStockProducts,
        visitantes: visitors,
        conversao: conversion,
        vendasHoje: todaySales,
      })
    } catch (error) {
      console.error(
        "Erro ao carregar Dashboard:",
        error
      )

      setError(
        error instanceof Error
          ? error.message
          : "Erro ao carregar Dashboard."
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // =====================================================
  // CARREGAR DASHBOARD
  // =====================================================

  useEffect(() => {
    loadDashboard()
  }, [])

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-4 md:p-8">
        <div className="mx-auto flex min-h-[400px] max-w-7xl items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            <p className="mt-4 text-sm font-medium text-gray-600">
              A carregar Dashboard...
            </p>
          </div>
        </div>
      </main>
    )
  }

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto w-full max-w-7xl">

        {/* CABEÇALHO */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              Visão geral da sua loja.
            </p>
          </div>

          <button
            type="button"
            onClick={loadDashboard}
            disabled={refreshing}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <RefreshCw
              size={18}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing
              ? "A atualizar..."
              : "Atualizar dados"}
          </button>
        </div>

        {/* ERRO */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* CARTÕES PRINCIPAIS */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Card
            title="Receita Total"
            value={formatMZN(stats.receita)}
            icon={<DollarSign size={26} />}
          />

          <Card
            title="Pedidos"
            value={stats.pedidos}
            icon={<ShoppingCart size={26} />}
          />

          <Card
            title="Clientes"
            value={stats.clientes}
            icon={<Users size={26} />}
          />

          <Card
            title="Produtos"
            value={stats.produtos}
            icon={<Package size={26} />}
          />

        </div>

        {/* INFORMAÇÕES DOS PRODUTOS */}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <InfoCard
            title="Produtos disponíveis"
            value={stats.produtosAtivos}
            description="Produtos ativos na loja"
            icon={<Package size={23} />}
          />

          <InfoCard
            title="Produtos inativos"
            value={stats.produtosInativos}
            description="Produtos desativados"
            icon={<Package size={23} />}
          />

          <InfoCard
            title="Estoque total"
            value={stats.estoqueTotal}
            description="Unidades disponíveis"
            icon={<BarChart3 size={23} />}
          />

        </div>

        {/* VALOR DO ESTOQUE */}

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
              <Package size={24} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">
                Valor do estoque
              </h2>

              <p className="text-sm text-gray-500">
                Valor dos produtos atualmente em estoque
              </p>
            </div>

          </div>

          <div className="mt-5">
            <span className="text-3xl font-bold text-gray-900">
              {formatMZN(stats.valorEstoque)}
            </span>
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Este valor não representa vendas ou receita.
          </p>

        </div>

        {/* ESTOQUE BAIXO */}

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
              <Package size={24} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">
                Estoque baixo
              </h2>

              <p className="text-sm text-gray-500">
                Produtos com 5 ou menos unidades
              </p>
            </div>

          </div>

          <div className="mt-5">

            <span className="text-3xl font-bold text-orange-600">
              {stats.produtosEstoqueBaixo}
            </span>

            <span className="ml-2 text-sm text-gray-500">
              produto(s)
            </span>

          </div>

        </div>

        {/* MÉTRICAS */}

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

          <Metric
            title="Visitantes"
            value={stats.visitantes}
            icon={<Eye size={24} />}
          />

          <Metric
            title="Taxa de Conversão"
            value={stats.conversao}
            icon={<TrendingUp size={24} />}
          />

          <Metric
            title="Vendas Hoje"
            value={stats.vendasHoje}
            icon={<BarChart3 size={24} />}
          />

        </div>

        {/* GRÁFICO */}

        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm md:p-6">

          <h2 className="text-lg font-bold text-gray-900 md:text-xl">
            Vendas dos últimos 30 dias
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            O gráfico será ativado quando implementarmos
            as métricas de vendas por dia.
          </p>

          <div className="mt-6 flex h-40 items-end gap-2">

            {Array.from({
              length: 7,
            }).map((_, index) => (
              <div
                key={index}
                className="flex-1 rounded-t-lg bg-blue-100"
                style={{
                  height: "5%",
                }}
              />
            ))}

          </div>

        </div>

        {/* ÚLTIMOS PEDIDOS */}

        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">

          <div className="border-b border-gray-200 p-5 md:p-6">

            <h2 className="text-lg font-bold text-gray-900 md:text-xl">
              Últimos pedidos
            </h2>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[700px]">

              <thead>
                <tr className="border-b bg-gray-50 text-left text-sm text-gray-600">

                  <th className="p-4">
                    Cliente
                  </th>

                  <th className="p-4">
                    Telefone
                  </th>

                  <th className="p-4">
                    Valor
                  </th>

                  <th className="p-4">
                    Estado
                  </th>

                  <th className="p-4">
                    Data
                  </th>

                </tr>
              </thead>

              <tbody>

                {recentOrders.length === 0 ? (

                  <tr>
                    <td
                      colSpan={5}
                      className="p-6 text-center text-sm text-gray-500"
                    >
                      Nenhum pedido encontrado.
                    </td>
                  </tr>

                ) : (

                  recentOrders.map((order) => (

                    <tr
                      key={order.id}
                      className="border-b text-sm text-gray-900"
                    >

                      <td className="p-4 font-medium">
                        {order.customer_name}
                      </td>

                      <td className="p-4">
                        {order.phone}
                      </td>

                      <td className="p-4 font-semibold">
                        {formatMZN(
                          Number(order.total || 0)
                        )}
                      </td>

                      <td className="p-4">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
                          {order.status}
                        </span>
                      </td>

                      <td className="p-4">
                        {new Date(
                          order.created_at
                        ).toLocaleDateString(
                          "pt-MZ"
                        )}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </main>
  )
}

// =========================================================
// CARD PRINCIPAL
// =========================================================

function Card({
  title,
  value,
  icon,
}: {
  title: string
  value: string | number
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm md:p-6">

      <div className="flex items-center justify-between gap-4">

        <div className="min-w-0">

          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h2 className="mt-1 truncate text-2xl font-bold text-gray-900 md:text-3xl">
            {value}
          </h2>

        </div>

        <div className="shrink-0 rounded-xl bg-blue-100 p-3 text-blue-600">
          {icon}
        </div>

      </div>

    </div>
  )
}

// =========================================================
// INFO CARD
// =========================================================

function InfoCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: string | number
  description: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm md:p-6">

      <div className="flex items-start gap-4">

        <div className="shrink-0 rounded-xl bg-green-100 p-3 text-green-600">
          {icon}
        </div>

        <div className="min-w-0">

          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h3 className="mt-1 text-2xl font-bold text-gray-900">
            {value}
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {description}
          </p>

        </div>

      </div>

    </div>
  )
}

// =========================================================
// MÉTRICA
// =========================================================

function Metric({
  title,
  value,
  icon,
}: {
  title: string
  value: string | number
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm md:p-6">

      <div className="flex items-center gap-4">

        <div className="shrink-0 rounded-xl bg-green-100 p-3 text-green-600">
          {icon}
        </div>

        <div>

          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h3 className="mt-1 text-2xl font-bold text-gray-900">
            {value}
          </h3>

        </div>

      </div>

    </div>
  )
}