import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { HandCoins, Lock, Lightbulb, Orbit } from 'lucide-react'

export function MainValuePropositionSection() {
    return (
        <section className="bg-card rounded-2xl py-12 lg:p-16">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center px-4">
                    <h2 className="text-4xl font-bold mb-6">Take Control of Your Subscription Costs</h2>
                    <p className="text-lg mb-6 text-muted-foreground">
                        In today&apos;s subscription economy, the average person spends over $273 monthly on subscriptions –
                        often without realizing it. Substotal helps you track, manage, and optimize your recurring expenses
                        with a simple, privacy-focused tool.
                    </p>
                </div>

                <div className="mt-12">
                    <h3 className="text-3xl font-bold text-center mb-8">Your Subscription Dashboard</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-8">
                        <Card className="bg-background">
                            <CardContent className="pt-4">
                                <HandCoins className="text-primary mb-8 w-10 h-10" />
                                <h4 className="text-xl font-bold mb-2">View Total Costs</h4>
                                <p className="text-muted-foreground">See your monthly and yearly subscription expenses at a glance</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-background">
                            <CardContent className="pt-4">
                                <Lock className="text-primary mb-8 w-10 h-10" />
                                <h4 className="text-xl font-bold mb-2">Track Commitments</h4>
                                <p className="text-muted-foreground">Identify locked-in subscriptions you can&apos;t cancel yet</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-background">
                            <CardContent className="pt-4">
                                <Orbit className="text-primary mb-8 w-10 h-10" />
                                <h4 className="text-xl font-bold mb-2">Plan Ahead</h4>
                                <p className="text-muted-foreground">Visualize upcoming payments and renewal dates</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-background">
                            <CardContent className="pt-4">
                                <Lightbulb className="text-primary mb-8 w-10 h-10" />
                                <h4 className="text-xl font-bold mb-2">Make Smarter Decisions</h4>
                                <p className="text-muted-foreground">Spot opportunities to save money</p>
                            </CardContent>
                        </Card>
                    </div>
                    <p className="text-center mt-8">
                        All data stays on your device – we never collect or store your personal information.<br />
                        <i className="text-muted-foreground">You can also <Link href="/sign-up" className="underline text-foreground">sign up</Link> to use cloud storage, and keep your data synced between devices</i>
                    </p>
                </div>
            </div>
        </section>
    )
}