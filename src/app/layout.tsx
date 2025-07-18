import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientThemeProvider from "@/components/ClientThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Realtor Rocket - AI-Powered Property Listing Descriptions",
  description: "Transform your property photos into compelling listing descriptions with AI-powered image analysis. Perfect for real estate professionals.",
  keywords: "real estate, property listings, AI descriptions, image analysis, realtor tools",
  authors: [{ name: "Realtor Rocket" }],
  creator: "Realtor Rocket",
  publisher: "Realtor Rocket",
  robots: "index, follow",
  openGraph: {
    title: "Realtor Rocket - AI-Powered Property Listing Descriptions",
    description: "Transform your property photos into compelling listing descriptions with AI-powered image analysis.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200`}
      >
        <ClientThemeProvider>
          {children}
        </ClientThemeProvider>
      </body>
    </html>
  );
}
