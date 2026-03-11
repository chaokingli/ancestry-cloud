import type { Metadata, Viewport } from "next";
import { Header } from "@/components/layout/Header";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";
import "@/styles/ink-wash.css";

export const metadata: Metadata = {
  title: "祖祀 - 祖先祭祀",
  description: "传统水墨风格的祖先祭祀平台，传承千年祭祀文化",
  keywords: ["祖先祭祀", "家谱", "宗族", "祭祀", "传统文化", "孝道"],
  authors: [{ name: "祖祀团队" }],
  creator: "祖祀",
  publisher: "祖祀",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "祖祀",
    title: "祖祀 - 祖先祭祀平台",
    description: "传统水墨风格的祖先祭祀平台，传承千年祭祀文化",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f4e9" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" dir="ltr">
      <body className="min-h-screen font-ink antialiased">
        <div className="flex min-h-screen flex-col">
          {/* Header - Desktop navigation */}
          <Header />

          {/* Main content area */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <Footer />

          {/* Bottom Navbar - Mobile navigation */}
          <Navbar />
        </div>
      </body>
    </html>
  );
}
