import type { Metadata, Viewport } from "next";
import { Gabarito } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider"
import { CurrencyProvider } from "@/components/currency-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ErrorBoundary } from "@/components/error-boundary";
import GoogleAnalyticsProvider from "@/components/analytics/google-analytics";
import ConsentBanner from "@/components/analytics/consent-banner";

const gabarito = Gabarito({ subsets: ["latin"], weight: ["400", "600", "700"] });

export const metadata: Metadata = {
  title: "Subscription Tracker",
  description: "A simple app to track your recurring subscriptions",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

// Replace with your actual Google Analytics measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-XXXXXXXXXX";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${gabarito.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CurrencyProvider>
            <ErrorBoundary>
              <Header />
              <main className="container mx-auto">
                {children}
              </main>
              <Footer />
              <Toaster />
              <GoogleAnalyticsProvider measurementId={GA_MEASUREMENT_ID} />
              <ConsentBanner />
            </ErrorBoundary>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
