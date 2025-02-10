import "../globals.css";

import React from "react";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Providers from "../providers";
import Footer from "@/components/Footer";
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

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en" className={geistSans.variable}>
      <body className="font-sans">
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

export default Layout;
