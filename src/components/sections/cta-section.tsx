import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaSection() {
    return (
        <section className="bg-accent text-accent-foreground py-16 rounded-2xl">
            <div className="max-w-3xl mx-auto px-6 text-center text-balance">
                <h2 className="text-4xl sm:text-5xl font-bold mb-6">Start Managing Your Subscriptions Today</h2>
                <p className="text-xl mb-8">Join a growing community of users taking charge of their subscription expenses with Substotal!</p>
                <div className="flex flex-wrap gap-4 justify-center">
                    <Link href="/subscriptions">
                        <Button size="lg" className="text-lg px-8">Track Your Subscriptions Now</Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}