import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aura Espresso Landing",
  description: "Premium 3D Espresso Experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
