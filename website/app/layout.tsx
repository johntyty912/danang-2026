import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./components/NavBar";

export const metadata: Metadata = {
  title: "峴港之旅 2026 | Da Nang Trip 2026",
  description: "峴港旅遊行程規劃 - 2026年3月25日-28日",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="bg-danang-cream font-sans">
        <NavBar />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-danang-deep text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-danang-sand font-semibold mb-2">
              峴港之旅 2026年3月25日 - 3月28日
            </p>
            <p className="text-sm opacity-80">
              住宿：Seashore Hotel &amp; Apartment (3/25, 3/27) · Mercure Ba Na Hills (3/26) 🏨
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
