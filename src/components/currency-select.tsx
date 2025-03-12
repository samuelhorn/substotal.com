"use client"

import { CURRENCIES } from '@/lib/currencies'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface CurrencySelectProps {
    value: string
    onValueChange: (value: string) => void
}

export function CurrencySelect({ value, onValueChange }: CurrencySelectProps) {
    return (
        <div className="flex items-center gap-2">
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                    {CURRENCIES.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                            {currency}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}