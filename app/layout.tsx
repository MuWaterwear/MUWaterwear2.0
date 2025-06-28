import type { Metadata } from "next";
import { Actor } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";

const actor = Actor({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MU Waterwear - Premium Water Sports Gear & Apparel",
  description: "Built for the water. Forged for legends. Premium gear and apparel for Pacific Northwest and Mountain West water warriors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${actor.className} antialiased`}
      >
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
