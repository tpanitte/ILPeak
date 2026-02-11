import type { Metadata, Viewport } from "next";
import { MockAuthProvider } from "@/lib/mock-auth-client";
import { AppShell } from "@/components/layout/app-shell";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const _geistSans = Geist({
  subsets: ["latin"],
});

const _geistMono = Geist_Mono({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ILPeak - Program Management",
  description: "Manage learning programs, track participant performance, and import data.",
};

export const viewport: Viewport = {
  themeColor: "#1a1d2e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MockAuthProvider>
      <html lang="en" className="dark">
        <body className="font-sans antialiased">
          <AppShell>{children}</AppShell>
        </body>
      </html>
    </MockAuthProvider>
  );
}
