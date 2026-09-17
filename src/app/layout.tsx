import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { clerkAppearance, clerkLocalization } from "@/lib/clerkTheme";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Campus Pulse — COMSATS Lahore",
  description: "Live events happening right now across COMSATS Lahore.",
};

export const viewport: Viewport = {
  themeColor: "#532386",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider
      afterSignOutUrl="/dashboard"
      appearance={clerkAppearance}
      localization={clerkLocalization}
    >
      <html
        lang="en"
        className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
      >
        <body className="min-h-full bg-background">{children}</body>
      </html>
    </ClerkProvider>
  );
}
