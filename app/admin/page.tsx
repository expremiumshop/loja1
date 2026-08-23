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

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState("")

  // =====================================================
  // FORMATAR MZN
  // =====================================================

  function formatMZN(value: number) {
    return `${value.toLocaleString("pt-MZ")} MZN`
  }

  // =====================================================
  // CARREGAR DASHBOARD
  // =====================================================

  async function loadDashboard() {
    try {
      setRefreshing(true)
      setError("")

      // =================================================
      // PRODUTOS
      // =================================================

      const {
        data: products,
        error: productsError,
      } = await supabase
        .from("products")
        .select(
          "id, active, stock, price"
        )

      if (productsError) {
        throw new Error(
          `Erro ao carregar produtos: ${productsError.message}`
        )
      }

      const productList = products || []

      // =================================================
      // TOTAL DE PRODUTOS
      // =================================================

      const totalProducts =
        productList.length

      // =================================================
      // PRODUTOS ATIVOS
      // =================================================

      const activeProducts =
        productList.filter(
          (product) =>
            product.active === true
        ).length

      // =================================================
      // PRODUTOS INATIVOS
      // =================================================

      const inactiveProducts =
        productList.filter(
          (product) =>
            product.active !== true
        ).length

      // =================================================
      // ESTOQUE TOTAL
      // =================================================

      const totalStock =
        productList.reduce(
          (total, product) =>
            total +
            Number(product.stock || 0),
          0
        )

      // =================================================
      // VALOR DO ESTOQUE
      //
      // IMPORTANTE:
      // Isto NÃO é receita.
      //
      // É apenas o valor potencial dos
      // produtos que ainda estão em estoque.
      // =================================================

      const stockValue =
        productList.reduce(
          (total, product) => {
            const price = Number(
              product.price || 0
            )

            const stock = Number(
              product.stock || 0
            )

            return total + price * stock
          },
          0
        )

      // =================================================
      // ESTOQUE BAIXO
      // =================================================

      const lowStockProducts =
        productList.filter(
          (product) => {
            const stock = Number(
              product.stock || 0
            )

            return (
              stock > 0 &&
              stock <= 5
            )
          }
        ).length

      // =================================================
      // PEDIDOS
      // =================================================

      let ordersCount = 0

      const {
        count: orders,
        error: ordersError,
      } = await supabase
        .from("orders")
        .select("*", {
          count: "exact",
          head: true,
        })

      if (!ordersError) {
        ordersCount = orders || 0
      }

      // =================================================
      // CLIENTES
      // =================================================

      let customersCount = 0

      const {
        count: customers,
        error: customersError,
      } = await supabase
        .from("customers")
        .select("*", {
          count: "exact",
          head: true,
        })

      if (!customersError) {
        customersCount =
          customers || 0
      }

      // =================================================
      // RECEITA
      //
      // NÃO CALCULAMOS MAIS:
      //
      // preço × estoque
      //
      // A receita fica 0 até existirem vendas
      // reais registadas.
      // =================================================

      let totalRevenue = 0
      let todaySales = 0

      /*
       * Neste momento deixamos a receita como 0
       * porque precisamos conhecer exatamente
       * as colunas existentes na sua tabela orders.
       *
       * Quando houver vendas reais, vamos buscar
       * o valor dos pedidos pagos/concluídos.
       */

      // =================================================
      // ATUALIZAR ESTATÍSTICAS
      // =================================================

      setStats({
        receita: totalRevenue,

        pedidos: ordersCount,

        clientes: customersCount,

        produtos: totalProducts,

        produtosAtivos: activeProducts,

        produtosInativos: inactiveProducts,

        estoqueTotal: totalStock,

        valorEstoque: stockValue,

        produtosEstoqueBaixo:
          lowStockProducts,

        visitantes: 0,

        conversao: "0%",

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
  // CARREGAR AO ABRIR
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

        {/* =================================================
            CABEÇALHO
        ================================================= */}

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

        {/* =================================================
            ERRO
        ================================================= */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* =================================================
            CARTÕES PRINCIPAIS
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* RECEITA */}

          <Card
            title="Receita Total"
            value={formatMZN(stats.receita)}
            icon={
              <DollarSign
                size={26}
              />
            }
          />

          {/* PEDIDOS */}

          <Card
            title="Pedidos"
            value={stats.pedidos}
            icon={
              <ShoppingCart
                size={26}
              />
            }
          />

          {/* CLIENTES */}

          <Card
            title="Clientes"
            value={stats.clientes}
            icon={
              <Users
                size={26}
              />
            }
          />

          {/* PRODUTOS */}

          <Card
            title="Produtos"
            value={stats.produtos}
            icon={
              <Package
                size={26}
              />
            }
          />

        </div>

        {/* =================================================
            INFORMAÇÕES DOS PRODUTOS
        ================================================= */}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* PRODUTOS ATIVOS */}

          <InfoCard
            title="Produtos disponíveis"
            value={stats.produtosAtivos}
            description="Produtos ativos na loja"
            icon={
              <Package
                size={23}
              />
            }
          />

          {/* PRODUTOS INATIVOS */}

          <InfoCard
            title="Produtos inativos"
            value={stats.produtosInativos}
            description="Produtos desativados"
            icon={
              <Package
                size={23}
              />
            }
          />

          {/* ESTOQUE */}

          <InfoCard
            title="Estoque total"
            value={stats.estoqueTotal}
            description="Unidades disponíveis"
            icon={
              <BarChart3
                size={23}
              />
            }
          />

        </div>

        {/* =================================================
            VALOR DO ESTOQUE
        ================================================= */}

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
              {formatMZN(
                stats.valorEstoque
              )}
            </span>

          </div>

          <p className="mt-2 text-xs text-gray-500">
            Este valor não representa vendas ou receita.
          </p>

        </div>

        {/* =================================================
            ESTOQUE BAIXO
        ================================================= */}

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
              {
                stats.produtosEstoqueBaixo
              }
            </span>

            <span className="ml-2 text-sm text-gray-500">
              produto(s)
            </span>

          </div>

        </div>

        {/* =================================================
            MÉTRICAS
        ================================================= */}

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

          <Metric
            title="Visitantes"
            value={stats.visitantes}
            icon={
              <Eye size={24} />
            }
          />

          <Metric
            title="Taxa de Conversão"
            value={stats.conversao}
            icon={
              <TrendingUp
                size={24}
              />
            }
          />

          <Metric
            title="Vendas Hoje"
            value={stats.vendasHoje}
            icon={
              <BarChart3
                size={24}
              />
            }
          />

        </div>

        {/* =================================================
            GRÁFICO
        ================================================= */}

        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm md:p-6">

          <h2 className="text-lg font-bold text-gray-900 md:text-xl">
            Vendas dos últimos 30 dias
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Ainda não existem dados de vendas suficientes
            para apresentar o gráfico.
          </p>

          <div className="mt-6 flex h-40 items-end gap-2">

            {[
              0,
              0,
              0,
              0,
              0,
              0,
              0,
            ].map(
              (_, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t-lg bg-blue-100"
                  style={{
                    height: "5%",
                  }}
                />
              )
            )}

          </div>

        </div>

        {/* =================================================
            PEDIDOS
        ================================================= */}

        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">

          <div className="border-b border-gray-200 p-5 md:p-6">

            <h2 className="text-lg font-bold text-gray-900 md:text-xl">
              Últimos pedidos
            </h2>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[600px]">

              <thead>

                <tr className="border-b bg-gray-50 text-left text-sm text-gray-600">

                  <th className="p-4">
                    Cliente
                  </th>

                  <th className="p-4">
                    Produto
                  </th>

                  <th className="p-4">
                    Valor
                  </th>

                  <th className="p-4">
                    Estado
                  </th>

                </tr>

              </thead>

              <tbody>

                <tr className="border-b text-sm text-gray-900">

                  <td className="p-4">
                    Nenhum pedido
                  </td>

                  <td className="p-4">
                    -
                  </td>

                  <td className="p-4">
                    0 MZN
                  </td>

                  <td className="p-4">
                    Aguardando
                  </td>

                </tr>

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