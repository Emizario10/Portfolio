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
  title: "Juan Felipe Lasso | CSOC Portfolio",
  description: "Full-Stack Web Dev & AI Engineer. Feel de the luxus vibe in your soul! Give us your feedback, we will love it.",
  metadataBase: new URL("https://emizario.vercel.app"),
  openGraph: {
    title: "Juan Felipe Lasso | CSOC Portfolio",
    description: "Full-Stack Web Dev & AI Engineer based in Göttingen. Enter the Cyber-Security Operations Center.",
    url: "https://emizario.vercel.app",
    siteName: "Lasso CSOC",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Juan Felipe Lasso | SYSTEM ONLINE",
    description: "Full-Stack Web Dev & AI Engineer. Feel de the luxus vibe in your soul!",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
