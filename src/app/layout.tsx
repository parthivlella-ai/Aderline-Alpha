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
      <body className="bg-[#0b0914] text-[#f5f3ff] antialiased min-h-screen flex flex-col justify-between selection:bg-[#9d7bf5] selection:text-[#0b0914]">
        <Navbar />
        <div className="flex-1 flex flex-col">{children}</div>
        <footer className="border-t border-[#1d1633] py-6 text-center text-xs text-[#6e668c] bg-[#0b0914]">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="tracking-widest uppercase font-mono text-[11px] text-[#5e567c]">
              CURATED TALENT • CLEAR RIGHTS • CREATIVE FLOW
            </span>
            <span className="text-[#6e668c]">
              Prismora ✦ AI-Native Content Creator Marketplace
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
