import type { Metadata, Viewport } from "next";
import { Gabarito } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ErrorBoundary } from "@/components/error-boundary";
import GoogleAnalyticsProvider from "@/components/analytics/google-analytics";
import ConsentBanner from "@/components/analytics/consent-banner";
import { AppProvider } from "@/components/app-provider";
import { SignInSuccessHandler } from "@/components/sign-in-success-handler";
import { DataMergeDialog } from "@/components/data-merge-dialog";

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
      <body className={`${gabarito.className} antialiased min-h-dvh flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider>
            <ErrorBoundary>
              {/* Add SignInSuccessHandler to detect when a user just signed in */}
              <SignInSuccessHandler />
              <DataMergeDialog />
              <Header />
              <main className="container mx-auto grow flex flex-col justify-center">
                {children}
              </main>
              <Footer />
              <Toaster />
              <GoogleAnalyticsProvider measurementId={GA_MEASUREMENT_ID} />
              <ConsentBanner />
            </ErrorBoundary>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
