"use client";

import React, { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import * as Dialog from "@radix-ui/react-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Image as LucideImage,
  AtSign,
  Hash,
  List,
  MapPin,
  GitPullRequestDraft,
  CircleEllipsis,
} from "lucide-react";
import Image from "next/image";

interface CreatePostModalProps {
  isOpen: boolean;
  onChange: (open: boolean) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onChange,
}) => {
  const [content, setContent] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handlePost = () => {
    console.log("Post submitted", { content });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="z-50  bg-neutral-900/90 backdrop-blur-sm fixed inset-0">
          <Dialog.Content
            className="fixed drop-shadow-md top-1/2 left-1/2 max-h-full 
              w-full md:w-[600px] h-[400px] md:h-auto md:max-h-[85vh] -translate-x-1/2 -translate-y-1/2 rounded-xl p-6 focus:outline-none"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <span
                className="text-primary hover:text-primary/80 cursor-pointer"
                onClick={() => onChange(false)}
              >
                Cancel
              </span>
              <Dialog.Title className="text-xl font-semibold">
                New thread
              </Dialog.Title>
              <div className="flex items-center gap-2">
                <GitPullRequestDraft className="w-5 h-5 text-primary hover:text-primary/80 cursor-pointer" />
                <CircleEllipsis className="w-5 h-5 text-primary hover:text-primary/80 cursor-pointer" />
              </div>
            </div>

            {/* Body */}
            <div className="flex gap-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  placeholder="What's new?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-transparent border-none outline-none resize-none text-lg min-h-[100px]"
                />
                <div className="flex items-center gap-2 text-neutral-400">
                  <LucideImage className="w-5 h-5 p-2 hover:bg-neutral-800 rounded-full cursor-pointer" />
                  <AtSign className="w-5 h-5 p-2 hover:bg-neutral-800 rounded-full cursor-pointer" />
                  <Hash className="w-5 h-5 p-2 hover:bg-neutral-800 rounded-full cursor-pointer" />
                  <List className="w-5 h-5 p-2 hover:bg-neutral-800 rounded-full cursor-pointer" />
                  <MapPin className="w-5 h-5 p-2 hover:bg-neutral-800 rounded-full cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between border-t border-neutral-800 pt-4">
              <p className="text-sm text-neutral-400">
                Your followers can reply & quote
              </p>
              <Button
                className="bg-neutral-100 text-neutral-900 hover:bg-neutral-200 disabled:bg-neutral-300"
                onClick={handlePost}
              >
                Post
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export const showCreatePostModal = () => {
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

    return <CreatePostModal isOpen={isOpen} onChange={handleOpenChange} />;
  };

  const root = createRoot(modalContainer);
  root.render(<ModalWrapper />);
};

export default CreatePostModal;
