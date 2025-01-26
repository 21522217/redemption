import "../globals.css";

import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Providers from "../providers";

export const metadata: Metadata = {
  title: "Redemption",
  description: "Powerful Socail Media Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <Providers>
          <div className="flex flex-row">
            <Sidebar />
            <main className="flex flex-col w-full items-center">
              <Header />
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
