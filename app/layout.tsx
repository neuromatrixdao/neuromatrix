import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SolanaWalletProvider from "@/components/SolanaWalletProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NeuroMatrix",
  description: "A neural gateway to the Solana blockchain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SolanaWalletProvider>
          {children}
        </SolanaWalletProvider>
      </body>
    </html>
  );
}
