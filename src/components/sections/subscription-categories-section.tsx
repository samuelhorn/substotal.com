import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SubscriptionCategoriesSection() {
    return (
        <section className="py-16 container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-12 text-center">Common Subscription Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="min-h-8">Entertainment & Streaming</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Netflix</li>
                            <li>HBO Max</li>
                            <li>Disney+</li>
                            <li>Spotify</li>
                            <li>YouTube Premium</li>
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="min-h-8">Software & Apps</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Microsoft 365</li>
                            <li>Adobe Creative Cloud</li>
                            <li>Dropbox</li>
                            <li>LastPass</li>
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="min-h-8">Delivery & Food</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Hello Fresh</li>
                            <li>DoorDash+</li>
                            <li>Amazon Prime</li>
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="min-h-8">Fitness & Wellness</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Gym memberships</li>
                            <li>Meditation apps</li>
                            <li>Online fitness programs</li>
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="min-h-8">Gaming</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Xbox Game Pass</li>
                            <li>PlayStation Plus</li>
                            <li>Nintendo Online</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}