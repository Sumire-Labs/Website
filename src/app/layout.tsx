import type { Metadata } from "next";
import "./globals.css";
import { DynamicIsland } from "@/components/Header/DynamicIsland";

export const metadata: Metadata = {
  title: "すみれさば | Discord Server",
  description: "すみれさば - Discordコミュニティサーバー",
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
