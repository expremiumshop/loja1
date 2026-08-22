"use client"

import { useState } from "react"

export type ProductOption = {
  id: string
  name: string
  values: string[]
}

type Props = {
  options?: ProductOption[] | null

  onChange?: (
    selected: Record<string, string>
  ) => void
}

export default function ProductVariants({
  options = [],
  onChange,
}: Props) {
  const [selected, setSelected] =
    useState<Record<string, string>>({})

  if (!options || options.length === 0) {
    return null
  }

  function selectOption(
    optionName: string,
    value: string
  ) {
    setSelected((current) => {
      const updated = {
        ...current,
        [optionName]: value,
      }

      onChange?.(updated)

      return updated
    })
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-[#fffdf7] p-4 md:p-5">
      <div className="space-y-5">

        {options.map((option) => {
          if (
            !option.name ||
            !option.values?.length
          ) {
            return null
          }

          const values = option.values

          return (
            <div key={option.id}>

              {/* NOME DA VARIAÇÃO */}

              <div className="mb-3 flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-800">
                  {option.name}:
                </span>

                <span className="text-sm text-gray-500">
                  {selected[option.name] ||
                    "Selecionar"}
                </span>
              </div>

              {/* VALORES */}

              <div className="flex flex-wrap gap-2">

                {values.map(
                  (value, index) => {
                    const isSelected =
                      selected[option.name] ===
                      value

                    return (
                      <button
                        key={`${option.id}-${value}-${index}`}
                        type="button"
                        onClick={() =>
                          selectOption(
                            option.name,
                            value
                          )
                        }
                        className={`
                          min-w-[70px]
                          rounded-md
                          border
                          bg-white
                          px-4
                          py-2
                          text-sm
                          font-medium
                          transition-all
                          duration-200
                          active:scale-95
                          ${
                            isSelected
                              ? "border-orange-500 bg-orange-50 text-orange-600 ring-1 ring-orange-500"
                              : "border-gray-300 text-gray-700 hover:border-orange-400 hover:text-orange-500"
                          }
                        `}
                      >
                        {value}
                      </button>
                    )
                  }
                )}

              </div>
            </div>
          )
        })}

      </div>
    </div>
  )
}