import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://venturamall.bo"),
  title: {
    default: "Ventura Mall | El centro comercial más grande de Bolivia",
    template: "%s | Ventura Mall",
  },
  description: "Ventura Mall en Santa Cruz de la Sierra, Bolivia. 110,000 m² de moda, gastronomía, cine IMAX y entretenimiento familiar. El mall más grande de Bolivia.",
  keywords: [
    "Ventura Mall", "Santa Cruz Bolivia", "centro comercial", "shopping mall",
    "cine IMAX", "Cinemark", "tiendas moda", "Hard Rock Café", "Bolivia", "Equipetrol",
  ],
  authors: [{ name: "Ventura Mall" }],
  creator: "Ventura Mall",
  publisher: "Ventura Mall",
  icons: { icon: "/ventura-logo-favicon.png", apple: "/ventura-logo-favicon.png" },
  openGraph: {
    title: "Ventura Mall | El centro comercial más grande de Bolivia",
    description: "110,000 m² de moda, gastronomía, cine IMAX y entretenimiento en Santa Cruz de la Sierra, Bolivia.",
    siteName: "Ventura Mall",
    type: "website",
    locale: "es_BO",
    images: [{ url: "/images/ventura/real/exterior.jpg", width: 1200, height: 630, alt: "Ventura Mall Santa Cruz Bolivia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ventura Mall | El centro comercial más grande de Bolivia",
    description: "110,000 m² de moda, gastronomía, cine IMAX y entretenimiento en Santa Cruz, Bolivia.",
    images: ["/images/ventura/real/exterior.jpg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf6ef" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
