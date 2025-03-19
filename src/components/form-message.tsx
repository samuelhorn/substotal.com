'use client';

export type Message = {
    type?: 'error' | 'success';
    message?: string;
} | undefined;

export function FormMessage({ message }: { message?: Message }) {
    if (!message?.message) return null;

    return (
        <div className="flex flex-col gap-2 w-full max-w-md text-sm">
            <div className={`border-l-2 px-4 ${message.type === 'error'
                    ? 'text-destructive-foreground border-destructive-foreground'
                    : 'text-foreground border-foreground'
                }`}>
                {message.message}
            </div>
        </div>
    );
}