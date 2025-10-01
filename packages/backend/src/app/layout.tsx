import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LyricNote 管理后台",
  description: "日语音乐识别应用管理系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
