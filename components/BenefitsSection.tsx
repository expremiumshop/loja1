import { Truck, Lock, Award, Headphones } from 'lucide-react'

const benefits = [
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Swift shipping with real-time tracking to your doorstep',
  },
  {
    icon: Lock,
    title: 'Secure Payment',
    description: 'Industry-leading encryption for safe transactions',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Every product verified for excellence and authenticity',
  },
  {
    icon: Headphones,
    title: 'Customer Support',
    description: '24/7 dedicated support to assist your needs',
  },
]

export function BenefitsSection() {
  return (
    <div className="bg-secondary py-12 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
            Why Choose EXPREMIUM SHOP
          </h2>
          <p className="text-muted-foreground text-lg">Experience excellence in every aspect</p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-4 gap-6 md:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 md:p-8 text-center hover:shadow-lg transition-all duration-300 hover:border-primary/20 border border-border group"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                  <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
