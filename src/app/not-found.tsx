import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function NotFoundContent() {
    return (
        <div className="text-center flex flex-col gap-4 items-center justify-center">
            <h2 className='text-4xl font-bold'>Not Found</h2>
            <p>Could not find requested resource</p>
            <Button asChild>
                <Link href="/">Return Home</Link>
            </Button>
        </div>
    )
}

export default function NotFound() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NotFoundContent />
        </Suspense>
    )
}