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
import { useCurrency } from '@/components/app-provider'
import { Skeleton } from './ui/skeleton'
import { usePathname } from "next/navigation";

export function CurrencySelect() {
    const pathname = usePathname();
    const isSubscriptionsPage = pathname === "/subscriptions";
    const { primaryCurrency, setPrimaryCurrency, isLoading } = useCurrency();

    if (!isSubscriptionsPage) {
        return null;
    }

    return (
        <div className="flex items-center gap-2">
            {isLoading ? (
                <Skeleton className='w-28 h-9' />
            ) : (

                <Select
                    value={primaryCurrency}
                    onValueChange={setPrimaryCurrency}
                    disabled={isLoading}
                >
                    <SelectTrigger className="w-28">
                        {primaryCurrency && (
                            <ReactCountryFlag
                                countryCode={CURRENCY_COUNTRY_CODES[primaryCurrency as keyof typeof CURRENCY_COUNTRY_CODES]}
                                style={{
                                    fontSize: '1.25em',
                                    lineHeight: '1.25em',
                                }}
                                svg
                            />
                        )}
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent align="end">
                        {CURRENCIES.map((currency) => (
                            <SelectItem key={currency} value={currency}>
                                {currency}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )
            }
        </div >
    )
}