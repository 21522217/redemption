import "../globals.css";

import React from "react";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "../providers";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Redemption",
  description: "Powerful Socail Media Platform",
};

interface LayoutProps {
  children: React.ReactNode;
}

const layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html>
      <body>
        <Providers>
          <div className="flex flex-col w-full items-center">
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
};

export default layout;
