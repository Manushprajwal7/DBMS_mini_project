"use client"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

export function Stripe({ children, options, className }) {
  const [clientSecret, setClientSecret] = useState("")

  useEffect(() => {
    // Create a payment intent on the server and get the client secret
    // This is a placeholder for demonstration purposes
    // In a real app, you would fetch this from your server
    setClientSecret("demo_secret_key")
  }, [])

  return (
    <div className={className}>
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          {children}
        </Elements>
      )}
    </div>
  )
}

