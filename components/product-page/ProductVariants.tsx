"use client"

import { useState } from "react"

export type ProductOption = {
  id: string
  name: string
  value: string
  position: number
}

type Props = {
  options?: ProductOption[] | null
}

export default function ProductVariants({ options = [] }: Props) {

  const [selected, setSelected] = useState<Record<string, string>>({})


  const groups = (options ?? []).reduce<
    Record<string, ProductOption[]>
  >(
    (all, option) => {

      if (
        option.name?.trim() &&
        option.value?.trim()
      ) {

        ;(all[option.name] ??= []).push(option)

      }

      return all

    },
    {}
  )


  if (Object.keys(groups).length === 0) {
    return null
  }


  return (
    <div className="space-y-5">

      {Object.entries(groups).map(
        ([name, values]) => (

          <div key={name}>

            <div className="mb-3 text-sm font-semibold text-gray-800">
              {name}:{" "}

              <span className="font-normal text-gray-500">
                {selected[name] ?? "Selecionar"}
              </span>

            </div>


            <div className="flex flex-wrap gap-2">

              {values
                .sort(
                  (a, b) =>
                    a.position - b.position
                )
                .map((option) => (

                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      setSelected((current) => ({
                        ...current,
                        [name]: option.value,
                      }))
                    }
                    className={`
                      rounded-lg
                      border
                      px-5
                      py-2
                      text-sm
                      transition

                      ${
                        selected[name] === option.value
                        ?
                        "border-orange-500 bg-orange-50 text-orange-600"
                        :
                        "border-gray-300 hover:border-orange-400"
                      }
                    `}
                  >
                    {option.value}
                  </button>

                ))}

            </div>

          </div>

        )
      )}

    </div>
  )
}