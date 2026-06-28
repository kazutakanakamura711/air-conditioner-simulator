import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "エアコンコスト比較シミュレーター",
  description:
    "安価モデルと省エネモデルの電気代・累積コストを長期で比較できます。省エネ規制を前に、どちらが本当にお得か計算しましょう。",
  openGraph: {
    title: "エアコンコスト比較シミュレーター",
    description:
      "安価モデルと省エネモデルの電気代・累積コストを長期で比較できます。",
    url: "https://air-conditioner-simulator-production.up.railway.app",
    siteName: "エアコンコスト比較シミュレーター",
    images: [
      {
        url: "https://air-conditioner-simulator-production.up.railway.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "エアコンコスト比較シミュレーター",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "エアコンコスト比較シミュレーター",
    description:
      "安価モデルと省エネモデルの電気代・累積コストを長期で比較できます。",
    images: [
      "https://air-conditioner-simulator-production.up.railway.app/og-image.png",
    ],
  },
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
