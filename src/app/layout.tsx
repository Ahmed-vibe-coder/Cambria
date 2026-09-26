import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Cairo } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cambria International College | Transnational Education & Verification",
  description:
    "Official portal for Cambria International College. Offering distinguished executive education, professional diplomas, and instant cryptographic credential verification.",
  keywords: [
    "Cambria International College",
    "Executive Education",
    "Digital Credential Verification",
    "Professional Diploma",
    "Academic Registry",
  ],
  authors: [{ name: "Cambria International College" }],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/images/cambria-logo.png",
    shortcut: "/favicon.png",
  },
  openGraph: {
    title: "Cambria International College",
    description:
      "Transnational Education & Official Cryptographic Credential Verification Platform",
    images: [
      {
        url: "/images/cambria-logo.png",
        width: 500,
        height: 500,
        alt: "Cambria International College Official Emblem",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${cairo.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-cambria-offwhite text-cambria-navy antialiased selection:bg-cambria-soft selection:text-cambria-navy">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
