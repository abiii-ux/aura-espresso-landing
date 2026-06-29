import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AURA Espresso — The Art of Extraction",
  description:
    "Experience ultra-luxury espresso. From single-origin Geisha beans to golden crema — AURA redefines what coffee can be.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#050505]">{children}</body>
    </html>
  );
}
