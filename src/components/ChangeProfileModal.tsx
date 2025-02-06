"use client";

import { useEffect, useState } from "react";
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

const ChangeProfileModal: React.FC<ChangeProfileModalProps> = ({
  isOpen,
  onChange,
  currentUser,
  showRepostTab,
  setShowRepostTab,
  onProfileUpdate,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
              <FormFieldInput
                control={form.control}
                name="bio"
                label="Your bio"
              />

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
