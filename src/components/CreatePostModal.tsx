"use client";

import React, { useState, useRef } from "react";
import { AuthContextProvider, useAuth } from "@/contexts/AuthContext";
import { useLoading, LoadingProvider } from "@/contexts/LoadingContext";
import { createRoot } from "react-dom/client";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Image as LucideImage } from "lucide-react";
import { createPost } from "@/lib/firebase/apis/posts.server";
import Image from "next/image";
import { Post } from "@/types/post";
import { toast } from "react-toastify";
import { X } from "lucide-react";

interface CreatePostModalProps {
  isOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  onChange: (open: boolean) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onChange,
}) => {
  const { user } = useAuth();
  const { setLoadingState, isLoading } = useLoading();

  const [content, setContent] = useState<string>("");
  const [media, setMedia] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_VIDEO_SIZE_MB = 100;
  const MAX_VIDEO_DURATION = 300;

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getMediaDimensions = (
    file: File
  ): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      if (file.type.startsWith("image/")) {
        const img = document.createElement("img") as HTMLImageElement;
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          resolve({ width: img.width, height: img.height });
        };
      } else if (file.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.src = URL.createObjectURL(file);
        video.onloadedmetadata = () => {
          resolve({ width: video.videoWidth, height: video.videoHeight });
        };
      }
    });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    // Check file type
    if (
      !(
        selectedFile.type === "image/png" ||
        selectedFile.type === "image/jpeg" ||
        selectedFile.type === "video/mp4"
      )
    ) {
      toast.error("Only PNG, JPEG, and MP4 files are allowed.");
      return;
    }

    // Check video size
    if (selectedFile.type === "video/mp4") {
      const fileSizeMB = selectedFile.size / (1024 * 1024);
      if (fileSizeMB > MAX_VIDEO_SIZE_MB) {
        toast.error(`Video must be smaller than ${MAX_VIDEO_SIZE_MB}MB`);
        return;
      }

      // Check video duration
      const video = document.createElement("video");
      video.src = URL.createObjectURL(selectedFile);

      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          if (video.duration > MAX_VIDEO_DURATION) {
            toast.error("Video must be shorter than 5 minutes");
            resolve(false);
          }
          resolve(true);
        };
      });
    }

    const dimensions = await getMediaDimensions(selectedFile);
    if (dimensions.width > 600 || dimensions.height > 600) {
      toast.info("Large media will be resized to fit the post.");
    }

    if (selectedFile.type.startsWith("video/")) {
      const fileBlob = await fetch(URL.createObjectURL(selectedFile)).then(
        (r) => r.blob()
      );
      const videoFile = new File([fileBlob], "video.mp4", {
        type: "video/mp4",
      });
      setMedia(videoFile);
    } else {
      setMedia(selectedFile);
    }
  };

  const handlePost = async () => {
    setLoadingState(true);
    if (!content.trim()) {
      toast("Please add some text to your post.");
      setLoadingState(false);
      return;
    }

    try {
      let uploadedMediaUrl = null;

      if (media) {
        const formData = new FormData();
        formData.append(
          media.type.startsWith("image/") ? "image" : "video",
          media,
          media.name
        );
        
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload media.");
        }

        const result = await response.json();
        uploadedMediaUrl = result?.data?.link;
      }

      const newPost: Post = {
        id: "",
        userId: user?.uid || "",
        type: media
          ? media.type.startsWith("image/")
            ? "image"
            : "video"
          : "text",
        content: content,
        tags: ["#test", "#test2"],
        likesCount: 0,
        commentsCount: 0,
        repostsCount: 0,
        isPinned: false,
        locationName: "",
        isSensitive: false,
        ...(uploadedMediaUrl ? { media: uploadedMediaUrl } : {}),
      };

      await createPost(newPost);

      toast("Post created successfully!");
      setContent("");
      setMedia(null);
      onChange(false);
    } catch (error) {
      console.error("Failed to create post:", error);
      toast("Failed to create post.");
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="z-50 bg-neutral-900/90 backdrop-blur-sm fixed inset-0">
          <Dialog.Content
            className="fixed drop-shadow-md border border-neutral-200 dark:border-neutral-700 top-1/2 left-1/2
            w-full md:w-[600px] md:min-h-[300px] md:max-h-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-xl p-6 
            focus:outline-none bg-white dark:bg-neutral-800 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4 p-4">
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
              <div className="flex-1">
                <textarea
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-transparent border-none outline-none resize-none text-lg min-h-[100px]"
                  disabled={isLoading}
                />
                <div className="flex flex-col gap-2">
                  {media && (
                    <div className="relative w-full rounded-lg bg-neutral-100 dark:bg-neutral-900">
                      {media.type.startsWith("image/") ? (
                        <div className="relative w-full">
                          <Image
                            src={URL.createObjectURL(media)}
                            alt="Uploaded Media"
                            width={600}
                            height={400}
                            className="rounded-lg w-full h-auto object-contain max-h-[400px]"
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                      ) : (
                        <video
                          src={URL.createObjectURL(media)}
                          controls
                          className="w-full rounded-lg object-contain max-h-[400px]"
                        />
                      )}
                      <button
                        onClick={() => setMedia(null)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-black/70"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-neutral-400">
                    {!media && (
                      <>
                        <LucideImage
                          size={35}
                          className="hover:bg-neutral-800 rounded-full cursor-pointer p-2"
                          onClick={handleFileSelect}
                        />
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/png, image/jpeg, video/mp4"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-neutral-800 mt-4 pt-4">
              <p className="text-sm text-neutral-400">
                Your followers can reply & quote
              </p>
              <Button
                onClick={handlePost}
                disabled={!content.trim() || isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6"
              >
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : (
                  "Post"
                )}
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
