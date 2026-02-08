import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RideCompare - Compare Ride Prices",
  description:
    "Compare real-time price and ETA estimates across ride-hailing providers. Find the best ride, fastest.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 antialiased">{children}</body>
    </html>
  );
}
