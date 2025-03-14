import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    as?: "div" | "span";
}

function Skeleton({ className, as = "div", ...props }: SkeletonProps) {
    const Component = as;
    return (
        <Component
            data-slot="skeleton"
            className={cn("bg-secondary animate-pulse transition-opacity duration-1000 rounded-md", className)}
            {...props}
        />
    )
}

export { Skeleton }
