'use client'

import { useState } from 'react'
import { Mail, CheckCircle } from 'lucide-react'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      setTimeout(() => {
        setEmail('')
        setIsSubmitted(false)
      }, 2000)
    }
  }

  return (
    <div className="bg-white py-12 md:py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-8 md:p-12 text-center border border-primary/20">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-6">
            <Mail className="w-8 h-8 text-primary" />
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
            Stay Updated
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Get exclusive offers, new arrivals, and insider tips delivered to your inbox
          </p>

          {/* Form */}
          <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 md:py-4 bg-white text-foreground rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
            />
            <button
              type="submit"
              disabled={isSubmitted}
              className="px-8 py-3 md:py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-75 whitespace-nowrap flex items-center justify-center gap-2"
            >
              {isSubmitted ? (
                <>
                  <CheckCircle size={20} />
                  Subscribed!
                </>
              ) : (
                'Subscribe'
              )}
            </button>
          </form>

          {/* Note */}
          <p className="text-xs text-muted-foreground mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  )
}
