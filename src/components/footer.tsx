import { Separator } from "@/components/ui/separator";

export function Footer() {
    return (
        <footer className="bg-background container py-8 text-muted-foreground">
            <Separator className="mb-8" />
            <p className="text-center text-sm mb-2">
                Substotal is not affiliated with any subscription service. All company names and logos
                mentioned are the property of their respective owners.
            </p>
            <p className="text-center text-sm text-muted-foreground">
                © 2025 Substotal. Privacy-focused subscription management for everyone.
            </p>

        </footer>
    );
}