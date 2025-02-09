"use client";

import React, { useState } from "react";
import { AuthContextProvider, useAuth } from "@/contexts/AuthContext";
import { useLoading, LoadingProvider } from "@/contexts/LoadingContext";
import { createRoot } from "react-dom/client";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

interface ReportModalProps {
  isOpen: boolean;
  onChange: (open: boolean) => void;
  postId: string;
}

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onChange,
  postId,
}) => {
  const { user } = useAuth();
  const { setLoadingState } = useLoading();

  const [reportContent, setReportContent] = useState<string>("");

  const handleReport = async () => {
    setLoadingState(true);
    if (!reportContent.trim()) {
      toast("Report content cannot be empty.");
      setLoadingState(false);
      return;
    }

    try {
      await fetch("/api/send-email", {
        method: "POST",
        body: JSON.stringify({
          name: "hello its me bitch",
          //   name: user?.username || "",
          email: user?.email || "",
          message: reportContent,
          postId,
        }),
      });

      toast("Report submitted successfully!");
      setReportContent("");
      onChange(false);
    } catch (error) {
      console.error("Failed to submit report:", error);
      toast("Failed to submit report.");
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="z-50 bg-neutral-900/90 backdrop-blur-sm fixed inset-0">
          <Dialog.Content
            className="fixed drop-shadow-md top-1/2 left-1/2 max-h-full 
            w-full md:w-[600px] h-[400px] md:h-auto md:max-h-[85vh] -translate-x-1/2 -translate-y-1/2 rounded-xl p-6 focus:outline-none bg-background-content"
          >
            <div className="flex justify-between items-center mb-4 p-4">
              <span
                className="text-primary hover:text-primary/80 cursor-pointer"
                onClick={() => onChange(false)}
              >
                Cancel
              </span>
              <Dialog.Title className="text-xl font-semibold">
                Report
              </Dialog.Title>
              <div className="w-7" />
            </div>

            <div className="flex-1">
              <textarea
                placeholder="Describe the issue"
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
                className="w-full bg-transparent border-none outline-none resize-none text-lg min-h-[100px]"
              />
            </div>

            <div className="flex items-center justify-between border-t border-neutral-800 mt-4 pt-4">
              <p className="text-sm text-neutral-400">
                Your report will be reviewed
              </p>
              <Button
                className="bg-neutral-100 text-neutral-900 hover:bg-neutral-200 disabled:bg-neutral-300"
                onClick={handleReport}
              >
                Submit
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export const showReportModal = (postId: string) => {
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
          <ReportModal
            isOpen={isOpen}
            onChange={handleOpenChange}
            postId={postId}
          />
        </AuthContextProvider>
      </LoadingProvider>
    );
  };

  root.render(<ModalWrapper />);
};

export default ReportModal;
