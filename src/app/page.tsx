import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HandCoins, Lightbulb, Lock, Orbit } from "lucide-react";
import { StarRating } from "@/components/star-rating";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { Avatar } from "@radix-ui/react-avatar";
import Image from "next/image";

const metaTitle = "Substotal - Track Your Subscriptions and Save Money";
const metaDescription = "Manage all your subscriptions in one place. No account required, completely private, and forever free.";

export const metadata: Metadata = {
  title: metaTitle,
  description: metaDescription,
  keywords: ["subscription tracker", "subscription management", "expense tracking", "personal finance", "budget tool"],
  openGraph: {
    title: metaTitle,
    description: metaDescription,
    images: [
      {
        url: "/home-og.png",
        width: 2400,
        height: 1260,
        alt: "Substotal - Subscription Tracker",
      },
    ],
  },
};

export default function LandingPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <header className="container mx-auto px-4 pt-24 pb-16 text-center">
        <h1 className="text-5xl sm:text-7xl max-w-4xl mx-auto font-bold tracking-tighter mb-6">Track Your Subscriptions and Take Control of Your Spending</h1>
        <p className="text-lg sm:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Manage all your subscriptions in one place.<br className="hidden sm:block" />No account required, completely private, and forever free.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/subscriptions">
            <Button size="lg" className="text-lg px-8">Start Tracking Now</Button>
          </Link>
          <Button asChild variant="outline" size="lg" className="text-lg px-8">
            <a href="#how-it-works">See How It Works</a>
          </Button>
        </div>
        <div className="flex items-center justify-center gap-2 mt-12">
          <div className="flex">
            <Avatar className="w-12 h-12 -ml-5 border-4 border-background rounded-full">
              <Image src="/images/therese.png" alt="Therese H." className="rounded-full" width={48} height={48} />
            </Avatar>
            <Avatar className="w-12 h-12 -ml-5 border-4 border-background rounded-full">
              <Image src="/images/marcus.png" alt="Mercus O." className="rounded-full" width={48} height={48} />
            </Avatar>
            <Avatar className="w-12 h-12 -ml-5 border-4 border-background rounded-full">
              <Image src="/images/elin.png" alt="Elin J." className="rounded-full" width={48} height={48} />
            </Avatar>
            <Avatar className="w-12 h-12 -ml-5 border-4 border-background rounded-full">
              <Image src="/images/mikael.png" alt="Mikael K." className="rounded-full" width={48} height={48} />
            </Avatar>
          </div>
          <div className="flex flex-col gap-1 items-start">
            <StarRating />
            <p className="text-xs text-muted-foreground text-left leading-none">Loved by a growing<br />user community</p>
          </div>
        </div>
      </header>

      {/* Main Value Proposition */}
      <section className="bg-accent rounded-2xl py-12 lg:p-16">
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
              <Card>
                <CardContent className="pt-4">
                  <HandCoins className="text-primary mb-4 w-12 h-12" />
                  <h4 className="text-xl font-bold mb-2">View Total Costs</h4>
                  <p className="text-muted-foreground">See your monthly and yearly subscription expenses at a glance</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <Lock className="text-primary mb-4 w-12 h-12" />
                  <h4 className="text-xl font-bold mb-2">Track Commitments</h4>
                  <p className="text-muted-foreground">Identify locked-in subscriptions you can&apos;t cancel yet</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <Orbit className="text-primary mb-4 w-12 h-12" />
                  <h4 className="text-xl font-bold mb-2">Plan Ahead</h4>
                  <p className="text-muted-foreground">Visualize upcoming payments and renewal dates</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <Lightbulb className="text-primary mb-4 w-12 h-12" />
                  <h4 className="text-xl font-bold mb-2">Make Smarter Decisions</h4>
                  <p className="text-muted-foreground">Spot opportunities to save money</p>
                </CardContent>
              </Card>
            </div>
            <div className="text-center mt-8">
              All data stays on your device – we never collect or store your personal information.
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-20 text-center">How Substotal Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-primary-foreground text-4xl mb-8">1</div>
            <h3 className="text-xl font-semibold mb-2">Add Your Subscriptions</h3>
            <p className="text-muted-foreground">Simply enter the name, cost, and billing frequency of each subscription.</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-primary-foreground text-4xl mb-8">2</div>
            <h3 className="text-xl font-semibold mb-2">Visualize Your Spending</h3>
            <p className="text-muted-foreground">Instantly see your total monthly and annual expenses with clear, intuitive charts.</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-primary-foreground text-4xl mb-8">3</div>
            <h3 className="text-xl font-semibold mb-2">Identify Savings Opportunities</h3>
            <p className="text-muted-foreground">Spot redundant services, unused subscriptions, and opportunities to switch from monthly to annual billing.</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-primary-foreground text-4xl mb-8">4</div>
            <h3 className="text-xl font-semibold mb-2">Stay on Top of Renewals</h3>
            <p className="text-muted-foreground">Never be surprised by an unexpected charge again.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Subscription Categories */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">Common Subscription Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Entertainment & Streaming</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Netflix, HBO Max, Disney+, Spotify, YouTube Premium</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Software & Apps</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Microsoft 365, Adobe Creative Cloud, Dropbox, LastPass</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Delivery & Food</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Hello Fresh, DoorDash+, Amazon Prime</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Fitness & Wellness</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Gym memberships, meditation apps, online fitness programs</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Gaming</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Xbox Game Pass, PlayStation Plus, Nintendo Online</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Subscription Cost Facts */}
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
                up to 20% on your total subscription costs.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-2xl font-bold">Is Substotal really free?</AccordionTrigger>
              <AccordionContent>
                Yes, Substotal is currently completely free to use. We believe in providing a tool that helps you manage your finances without any cost. If you find value in it, consider sharing it with others or leaving a review.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-2xl font-bold">Do I need to create an account?</AccordionTrigger>
              <AccordionContent>
                No. Substotal works entirely in your browser without requiring an account or login. However, you can create an account to sync your data across devices.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-2xl font-bold">Where is my data stored?</AccordionTrigger>
              <AccordionContent>
                If you use Substotal without an account, all your subscription data is stored locally on your device. If you create an account, your data is securely stored in <a className="text-foreground underline" target="_blank" href="https://supabase.com">Supabase</a> cloud storage.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-2xl font-bold">Can I export my data?</AccordionTrigger>
              <AccordionContent>
                Yes, you can export your subscription data as a JSON file for backup or analysis in other tools.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-2xl font-bold">Does Substotal work on mobile?</AccordionTrigger>
              <AccordionContent>
                Yes, Substotal is fully responsive and works on smartphones, tablets, and computers.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-2xl font-bold">Can Substotal automatically detect my subscriptions?</AccordionTrigger>
              <AccordionContent>
                No. To maintain your privacy, Substotal doesn&apos;t connect to your bank or email accounts. You add subscriptions manually.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
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
    </div>
  );
}