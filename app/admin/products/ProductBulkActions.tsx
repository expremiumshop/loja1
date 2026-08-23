"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"

interface ProductBulkActionsProps {
  selectedIds: string[]
  onDeleted: () => void
}

export default function ProductBulkActions({
  selectedIds,
  onDeleted,
}: ProductBulkActionsProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (selectedIds.length === 0) {
      return
    }

    const confirmed = window.confirm(
      `Tem certeza que deseja eliminar ${selectedIds.length} produto(s)?\n\nEsta ação não pode ser desfeita.`
    )

    if (!confirmed) {
      return
    }

    try {
      setLoading(true)

      const response = await fetch("/api/admin/products/bulk-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: selectedIds,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result?.error || "Erro ao eliminar produtos."
        )
      }

      alert(
        `${selectedIds.length} produto(s) eliminado(s) com sucesso.`
      )

      onDeleted()
    } catch (error) {
      console.error("Erro ao eliminar produtos:", error)

      alert(
        error instanceof Error
          ? error.message
          : "Erro ao eliminar produtos."
      )
    } finally {
      setLoading(false)
    }
  }

  if (selectedIds.length === 0) {
    return null
  }

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold text-red-800">
          {selectedIds.length} produto(s) selecionado(s)
        </p>

        <p className="text-sm text-red-600">
          Pode eliminar os produtos selecionados.
        </p>
      </div>

      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="
          inline-flex
          min-h-11
          w-full
          items-center
          justify-center
          gap-2
          rounded-lg
          bg-red-600
          px-5
          py-3
          text-sm
          font-bold
          text-white
          transition
          hover:bg-red-700
          disabled:cursor-not-allowed
          disabled:opacity-60
          sm:w-auto
        "
      >
        <Trash2 size={18} />

        {loading
          ? "A eliminar..."
          : "Eliminar selecionados"}
      </button>
    </div>
  )
}