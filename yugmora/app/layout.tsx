import type { Metadata } from "next";
import { Montserrat, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgressHUD } from "@/components/layout/ScrollProgressHUD";
import { MobileRegisterFab } from "@/components/layout/MobileRegisterFab";
import { Preloader } from "@/components/layout/Preloader";
import { CRTOverlay } from "@/components/layout/CRTOverlay";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { LiveContentProvider } from "@/context/LiveContentContext";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["800", "900"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "YUGMORA — 40 Hours. Real Problems. Real Impact.",
  description:
    "Yugmora is a 40-hour campus hackathon where companies contribute real problem statements, experts run workshops, and an Internship Mela turns builders into interns. Register now.",
  keywords: [
    "hackathon",
    "campus hackathon",
    "yugmora",
    "internship mela",
    "coding competition",
    "workshops",
    "problem statements",
  ],
  openGraph: {
    title: "YUGMORA — 40 Hours. Real Problems. Real Impact.",
    description:
      "A 40-hour campus hackathon with industry problem statements, expert workshops, and an Internship Mela.",
    type: "website",
    siteName: "Yugmora",
  },
  twitter: {
    card: "summary_large_image",
    title: "YUGMORA — 40 Hours. Real Problems. Real Impact.",
    description:
      "A 40-hour campus hackathon with industry problem statements, expert workshops, and an Internship Mela.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen">
        {/* Skip link for accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <LiveContentProvider>
          <SmoothScrollProvider>
            <Preloader />
            <CRTOverlay />
            <Nav />
            <ScrollProgressHUD />
            <main id="main-content">{children}</main>
            <Footer />
            <MobileRegisterFab />
          </SmoothScrollProvider>
        </LiveContentProvider>
      </body>
    </html>
  );
}
