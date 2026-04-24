import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { WhopApp } from "@whop/react/components";
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
  title: "AI Opportunity Scorecard",
  description: "Rank the best AI implementation opportunities inside a business.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const appId =
    process.env.NEXT_PUBLIC_WHOP_APP_ID || process.env.WHOP_APP_ID || undefined;

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        {appId ? (
          <WhopApp
            accentColor="orange"
            appearance="light"
            sdkOptions={{ appId }}
          >
            {children}
          </WhopApp>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
