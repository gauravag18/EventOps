import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { ToastProvider } from "@/components/ToastProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "EventOps — Orchestrating Seamless Event Experiences",
  description: "Discover events, book tickets instantly, and manage your events with precision. EventOps is the all-in-one event management platform for organizers and attendees.",
  keywords: "events, tickets, event management, organizer, attendee, meetups, conferences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} ${inter.variable} antialiased`}>
        <Providers>
          <ToastProvider>
            <Navbar />
            {children}
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
