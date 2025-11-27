import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cesium-demo",
  description: "Cesium示例",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
