"use client";

import { useRef } from 'react'
import { useInView, motion } from 'motion/react'

function HowItWorksItem({ number, children }: {
    number: number
    children: React.ReactNode
}) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    return (
        <motion.div
            ref={ref}
            className="text-center"
            initial={{ opacity: 0, translateY: 20 }}
            animate={isInView ? { opacity: 1, translateY: 0, transition: { duration: 0.3, delay: 0.2 * number, } } : {}}
        >
            <motion.div
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-primary-foreground text-4xl mb-8"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1, transition: { duration: 0.3, delay: 0.2 * number } } : {}}
            >
                {number}
            </motion.div>
            {children}
        </motion.div>
    )
}

export function HowItWorksSection() {
    return (
        <section id="how-it-works" className="py-16 container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-20 text-center">How Substotal Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <HowItWorksItem number={1}>
                    <h3 className="text-xl font-semibold mb-2">Add Your Subscriptions</h3>
                    <p className="text-muted-foreground">Simply enter the name, cost, and billing frequency of each subscription.</p>
                </HowItWorksItem>
                <HowItWorksItem number={2}>
                    <h3 className="text-xl font-semibold mb-2">Visualize Your Spending</h3>
                    <p className="text-muted-foreground">Instantly see your total monthly and annual expenses with clear, intuitive charts.</p>
                </HowItWorksItem>
                <HowItWorksItem number={3}>
                    <h3 className="text-xl font-semibold mb-2">Identify Opportunities</h3>
                    <p className="text-muted-foreground">Spot redundant services, unused subscriptions, and opportunities to switch from monthly to annual billing.</p>
                </HowItWorksItem>
                <HowItWorksItem number={4}>
                    <h3 className="text-xl font-semibold mb-2">Stay on Top of Renewals</h3>
                    <p className="text-muted-foreground">Never be surprised by an unexpected charge again.</p>
                </HowItWorksItem>
            </div>
        </section>
    )
}