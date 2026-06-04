import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CardioConnect | Future-State Mobile Prototype",
  description: "A future-state mobile field operations concept for Cardiology.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
