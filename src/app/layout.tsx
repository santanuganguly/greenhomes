import type { Metadata, Viewport } from "next";
import { Familjen_Grotesk, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { ContactProvider } from "@/components/ContactContext";
import { SiteHeader } from "@/components/SiteHeader";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const familjenGrotesk = Familjen_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-familjen-grotesk",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Green Homes — Turnkey Home Construction in Siliguri & North Bengal",
  description:
    "Green Homes by Green Hill Group: design-to-build turnkey home construction, renovation, and commercial builds in Siliguri and North Bengal. Fixed per-sqft pricing, 470+ quality checks, and 5-year warranty.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0f3a2e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${familjenGrotesk.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#EDE6D6] text-[#2A2725]">
        <a
          href="#top"
          className="visually-hidden focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[#0f3a2e] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#c9a86a]"
        >
          Skip to main content
        </a>
        <ContactProvider>
          <SiteHeader />
          {children}
          <WhatsAppButton />
        </ContactProvider>
      </body>
    </html>
  );
}
