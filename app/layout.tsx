import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "エアコンコスト比較シミュレーター",
  description:
    "2機種のエアコンを比較し、電気代と累積コストを長期でシミュレーションするアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
