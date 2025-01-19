import React from "react";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="absolute flex justify-between w-full p-4 text-xs bottom-0 left-0">
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

        <button className="text-muted-foreground hover:text-zinc-400">Cookie Settings</button>
      </div>
      <div className="flex flex-row space-x-4 text-muted-foreground">
        <Link href="/report" className="hover:text-zinc-400">
          Report a problem
        </Link>
        <span>©Copyright 2025</span>
      </div>
    </footer>
  );
};

export default Footer;
