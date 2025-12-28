import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Topbar from "@/components/Topbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Семейное хранилище",
  description: "Древо семьи и храниолище воспоминаний рода Задворновых и всех с нами связанных!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <meta name="postimage-verification" content="b96c2868185c864dc5ed16136c86b383" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} w-full min-h-screen relative overflow-x-hidden`}
      >
        <Topbar />
        {children}
        <Toaster richColors position="top-center" duration={2000} />
      </body>
    </html>
  );
}
