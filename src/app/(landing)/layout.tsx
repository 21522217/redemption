import "../globals.css";

import type { Metadata } from "next";
import AppSidebar from "@/components/AppSidebar";
import Providers from "../providers";

export const metadata: Metadata = {
  title: "Redemption",
  description: "Powerful Social Media Platform",
  // icons: {
  //   icon: [
  //     {
  //       url: "/favicon.ico",
  //       href: "/favicon.ico",
  //     },
  //   ],
  // },
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
            <AppSidebar />
            <main className=" flex flex-col justify-center w-full items-center">
              <div className="flex w-[672px]">{children}</div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
