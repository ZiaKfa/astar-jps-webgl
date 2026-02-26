import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pathseekers - Benchmark A* vs JPS",
  description: "Sebuah proyek penelitian yang membandingkan kinerja algoritma A* dan Jump Point Search (JPS) dalam pencarian jalur pada peta berbasis grid. Proyek ini bertujuan untuk memberikan wawasan mendalam tentang kelebihan dan kekurangan masing-masing algoritma, serta bagaimana mereka dapat dioptimalkan untuk berbagai jenis peta dan skenario. Dengan menggunakan Unity untuk visualisasi dan Next.js untuk pengembangan web, proyek ini menyediakan platform interaktif untuk memahami perbedaan antara A* dan JPS secara praktis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
