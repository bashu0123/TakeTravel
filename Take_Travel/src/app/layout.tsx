import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/shared/header/Header";
import Footer from "@/components/shared/footer/Footer";
import {Providers} from '@/redux/Provider.redux'
import { Toaster } from "@/components/ui/sonner"
 

export const metadata: Metadata = {
  title: "Take Travel - Epic Adventures Across Nepal",
  description: "TakeTravel curates epic Nepal adventures—from Himalayan treks to hidden gems—led by expert guides. Explore, experience, and make unforgettable memories!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <Providers >
        <Toaster />
        <Header/>
        {children}
        <Footer/>
        
        </Providers>
        </body>
    </html>
  );
}
