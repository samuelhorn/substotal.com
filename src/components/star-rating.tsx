import { Star } from 'lucide-react';

export function StarRating() {
    return (
        <div className="flex gap-1 justify-center mb-8">
            <Star className="text-primary w-4 h-4" fill="currentColor" />
            <Star className="text-primary w-4 h-4" fill="currentColor" />
            <Star className="text-primary w-4 h-4" fill="currentColor" />
            <Star className="text-primary w-4 h-4" fill="currentColor" />
            <Star className="text-primary w-4 h-4" fill="currentColor" />
        </div>
    );
}