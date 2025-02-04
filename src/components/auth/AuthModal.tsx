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
        <Dialog.Overlay className="bg-neutral-900/90 backdrop-blur-sm fixed inset-0">
          <Dialog.Content
            className="fixed drop-shadow-md border border-neutral-200 dark:border-neutral-700 top-1/2 left-1/2 max-h-full 
              h-full md:h-auto md:max-h-[85vh] w-full md:w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-2xl 
              bg-white dark:bg-neutral-800 p-8 focus:outline-none"
          >
            <Dialog.Title className="text-2xl text-center font-bold mb-6 text-neutral-900 dark:text-white">
              Say more with Redemption
            </Dialog.Title>
            <p className="text-neutral-600 dark:text-neutral-300 text-base mb-8 text-center">
              Join Threads to share thoughts, find out what&apos;s going on,
              follow your people, and more.
            </p>
            <div className="flex flex-col gap-4">
              <Link 
                href="/signup" 
                className="w-full py-3 px-4 rounded-xl bg-primary text-white text-center font-semibold 
                  hover:bg-primary/90 transition"
              >
                Sign up
              </Link>
              <Link 
                href="/login"
                className="w-full py-3 px-4 rounded-xl border border-neutral-300 dark:border-neutral-600 
                  text-neutral-900 dark:text-white text-center font-semibold 
                  hover:bg-neutral-100 dark:hover:bg-neutral-700 transition"
              >
                Log in
              </Link>
            </div>
            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 p-2 rounded-full 
                  text-neutral-500 hover:text-neutral-900 dark:hover:text-white 
                  hover:bg-neutral-100 dark:hover:bg-neutral-700 transition"
                aria-label="Close"
              >
                <IoMdClose className="w-5 h-5" />
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
