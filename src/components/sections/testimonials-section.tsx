"use client";

import { ReviewCard } from "@/components/review-card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

export function TestimonialsSection() {
    return (
        <section>
            <div className="bg-card rounded-2xl py-12 lg:p-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold mb-12 text-center">Why People Choose Substotal</h2>
                    <Carousel
                        opts={{
                            loop: true,
                        }}
                        plugins={[
                            Autoplay({
                                delay: 3000,
                            }),
                        ]}
                    >
                        <CarouselContent>
                            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                                <ReviewCard
                                    avatar="/images/therese.png"
                                    quote="I had no idea I was spending almost $300 a month on subscriptions until I used Substotal.
              I&apos;ve already cut over $85 in monthly expenses!"
                                    name="Therese H."
                                />
                            </CarouselItem>
                            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                                <ReviewCard
                                    avatar="/images/marcus.png"
                                    quote="As someone who values privacy, I love that Substotal works without an account
              and keeps my data on my device."
                                    name="Marcus O."
                                />
                            </CarouselItem>
                            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                                <ReviewCard
                                    avatar="/images/mikael.png"
                                    quote="The simplest way to track subscriptions I&apos;ve found. No bloat, just what I need."
                                    name="Mikael K."
                                />
                            </CarouselItem>
                            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                                <ReviewCard
                                    avatar="/images/elin.png"
                                    quote="Perfect for tracking family subscriptions! We discovered we were paying for duplicate streaming services and saved instantly."
                                    name="Elin J."
                                />
                            </CarouselItem>
                        </CarouselContent>
                    </Carousel>
                </div>
            </div>
        </section>
    )
}