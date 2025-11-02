import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CSV Analyzer Dashboard",
  description: "Minimalist dashboard for exploring CSV data"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-950 text-slate-100">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
