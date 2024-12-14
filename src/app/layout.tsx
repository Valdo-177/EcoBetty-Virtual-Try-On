import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "EcoBetty | Virtual Try-On - Sustainable Fashion Revolution",
  description:
    "Explore EcoBetty's Virtual Try-On! Discover how our sustainable fashion garments fit you virtually. Revolutionize your wardrobe with eco-friendly choices.",
  keywords: [
    "EcoBetty",
    "Virtual Try-On",
    "Sustainable Fashion",
    "Eco-friendly Clothing",
    "Online Fitting Room",
    "Green Fashion",
    "Virtual Dressing Room",
    "Try Before You Buy",
    "Sustainable Wardrobe",
    "Digital Fashion Experience",
  ],
  openGraph: {
    title: "EcoBetty | Virtual Try-On - Sustainable Fashion Revolution",
    description:
      "EcoBetty makes it easy to try on eco-friendly fashion garments virtually! A revolution in sustainability and digital fashion experience.",
    url: "https://www.ecobetty.com/virtual-try-on",
    type: "website",
    images: [
      {
        url: "https://firebasestorage.googleapis.com/v0/b/unidotaciones-f49fc.appspot.com/o/Preview_ecovetu.png?alt=media&token=37ac9636-1b7a-41cf-be73-6105c9058296",
        width: 1200,
        height: 630,
        alt: "EcoBetty Virtual Try-On - Sustainable Fashion",
      },
    ],
    siteName: "EcoBetty",
  },
  twitter: {
    card: "summary_large_image",
    site: "@EcoBetty",
    title: "EcoBetty | Virtual Try-On - Sustainable Fashion Revolution",
    description:
      "Discover EcoBetty's eco-friendly virtual try-on experience. Revolutionize your wardrobe with sustainable fashion.",
    images: [
      "https://firebasestorage.googleapis.com/v0/b/unidotaciones-f49fc.appspot.com/o/Preview_ecovetu.png?alt=media&token=37ac9636-1b7a-41cf-be73-6105c9058296",
    ],
  },
  alternates: {
    canonical: "https://www.ecobetty.com/virtual-try-on",
  },
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
