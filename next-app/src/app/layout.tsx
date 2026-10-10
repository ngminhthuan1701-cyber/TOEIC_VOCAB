import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TOEIC Vocab Master | Khoa học ghi nhớ FSRS & ETS 2023",
  description: "Web app học từ vựng TOEIC thông minh theo ngữ cảnh đề thi thật ETS 2023 và thuật toán FSRS lặp lại ngắt quãng.",
  manifest: "/manifest.json"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0284c7"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full bg-[#f4f9fd] text-slate-800 font-sans antialiased selection:bg-sky-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
