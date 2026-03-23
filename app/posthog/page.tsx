"use client"

import posthog from 'posthog-js'

export default function CheckoutPage() {
    function handlePurchase() {
        posthog.capture('purchase_completed', { amount: 99 })
    }

    return (
        <button onClick={handlePurchase}> click me to purchase</button>
    )
}
