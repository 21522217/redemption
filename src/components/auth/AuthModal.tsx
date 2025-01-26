"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IoMdClose } from "react-icons/io";
import { createRoot } from "react-dom/client";
import Link from "next/link";

interface AuthModalProps {
  isOpen: boolean;
  onChange: (open: boolean) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onChange }) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-neutral-900/90 black-drop-blur-sm fixed inset-0">
          <Dialog.Content
            className="fixed drop-shadow-md border border-neutral-700 top-1/2 left-1/2 max-h-full 
              h-full md:h-auto md:max-h-[85vh] -translate-x-1/2 -translate-y-1/2 rounded-md 
              bg-neutral-800 p-6 focus:outline-none"
          >
            <Dialog.Title className="text-xl text-center font-bold mb-4">
              Say more with Redemption
            </Dialog.Title>
            <p className="text-muted-foreground mb-4 text-center">
              Join Threads to share thoughts, find out what&apos;s going on,
              follow your people, and more.
            </p>
            <div className="flex flex-col gap-4">
              <Link href="/signup" className="text-primary">Sign up</Link>
              <Link href="/login">Log in</Link>
            </div>
            <Dialog.Close asChild>
              <button
                className="text-neutral-400 hover:text-white absolute top-2.5 right-2.5 
                  inline-flex h-6 w-6 items-center justify-center rounded-full focus:outline-none"
              >
                <IoMdClose />
              </button>
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
