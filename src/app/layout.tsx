import type { Metadata, Viewport } from "next";
import { Gabarito } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const gabarito = Gabarito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Subscription Tracker",
  description: "A simple app to track your recurring subscriptions",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={gabarito.className + " dark"}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
