import type { Metadata } from "next";
import "./globals.css";

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
      <body className="bg-zinc-950 text-zinc-100 antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
