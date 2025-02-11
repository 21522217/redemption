"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IoMdClose } from "react-icons/io";
import { createRoot } from "react-dom/client";
import Link from "next/link";
import { Button } from "../ui/button";

interface AuthModalProps {
  isOpen: boolean;
  onChange: (open: boolean) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onChange }) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="backdrop-blur-sm fixed inset-0 z-50">
          <Dialog.Content
            className="fixed drop-shadow-md border border-neutral-200 dark:border-neutral-700 top-1/2 left-1/2 max-h-full 
              h-full md:h-auto md:max-h-[85vh] w-full md:w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-2xl 
              bg-card p-8 focus:outline-none z-50"
          >
            <Dialog.Title className="text-2xl text-center font-bold mb-6">
              Welcome to Redemption
            </Dialog.Title>
            <p className="text-base mb-8 text-center">
              Join Redemption to connect, share your thoughts, and be part of
              our growing community.
            </p>
            <div className="flex flex-col gap-4">
              <Link
                href="/signup"
                className="w-full py-3 px-4 rounded-xl text-center font-semibold bg-primary text-primary-foreground
                hover:bg-primary/50 transition-colors"
              >
                Sign up
              </Link>
              <Link
                href="/login"
                className="w-full py-3 px-4 rounded-xl text-center font-semibold bg-secondary text-foreground
                hover:bg-accent transition-colors"
              >
                Log in
              </Link>
            </div>
            <Dialog.Close asChild>
              <Button
                variant="ghost"
                className="absolute top-4 right-4 p-2 rounded-full  
                  hover:bg-accent transition"
                aria-label="Close"
              >
                <IoMdClose className="w-5 h-5" />
              </Button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export const showAuthModal = () => {
  const modalContainer = document.createElement("div");
  document.body.appendChild(modalContainer);

  const closeModal = () => {
    root.unmount();
    document.body.removeChild(modalContainer);
  };

  const ModalWrapper = () => {
    const [isOpen, setIsOpen] = useState(true);

    const handleOpenChange = (open: boolean) => {
      setIsOpen(open);
      if (!open) closeModal();
    };

    return <AuthModal isOpen={isOpen} onChange={handleOpenChange} />;
  };

  const root = createRoot(modalContainer);
  root.render(<ModalWrapper />);
};

export default AuthModal;
