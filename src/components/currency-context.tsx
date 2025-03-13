"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { loadPrimaryCurrency, savePrimaryCurrency } from "@/lib/settings";
import { getExchangeRates } from "@/lib/currency";
import { toast } from "sonner";

type CurrencyContextType = {
    primaryCurrency: string;
    setPrimaryCurrency: (currency: string) => void;
    exchangeRates: Record<string, number>;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [primaryCurrency, setPrimaryCurrency] = useState("USD");
    const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});

    useEffect(() => {
        // Load saved primary currency preference
        const savedCurrency = loadPrimaryCurrency();
        if (savedCurrency) {
            setPrimaryCurrency(savedCurrency);
        }

        // Load exchange rates
        getExchangeRates()
            .then((rates) => {
                setExchangeRates(rates);
            })
            .catch((error) => {
                console.error("Failed to load exchange rates:", error);
                toast.error("Failed to load currency exchange rates");
            });
    }, []);

    const handleCurrencyChange = (currency: string) => {
        setPrimaryCurrency(currency);
        savePrimaryCurrency(currency);
    };

    return (
        <CurrencyContext.Provider
            value={{
                primaryCurrency,
                setPrimaryCurrency: handleCurrencyChange,
                exchangeRates,
            }}
        >
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error("useCurrency must be used within a CurrencyProvider");
    }
    return context;
}