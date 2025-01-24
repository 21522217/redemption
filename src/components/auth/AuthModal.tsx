"use client";

import React from "react";
import { createRoot, Root } from "react-dom/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const router = useRouter();
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-background border-none">
        <DialogHeader>
          <DialogTitle className="text-muted-foreground ">
            Say more with Redemption
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Join Threads to share thoughts, find out what&apos;s going on,
            follow your people, and more.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Button onClick={() => router.push("/signup")}>Sign up</Button>
          <Button onClick={() => router.push("/login")}>Log in</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

let modalContainer: HTMLDivElement | null = null;
let root: Root | null = null;

const showAuthModal = () => {
  if (!modalContainer) {
    modalContainer = document.createElement("div");
    document.body.appendChild(modalContainer);
    root = createRoot(modalContainer);
  }

  const closeModal = () => {
    if (root && modalContainer) {
      root.unmount();
      document.body.removeChild(modalContainer);
      modalContainer = null;
      root = null;
    }
  };

  root?.render(<AuthModal onClose={closeModal} />);
};

export { showAuthModal };
export default AuthModal;
