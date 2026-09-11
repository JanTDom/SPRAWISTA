import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sprawista.pl"),
  title: "Sprawista — Od akt do pisma procesowego. Z dowodami i analizą przeciwnika",
  description:
    "Profesjonalna aplikacja webowa dla polskich kancelarii prawnych. Przekształca dokumenty sprawy w sprawdzalny projekt odpowiedzi na pozew o zapłatę z umowy cywilnej lub gospodarczej.",
  icons: {
    icon: "/favicon.svg",
    apple: "/brand/icon.svg",
  },
  openGraph: {
    title: "Sprawista — Profesjonalna odpowiedź na pozew z akt sprawy",
    description:
      "100% sprawdzalne powiązania twierdzeń ze źródłami dowodowymi. Analiza argumentów powoda i eksport do edytowalnego Worda.",
    url: "https://sprawista.pl",
    siteName: "Sprawista",
    images: [
      {
        url: "/brand/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Sprawista — Od akt do pisma procesowego",
      },
    ],
    locale: "pl_PL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#F6F5F1] text-[#172338] antialiased selection:bg-[#EEF2FF] selection:text-[#172338]">
        {children}
      </body>
    </html>
  );
}
