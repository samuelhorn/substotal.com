export function Fallback() {
    return (
        <div className="bg-background text-foreground z-10 fixed inset-0 w-full h-dvh flex flex-col items-center justify-center">
            <svg className="w-48 h-48 animate-spin" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
                <circle
                    cx="400"
                    cy="400"
                    fill="none"
                    r="48"
                    strokeWidth="24"
                    stroke="currentColor"
                    strokeDasharray="207 1400"
                    strokeLinecap="round"
                />
            </svg>
            <span className="-mt-16 font-bold">Loading...</span>
        </div>
    )
}