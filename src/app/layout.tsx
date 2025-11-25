import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/index";
import { SessionProviderWrapper } from "./providers/SessionProviderWrapper";
import AuthListener from "@/components/AuthListener";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FitFinder",
   icons: {
    icon: "/logo.svg",
  },
  description: "Find the perfect gym for you with FitFinder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body
        className="layout"
      >
        <SessionProviderWrapper>
          <AuthListener />
          {children}
        </SessionProviderWrapper>
        <Footer />
      </body>
    </html>
  );
}