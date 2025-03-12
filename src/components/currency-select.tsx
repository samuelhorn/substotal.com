"use client"

import { CURRENCIES, CURRENCY_COUNTRY_CODES } from '@/lib/currencies'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import ReactCountryFlag from "react-country-flag"

interface CurrencySelectProps {
    value: string
    onValueChange: (value: string) => void
}

export function CurrencySelect({ value, onValueChange }: CurrencySelectProps) {
    return (
        <div className="flex items-center gap-2">
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger>
                    <ReactCountryFlag
                        countryCode={CURRENCY_COUNTRY_CODES[value as keyof typeof CURRENCY_COUNTRY_CODES]}
                        style={{
                            fontSize: '1.25em',
                            lineHeight: '1.25em',
                        }}
                        svg
                    />
                    <SelectValue placeholder="Select" />
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