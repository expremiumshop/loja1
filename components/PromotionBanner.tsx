'use client'

import { useState, useEffect } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
}

export function PromotionBanner() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 2, hours: 14, minutes: 35 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59 }
        }
        return prev
      })
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent py-8 md:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="animate-fade-in">
            <div className="inline-block bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
              Limited Offer
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Premium Deals For Everyone
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Discover quality products with exclusive offers
            </p>

            {/* Countdown Timer */}
            <div className="flex gap-4 mb-8">
              <div className="bg-white px-4 py-2 rounded-lg text-center shadow-sm">
                <div className="text-2xl font-bold text-primary">{String(timeLeft.days).padStart(2, '0')}</div>
                <div className="text-xs text-muted-foreground uppercase">Days</div>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg text-center shadow-sm">
                <div className="text-2xl font-bold text-primary">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-xs text-muted-foreground uppercase">Hours</div>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg text-center shadow-sm">
                <div className="text-2xl font-bold text-primary">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-xs text-muted-foreground uppercase">Minutes</div>
              </div>
            </div>

            <button className="bg-primary text-white px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-primary/90 transition-all active:scale-95 shadow-lg hover:shadow-xl">
              Shop Now
            </button>
          </div>

          {/* Right Visual */}
          <div className="hidden md:block relative h-80 bg-gradient-to-br from-secondary to-white rounded-3xl shadow-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary/20 mb-4">✨</div>
                <p className="text-foreground/60 font-semibold">Premium Shopping</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
