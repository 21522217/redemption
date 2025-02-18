import "../globals.css";

import type { Metadata } from "next";
import AppSidebar from "@/components/AppSidebar";
import Providers from "../providers";
import { Geist } from "next/font/google";
import PageHeader from "@/components/PageHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Redemption",
  description: "Powerful Social Media Platform",
  icons: {
    icon: "images/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.variable} suppressHydrationWarning>
      <body>
        <Providers>
          <div className="flex flex-row">
            <AppSidebar />
            <main className="flex flex-col justify-center w-full items-center">
              <PageHeader />
              <div className="flex w-[672px]">{children}</div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
