import { Truck, Lock, Award, Headphones } from 'lucide-react'

const benefits = [
  {
    icon: Truck,
    title: 'Entrega em Moçambique',
    description:
      'Receba os seus produtos com segurança e acompanhe as informações da sua entrega.',
  },
  {
    icon: Lock,
    title: 'Pagamento Seguro',
    description:
      'Os seus dados e informações de pagamento são tratados com segurança durante a compra.',
  },
  {
    icon: Award,
    title: 'Produtos Selecionados',
    description:
      'Selecionamos produtos de diferentes categorias procurando oferecer qualidade e bons preços.',
  },
  {
    icon: Headphones,
    title: 'Atendimento ao Cliente',
    description:
      'Estamos disponíveis para ajudar com dúvidas sobre produtos, pedidos, pagamentos e entregas.',
  },
]

export function BenefitsSection() {
  return (
    <div className="bg-secondary px-4 py-12 md:py-16">
      <div className="mx-auto max-w-7xl">

        {/* TÍTULO DA SEÇÃO */}
        <div className="mb-12 text-center">

          <h2 className="mb-3 text-balance text-3xl font-bold text-foreground md:text-4xl">
            EXPREMIUM SHOP
          </h2>

          <p className="text-lg text-muted-foreground">
            Uma experiência de compra simples, segura e conveniente
          </p>

        </div>

        {/* BENEFÍCIOS */}
        <div className="grid gap-6 md:grid-cols-4 md:gap-8">

          {benefits.map((benefit, index) => {
            const Icon = benefit.icon

            return (
              <div
                key={index}
                className="group rounded-2xl border border-border bg-white p-6 text-center transition-all duration-300 hover:border-primary/20 hover:shadow-lg md:p-8"
              >

                {/* ÍCONE — MANTIDO */}
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-all group-hover:bg-primary group-hover:text-white">

                  <Icon className="h-7 w-7 text-primary transition-colors group-hover:text-white" />

                </div>

                {/* TÍTULO */}
                <h3 className="mb-2 text-lg font-bold text-foreground">
                  {benefit.title}
                </h3>

                {/* INFORMAÇÃO */}
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>

              </div>
            )
          })}

        </div>
      </div>
    </div>
  )
}