import {
  Zap,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react"

const benefits = [
  {
    icon: Zap,
    title: "Entrega em horas",
  },
  {
    icon: ShieldCheck,
    title: "Pagamento seguro",
  },
  {
    icon: BadgeCheck,
    title: "Vendedores verificados",
  },
]

export function TopBenefits() {
  return (
    <section className="w-full px-3 py-1 md:px-6 md:py-2">
      <div
        className="
          mx-auto
          grid
          w-full
          max-w-[1440px]
          grid-cols-3
          gap-2
          md:gap-4
        "
      >
        {benefits.map((benefit) => {
          const Icon = benefit.icon

          return (
            <div
              key={benefit.title}
              className="
                flex
                min-h-[92px]
                flex-col
                items-center
                justify-center
                rounded-2xl
                border
                border-border
                bg-white
                px-2
                py-3
                text-center
                md:min-h-[120px]
                md:px-6
                md:py-5
              "
            >
              <Icon
                className="
                  mb-2
                  h-6
                  w-6
                  text-primary
                  md:h-7
                  md:w-7
                "
              />

              <h3
                className="
                  text-xs
                  font-bold
                  leading-tight
                  text-foreground
                  sm:text-sm
                  md:text-base
                  lg:text-lg
                "
              >
                {benefit.title}
              </h3>
            </div>
          )
        })}
      </div>
    </section>
  )
}