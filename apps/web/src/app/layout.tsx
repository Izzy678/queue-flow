import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

/* Undercase Type — distinctive display face; body uses system UI stack */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "QueueFlow — Eliminate Waiting, Delight Customers",
  description:
    "QueueFlow is the modern queue management platform that reduces wait times, improves customer experience, and gives you actionable analytics across every branch.",
  openGraph: {
    title: "QueueFlow — Eliminate Waiting, Delight Customers",
    description:
      "Reduce congestion, serve customers faster, and track every queue in real time.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
