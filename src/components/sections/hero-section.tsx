import Image from 'next/image'
import Link from 'next/link'
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CornerLeftDown } from "lucide-react"
import { StarRating } from "@/components/star-rating"


export function HeroSection() {
    return (
        <section className="container mx-auto px-4 pt-24 pb-16 text-center">
            <h1 className="text-5xl sm:text-7xl max-w-4xl mx-auto font-bold tracking-tighter mb-6">Track Your Subscriptions and Take Control of Your Spending</h1>
            <p className="text-lg sm:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Manage all your subscriptions in one place. Use privately with no account, or sign up and sync across all your devices.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
                <Button size="lg" className="text-md font-semibold px-8">
                    <Link href="/subscriptions">
                        Go to Dashboard
                    </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-md font-semibold px-8">
                    <Link href="/sign-up">Sign Up</Link>
                </Button>
            </div>
            <Button asChild variant="link" size="lg" className="text-md font-semibold px-8 mt-2">
                <a href="#how-it-works"><CornerLeftDown className="translate-y-2 w-4 h-4 scale-[1.5]" />See How It Works</a>
            </Button>
            <div className="flex items-center justify-center gap-2 mt-12">
                <div className="flex">
                    <Avatar className="w-12 h-12 -ml-5 border-4 border-background rounded-full">
                        <Image src="/images/therese.jpg" alt="Therese H." className="rounded-full" width={48} height={48} />
                    </Avatar>
                    <Avatar className="w-12 h-12 -ml-5 border-4 border-background rounded-full">
                        <Image src="/images/marcus.jpg" alt="Mercus O." className="rounded-full" width={48} height={48} />
                    </Avatar>
                    <Avatar className="w-12 h-12 -ml-5 border-4 border-background rounded-full">
                        <Image src="/images/elin.jpg" alt="Elin J." className="rounded-full" width={48} height={48} />
                    </Avatar>
                    <Avatar className="w-12 h-12 -ml-5 border-4 border-background rounded-full">
                        <Image src="/images/pierre-yves.jpg" alt="Pierre-Yves R." className="rounded-full" width={48} height={48} />
                    </Avatar>
                    <Avatar className="w-12 h-12 -ml-5 border-4 border-background rounded-full">
                        <Image src="/images/mikael.jpg" alt="Mikael K." className="rounded-full" width={48} height={48} />
                    </Avatar>
                </div>
                <div className="flex flex-col gap-1 items-start">
                    <StarRating />
                    <p className="text-xs text-muted-foreground text-left leading-none">Loved by a growing<br />user community</p>
                </div>
            </div>
        </section>
    )
}