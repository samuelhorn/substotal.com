import { Star } from 'lucide-react';

export function StarRating({ starSize = 16 }: { starSize?: number }) {
    return (
        <div className="flex gap-1 justify-center">
            {[...Array(5)].map((_, index) => (
                <Star
                    key={index}
                    style={{
                        width: `${starSize}px`,
                        height: `${starSize}px`,
                    }}
                    className="text-primary" fill="currentColor"
                />
            ))}
        </div>
    );
}