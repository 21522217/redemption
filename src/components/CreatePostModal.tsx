"use client";

import React, { useState, useRef } from "react";
import { AuthContextProvider, useAuth } from "@/contexts/AuthContext";
import { useLoading, LoadingProvider } from "@/contexts/LoadingContext";
import { createRoot } from "react-dom/client";
import * as Dialog from "@radix-ui/react-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Image as LucideImage } from "lucide-react";
import { createPost } from "@/lib/firebase/apis/posts.server";
import Image from "next/image";
import { Post } from "@/types/post";
import { toast } from "react-toastify";

interface CreatePostModalProps {
  isOpen: boolean;
  onChange: (open: boolean) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onChange,
}) => {
  const { user } = useAuth();

  const [content, setContent] = useState<string>("");
  const [media, setMedia] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setMedia(selectedFile);
    }
  };

  const handlePost = async () => {
    if (!content.trim() && !media) {
      toast("Post cannot be empty.");
      return;
    }

    try {
      let uploadedMediaUrl = null;

      if (media) {
        const formData = new FormData();
        formData.append("image", media);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        uploadedMediaUrl = result?.data?.link;
      }

      const newPost: Post = {
        userId: user?.uid || "",
        type: media ? "image" : "text",
        content: content,
        media: uploadedMediaUrl || "",
        tags: ["#test", "#test2"],
        likesCount: 100000,
        commentsCount: 0,
        repostsCount: 0,
        isPinned: false,
        locationName: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await createPost(newPost);
      toast("Post created successfully!");
      setContent("");
      setMedia(null);
      onChange(false);
    } catch (error) {
      console.error("Failed to create post:", error);
      toast("Failed to create post.");
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="z-50 bg-neutral-900/90 backdrop-blur-sm fixed inset-0">
          <Dialog.Content
            className="fixed drop-shadow-md top-1/2 left-1/2 max-h-full 
            w-full md:w-[600px] h-[400px] md:h-auto md:max-h-[85vh] -translate-x-1/2 -translate-y-1/2 rounded-xl p-6 focus:outline-none"
          >
            <div className="flex justify-between items-center mb-4">
              <span
                className="text-primary hover:text-primary/80 cursor-pointer"
                onClick={() => onChange(false)}
              >
                Cancel
              </span>
              <Dialog.Title className="text-xl font-semibold">
                New Post
              </Dialog.Title>
              <div className="w-7" />
            </div>

            <div className="flex gap-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <textarea
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-transparent border-none outline-none resize-none text-lg min-h-[100px]"
                />
                <div className="flex items-center gap-2 text-neutral-400">
                  {media ? (
                    <Image
                      src={URL.createObjectURL(media)}
                      alt="Uploaded Media"
                      width={400}
                      height={600}
                      className="rounded-lg"
                    />
                  ) : (
                    <LucideImage
                      size={35}
                      className="hover:bg-neutral-800 rounded-full cursor-pointer"
                      onClick={handleFileSelect}
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-neutral-800 mt-4 pt-4">
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

  const root = createRoot(modalContainer);

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

    return (
      <LoadingProvider>
        <AuthContextProvider>
          <CreatePostModal isOpen={isOpen} onChange={handleOpenChange} />
        </AuthContextProvider>
      </LoadingProvider>
    );
  };

  root.render(<ModalWrapper />);
};

export default CreatePostModal;
