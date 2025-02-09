"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { showReportProblemModal } from "./ReportProblemModal";

// Tách phần report button thành component riêng
const ReportButton = () => {
  return (
    <button
      onClick={() => showReportProblemModal()}
      className="hover:text-zinc-400"
    >
      Report a problem
    </button>
  );
};

const Footer = () => {
  const pathname = usePathname();

  // Kiểm tra nếu đang ở trang login hoặc signup
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <footer
      className={`
      flex justify-between w-full p-4 text-xs
      ${isAuthPage ? "absolute bottom-0" : "mt-auto"}
    `}
    >
      <div className="flex flex-row space-x-4 text-muted-foreground">
        <Link href="/terms" className="hover:text-zinc-400">
          Redemption Terms
        </Link>
        <Link href="/privacy" className="hover:text-zinc-400">
          Privacy Policy
        </Link>
        <Link href="/cookies" className="hover:text-zinc-400">
          Cookies Policy
        </Link>
        <button className="text-muted-foreground hover:text-zinc-400">
          Cookie Settings
        </button>
      </div>
      <div className="flex flex-row space-x-4 text-muted-foreground">
        <ReportButton />
        <span>©Copyright 2025</span>
      </div>
    </footer>
  );
};

export default Footer;
