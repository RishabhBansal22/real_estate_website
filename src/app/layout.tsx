import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/providers";
import ComparisonBar from "@/components/ui/ComparisonBar";
import FloatingWhatsAppButton from "@/components/ui/FloatingWhatsAppButton";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aura Estates | Exclusive Luxury Real Estate",
  description: "Find your perfect property with Aura Estates. Premium luxury listings, exclusive villas, and high-end commercial spaces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground selection:bg-accent-gold/30 selection:text-primary-blue">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ComparisonBar />
          <FloatingWhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
