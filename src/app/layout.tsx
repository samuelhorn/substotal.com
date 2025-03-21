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
import { Suspense } from "react";
import Head from "next/head";
import { Fallback } from "@/components/fallback";

const gabarito = Gabarito({ subsets: ["latin"], weight: ["400", "600", "700"] });

export const metadata: Metadata = {
  title: "Subscription Tracker",
  description: "A simple app to track your recurring subscriptions",
  appleWebApp: {
    title: "substotal",
    statusBarStyle: "black-translucent",
    capable: true,
    startupImage: [
      {
        url: "/web-app-manifest-512x512.png",
      },
    ],
  },
  openGraph: {
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  }
};



export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1e1812",
  viewportFit: "cover",
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
      <Head>
        <meta name="apple-mobile-web-app-title" content="substotal" />
      </Head>
      <body className={`${gabarito.className} antialiased min-h-dvh flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<Fallback />}>
            <AppProvider>
              <ErrorBoundary>
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
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
