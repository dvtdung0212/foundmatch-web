import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

const geologica = localFont({
  src: "../../public/fonts/Geologica/Geologica-VariableFont_CRSV,SHRP,slnt,wght.ttf",
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FoundMatch Relay — Bàn giao & Tìm đồ thất lạc an toàn",
  description:
    "Nền tảng báo mất/nhặt đồ thông minh với ghép nối có thể giải thích, xác minh quyền sở hữu riêng tư và chuỗi hành trình bàn giao an toàn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={geologica.variable}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
