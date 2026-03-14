import type { Metadata } from "next";
import { Martian_Mono, Schibsted_Grotesk, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import LightRays from "./components/ui/LightRays";
import Navbar from "./components/Navbar";

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' });

const schibsted_grotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martian_mono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevEvents",
  description: "The Hub for every dev events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", figtree.variable)}>
      <body
        className={`${schibsted_grotesk.variable} ${martian_mono.variable} min-h-screen antialiased `}
      >
        <Navbar/>
        <div className="absolute inset-0 top-0 z-[-1] min-h-screen">
          <LightRays
            raysOrigin="top-center-offset"
            raysColor="#5dfeca"
            raysSpeed={0.5}
            lightSpread={0.9}
            rayLength={1.4}
            followMouse={true}
            mouseInfluence={0.02}
            noiseAmount={0}
            distortion={0.01}
          />
        </div>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
