import {
  Truck,
  Lock,
  Award,
  Headphones,
} from "lucide-react"

const benefits = [
  {
    icon: Truck,
    title: "Entrega em Moçambique",
    description:
      "Receba os seus produtos com segurança e acompanhe a sua entrega.",
  },
  {
    icon: Lock,
    title: "Compra segura",
    description:
      "Os seus dados são tratados com segurança durante a sua compra.",
  },
  {
    icon: Award,
    title: "Produtos verificados",
    description:
      "Encontre produtos e vendedores selecionados para uma experiência melhor.",
  },
  {
    icon: Headphones,
    title: "Suporte ao cliente",
    description:
      "Conte com a nossa equipa para ajudar sempre que precisar.",
  },
]

export function BenefitsSection() {
  return (
    <section className="w-full px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* =====================================================
            TÍTULO
            ===================================================== */}
        <div className="mb-6 text-center md:text-left">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            Porquê comprar na EXPREMIUM?
          </h2>

          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Uma experiência de compra simples, segura e confiável.
          </p>
        </div>

        {/* =====================================================
            4 BENEFÍCIOS INFERIORES

            CELULAR:
            1
            2
            3
            4

            PC:
            1 | 2 | 3 | 4
            ===================================================== */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5">
          {benefits.map((benefit) => {
            const Icon = benefit.icon

            return (
              <div
                key={benefit.title}
                className="
                  flex
                  min-h-[120px]
                  items-center
                  gap-4
                  rounded-2xl
                  border
                  border-border
                  bg-white
                  px-5
                  py-5
                  shadow-sm
                  transition
                  hover:-translate-y-1
                  hover:shadow-md
                  md:min-h-[190px]
                  md:flex-col
                  md:items-center
                  md:justify-center
                  md:px-4
                  md:text-center
                "
              >
                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-primary/10
                    md:h-14
                    md:w-14
                  "
                >
                  <Icon className="h-6 w-6 text-primary md:h-7 md:w-7" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-foreground md:text-lg">
                    {benefit.title}
                  </h3>

                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}