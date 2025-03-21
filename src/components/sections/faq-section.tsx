import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FaqSection() {
    return (
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
    )
}