import Link from 'next/link'
import { Card } from "@/components/ui/card"

export function SubscriptionCostFactsSection() {
    return (
        <section>
            <div className="bg-card rounded-2xl py-16">
                <div className="container mx-auto px-4 max-w-3xl text-center">
                    <h2 className="text-4xl font-bold mb-8">The Real Cost of Subscription Creep</h2>
                    <p className="text-lg mb-8 text-muted-foreground">
                        The average American household unknowingly spends an extra $528 annually on unused or
                        forgotten subscriptions. Substotal helps you identify these hidden costs.
                    </p>
                    <Card className="p-6 bg-background rounded-lg">
                        <p className="text-lg font-semibold">
                            Did you know? Converting monthly subscriptions to annual plans can save you
                            up to 20% on your total subscription costs. <Link href="/subscriptions" className="underline">Start managing</Link> your subscriptions today.
                        </p>
                    </Card>
                </div>
            </div>
        </section>
    )
}