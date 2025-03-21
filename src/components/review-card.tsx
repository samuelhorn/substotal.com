import { Avatar } from "./ui/avatar";
import { Card, CardContent } from "./ui/card";
import { StarRating } from "./star-rating";
import Image from "next/image";

export function ReviewCard({ avatar, quote, name }: {
    avatar: string
    quote: string
    name: string
}) {
    return (
        <Card className="bg-background h-full">
            <CardContent>
                <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                        <Image src={avatar} alt={name} className="rounded-full" width={48} height={48} />
                    </Avatar>
                    <div className="flex flex-col gap-1 items-start">
                        <StarRating starSize={12} />
                        <p className="text-muted-foreground">— {name}</p>
                    </div>
                </div>
                <p className="italic mb-4 mt-6">
                    &quot;{quote}&quot;
                </p>

            </CardContent>
        </Card>
    )
}