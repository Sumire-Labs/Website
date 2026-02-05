import type { Metadata, Viewport } from "next";
import "./globals.css";
import { DynamicIsland } from "@/components/Header/DynamicIsland";

export const metadata: Metadata = {
  metadataBase: new URL("https://sumiresaba.com"),
  title: {
    default: "すみれさば | Discord Server",
    template: "%s | すみれさば",
  },
  description: "すみれさば - 身内主導の小規模Discordコミュニティサーバー",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "すみれさば",
    title: "すみれさば | Discord Server",
    description: "すみれさば - 身内主導の小規模Discordコミュニティサーバー",
    images: [
      {
        url: "/images/og/home.png",
        width: 1200,
        height: 630,
        alt: "すみれさば",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "すみれさば | Discord Server",
    description: "すみれさば - 身内主導の小規模Discordコミュニティサーバー",
    images: ["/images/og/home.png"],
  },
  icons: {
    icon: "/images/icon.png",
    apple: "/images/icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <div className="bg-acrylic" />
        <DynamicIsland />
        <main>{children}</main>
      </body>
    </html>
  );
}
