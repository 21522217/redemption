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

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  return (
    <Dialog onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-muted-foreground">
            Say more with Redemption
          </DialogTitle>
          <DialogDescription>
            Join Threads to share thoughts, find out what&apos;s going on,
            follow your people and more.
          </DialogDescription>
        </DialogHeader>
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
