"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/types/user";
import { userSettingFormSchema } from "@/lib/validations/userInfo";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "./ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "./ui/form";
import { FormFieldInput } from "./FormFieldInput";
import { FormFieldAvatar } from "./FormFieldAvatar";
import { FormFieldSwitch } from "./FormFieldSwitch";
import { toast } from "react-toastify";
import { updateUserProfile } from "@/lib/firebase/apis/user.server";
import { Camera } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserIcon } from "lucide-react";

interface ChangeProfileModalProps {
  isOpen: boolean;
  onChange: (open: boolean) => void;
  currentUser: User | null;
  showRepostTab: boolean;
  setShowRepostTab: (value: boolean) => void;
  onProfileUpdate?: () => void;
}

type UserProfileUpdate = Partial<
  Pick<User, "username" | "firstName" | "lastName" | "bio" | "profilePicture">
> & {
  showRepostTab?: boolean;
};

const MAX_BIO_LENGTH = 500; // Giới hạn 500 ký tự

const ChangeProfileModal: React.FC<ChangeProfileModalProps> = ({
  isOpen,
  onChange,
  currentUser,
  showRepostTab,
  setShowRepostTab,
  onProfileUpdate,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bioLength, setBioLength] = useState(currentUser?.bio?.length || 0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm<UserProfileUpdate>({
    resolver: zodResolver(userSettingFormSchema),
    defaultValues: {
      username: currentUser?.username || "",
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
      bio: currentUser?.bio || "",
      profilePicture: currentUser?.profilePicture || "",
      showRepostTab: showRepostTab,
    },
  });

  useEffect(() => {
    if (currentUser) {
      form.reset({
        username: currentUser.username,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        bio: currentUser.bio,
        profilePicture: currentUser.profilePicture,
        showRepostTab: showRepostTab,
      });
    }
  }, [currentUser, form.reset]);

  const handleAvatarUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    return result?.data?.link;
  };

  const onSubmit = async (data: UserProfileUpdate) => {
    try {
      if (selectedFile) {
        const uploadedAvatarUrl = await handleAvatarUpload(selectedFile);
        data.profilePicture = uploadedAvatarUrl;
      }

      console.log("Update data: ", data);

      await updateUserProfile(data);

      setShowRepostTab(data.showRepostTab ?? showRepostTab);

      toast.success("Profile updated successfully!", { position: "top-right" });

      onChange(false);
      onProfileUpdate?.();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogOverlay className="backdrop-blur-sm bg-neutral-900/5">
        <DialogContent className="h-fit bg-card md:sm:rounded-2xl w-full md:w-[600px]">
          <DialogTitle className="text-xl font-semibold text-center mb-4">
            Change Profile
          </DialogTitle>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col space-y-6"
            >
              {/* Profile Picture & Username */}
              <div className="flex flex-row justify-between space-x-4 bg-transparent">
                <FormFieldInput
                  control={form.control}
                  name="username"
                  label="Username"
                />
                <FormFieldAvatar
                  control={form.control}
                  name="profilePicture"
                  setSelectedFile={setSelectedFile}
                />
              </div>

              {/* User Details */}
              <FormFieldInput
                control={form.control}
                name="firstName"
                label="First Name"
              />
              <FormFieldInput
                control={form.control}
                name="lastName"
                label="Last Name"
              />
              <fieldset className="mb-[15px] flex flex-col justify-start">
                <div className="flex justify-between items-center mb-2.5">
                  <label className="text-[13px] leading-none" htmlFor="bio">
                    Bio
                  </label>
                  <span
                    className={`text-xs ${bioLength > MAX_BIO_LENGTH
                      ? "text-red-500"
                      : "text-zinc-400"
                      }`}
                  >
                    {bioLength}/{MAX_BIO_LENGTH}
                  </span>
                </div>
                <div className="relative">
                  <textarea
                    id="bio"
                    defaultValue={currentUser?.bio}
                    onChange={(e) => {
                      setBioLength(e.target.value.length);
                      form.setValue("bio", e.target.value);
                    }}
                    maxLength={MAX_BIO_LENGTH}
                    className="w-full bg-transparent text-[15px] leading-normal 
                      border border-zinc-700 outline-none resize-none rounded-xl 
                      px-4 py-3 h-[150px] focus:ring-2 focus:ring-primary 
                      transition-all duration-200 ease-in-out overflow-y-auto
                      placeholder:text-zinc-500"
                    placeholder="Tell us about yourself... 
• What do you do?
• What are your interests?
• What are you working on?"
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-zinc-400 bg-card px-2 py-1 rounded-md opacity-70">
                    Press Enter ↵ for new line
                  </div>
                </div>
                <p className="mt-2 text-xs text-zinc-400">
                  Pro tip: Use emojis 🎨 to make your bio more engaging!
                </p>
              </fieldset>

              {/* Preferences */}
              <FormFieldSwitch
                control={form.control}
                name="showRepostTab"
                label="Show post tab"
                description="When turned off, the Post tab will be hidden from your profile"
              />

              {/* Save Button */}
              <Button
                variant="default"
                type="submit"
                className="rounded-xl py-6 text-md font-semibold"
              >
                Save
              </Button>
            </form>
          </Form>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default ChangeProfileModal;
