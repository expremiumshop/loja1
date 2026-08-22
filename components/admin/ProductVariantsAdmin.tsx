"use client"

import { Plus, Trash2, X } from "lucide-react"

export type ProductOptionInput = {
  name: string
  values: string[]
  position?: number
}

const optionNames = [
  "Cor",
  "Tamanho",
  "Modelo",
  "Capacidade",
  "Memória RAM",
  "Volume",
  "Material",
]

type ProductVariantsAdminProps = {
  options: ProductOptionInput[]
  onChange: (options: ProductOptionInput[]) => void
}

export default function ProductVariantsAdmin({
  options,
  onChange,
}: ProductVariantsAdminProps) {
  function addOption(kind: string) {
    const name = kind === "Personalizado" ? "" : kind

    onChange([
      ...options,
      {
        name,
        values: [],
        position: options.length,
      },
    ])
  }

  function updateOption(
    index: number,
    changes: Partial<ProductOptionInput>
  ) {
    onChange(
      options.map((option, optionIndex) =>
        optionIndex === index
          ? {
              ...option,
              ...changes,
            }
          : option
      )
    )
  }

  function addValue(index: number) {
    const option = options[index]

    if (!option) return

    updateOption(index, {
      values: [...option.values, ""],
    })
  }

  function updateValue(
    optionIndex: number,
    valueIndex: number,
    value: string
  ) {
    const option = options[optionIndex]

    if (!option) return

    updateOption(optionIndex, {
      values: option.values.map((item, index) =>
        index === valueIndex ? value : item
      ),
    })
  }

  function removeValue(
    optionIndex: number,
    valueIndex: number
  ) {
    const option = options[optionIndex]

    if (!option) return

    updateOption(optionIndex, {
      values: option.values.filter(
        (_, index) => index !== valueIndex
      ),
    })
  }

  function removeOption(index: number) {
    const newOptions = options
      .filter((_, optionIndex) => optionIndex !== index)
      .map((option, position) => ({
        ...option,
        position,
      }))

    onChange(newOptions)
  }

  return (
    <section className="rounded-xl bg-white p-6 shadow">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">
            Variantes do Produto
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Adicione apenas as opções que este produto possui.
          </p>
        </div>

        <select
          defaultValue=""
          onChange={(event) => {
            const value = event.target.value

            if (value) {
              addOption(value)
              event.target.value = ""
            }
          }}
          className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold"
        >
          <option value="" disabled>
            + Adicionar opção
          </option>

          {optionNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}

          <option value="Personalizado">
            Personalizado
          </option>
        </select>
      </div>

      {options.length === 0 && (
        <p className="rounded-lg border border-dashed p-4 text-sm text-gray-500">
          Este produto ainda não possui variantes.
        </p>
      )}

      <div className="space-y-4">
        {options.map((option, optionIndex) => (
          <div
            key={`${option.name}-${optionIndex}`}
            className="rounded-lg border p-4"
          >
            <div className="flex gap-3">
              <label className="flex-1 text-sm font-semibold">
                Nome da opção

                <input
                  value={option.name}
                  onChange={(event) =>
                    updateOption(optionIndex, {
                      name: event.target.value,
                    })
                  }
                  placeholder="Ex: Tamanho"
                  className="mt-2 w-full rounded-lg border p-3 font-normal"
                />
              </label>

              <button
                type="button"
                onClick={() => removeOption(optionIndex)}
                className="mt-7 h-11 rounded-lg border border-red-200 px-3 text-red-600 hover:bg-red-50"
                aria-label="Remover opção"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-sm font-semibold">
                Valores
              </p>

              {option.values.map(
                (value, valueIndex) => (
                  <div
                    key={`${optionIndex}-${valueIndex}`}
                    className="flex gap-2"
                  >
                    <input
                      value={value}
                      onChange={(event) =>
                        updateValue(
                          optionIndex,
                          valueIndex,
                          event.target.value
                        )
                      }
                      placeholder="Ex: M"
                      className="flex-1 rounded-lg border p-3"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeValue(
                          optionIndex,
                          valueIndex
                        )
                      }
                      className="rounded-lg border border-red-200 px-3 text-red-600 hover:bg-red-50"
                      aria-label="Remover valor"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )
              )}

              <button
                type="button"
                onClick={() => addValue(optionIndex)}
                className="inline-flex items-center gap-2 pt-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                <Plus size={17} />
                Adicionar valor
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}