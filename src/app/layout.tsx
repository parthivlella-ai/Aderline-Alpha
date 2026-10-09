import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Prismora | AI-Native Creator Marketplace",
  description:
    "Connecting world-class generative AI content creators with leading brands and creative agencies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 antialiased min-h-screen flex flex-col justify-between selection:bg-violet-900 selection:text-violet-100">
        <Navbar />
        <div className="flex-1 flex flex-col">{children}</div>
        <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-600 bg-zinc-950">
          Prismora AI Marketplace • Phase 02 Foundation • Visuals to be designed in Figma
        </footer>
      </body>
    </html>
  );
}
