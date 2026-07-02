import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "GreenMiles",
  description: "Mileage and sustainability tracking MVP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
