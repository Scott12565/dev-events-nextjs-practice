import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import LightRays from "@/components/LightRays";
import NavBar from "@/components/NavBar";

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevEvent",
  description: "The Hub for Every Dev Event you Musn't Miss",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${martianMono.variable} ${schibstedGrotesk.variable} min-h-screen antialiased`}
      >

        <NavBar />
        <div className="absolute inset-0 top-0 min-h-screen z-[-1] ">

          <LightRays
            raysOrigin="top-center-offset"
            raysColor="#5dfeca"
            raysSpeed={0.7}
            lightSpread={0.9}
            rayLength={2}
            followMouse={true}
            mouseInfluence={0.05}
            noiseAmount={0}
            distortion={0.03}
            className="custom-rays"
            pulsating={false}
            fadeDistance={0.5}
            saturation={0.2}
          />
        </div>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
