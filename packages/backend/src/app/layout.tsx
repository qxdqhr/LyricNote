import type { Metadata } from "next";
import { APP_TITLES, APP_CONFIG } from "@lyricnote/shared";
import "./globals.css";

export const metadata: Metadata = {
  title: APP_TITLES.admin,
  description: APP_CONFIG.description,
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
