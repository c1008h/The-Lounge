import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {ProviderWrapper} from '@/components/provider/ProviderWrapper'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Lounge",
  description: "Created by Chris Hong",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProviderWrapper>
          {children}
        </ProviderWrapper>
      </body>
    </html>
  );
}
