"use client";

import { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
//import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/types/user";
import { userSettingFormSchema } from "@/lib/validations/userInfo";
import { Form, FormField, FormItem } from "./ui/form";
import { FormFieldInput } from "./FormFieldInput";
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from "./ui/dialog";
import { FormFieldSwitch } from "./FormFieldSwitch";
import { useLoading } from "@/contexts/LoadingContext";
import { toast } from "react-toastify";
import { FormFieldAvatar } from "./FormFieldAvatar";

import { fetchCurrentUser } from "@/lib/firebase/apis/user.server";

interface ChangeProfileModalProps {
   isOpen: boolean;
   onChange: (open: boolean) => void;
   showReplyTab: boolean;
   setShowReplyTab: (value: boolean) => void;
   showRepostTab: boolean;
   setShowRepostTab: (value: boolean) => void;
   currentUser: User | null;
}

interface UserSettings {
   username: string;
   firstName: string;
   lastName: string;
   bio: string;
   profilePicture: string;
   showReplyTab: boolean;
   showRepostTab: boolean;
}

const ChangeProfileModal: React.FC<ChangeProfileModalProps> = ({
   isOpen,
   onChange,
   showReplyTab,
   setShowReplyTab,
   showRepostTab,
   setShowRepostTab,
   currentUser,
}) => {

   const form = useForm<UserSettings>({
      resolver: zodResolver(userSettingFormSchema),
      defaultValues: {
         username: currentUser?.username,
         firstName: currentUser?.firstName,
         lastName: currentUser?.lastName,
         bio: currentUser?.bio,
         profilePicture: currentUser?.profilePicture,
         //link: "",
         showReplyTab: showReplyTab,
         showRepostTab: showRepostTab,
      },
   })

   const onSubmit = async (data: UserSettings) => {
      console.log(data);
      setShowReplyTab(data.showReplyTab);
      setShowRepostTab(data.showRepostTab);
      toast.success("Profile updated successfully!", { position: "top-right" });
      onChange(false);
   }


   return (
      <Dialog open={isOpen} onOpenChange={onChange}>
         <DialogPortal>
            <DialogOverlay className="backdrop-blur-sm bg-neutral-900/5" >
               <DialogContent
                  className="h-fit items-center bg-card md:sm:rounded-2xl
              w-full md:w-[600px]"
               >
                  {/* Header */}
                  <DialogTitle className="text-xl font-semibold text-center mb-4">
                     Change Profile
                  </DialogTitle>

                  {/* Form */}
                  <Form {...form}>
                     <form
                        onSubmit={(e) => {
                           e.preventDefault();
                           form.handleSubmit(onSubmit)(e);
                        }}
                        className="flex flex-col space-y-6"
                     >
                        <div className="flex flex-row justify-between space-x-4 bg-transparent">
                           <FormFieldInput
                              control={form.control}
                              name="username"
                              label="Username"
                           />

                           <FormFieldAvatar
                              control={form.control}
                              name="profilePicture"
                              userName={form.getValues("username")}
                           />
                        </div>

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

                        <FormFieldSwitch
                           control={form.control}
                           name="showReplyTab"
                           label="Show reply tab"
                           description="When turned off, the Reply tab will be hidden from your profile"

                        />

                        <FormFieldSwitch
                           control={form.control}
                           name="showRepostTab"
                           label="Show post tab"
                           description="When turned off, the Post tab will be hidden from your profile"
                        />

                        <Button
                           variant={"default"}
                           type="submit"
                           className="rounded-xl py-6 text-md font-semibold"
                        >
                           Save
                        </Button>

                     </form>
                  </Form>

               </DialogContent>
            </DialogOverlay>
         </DialogPortal>
      </Dialog >
   );
};

export const showChangeProfileModal = (
   showReplyTab: boolean,
   setShowReplyTab: (value: boolean) => void,
   showRepostTab: boolean,
   setShowRepostTab: (value: boolean) => void,
   currentUser: User | null
) => {
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

      return <ChangeProfileModal
         isOpen={isOpen}
         onChange={handleOpenChange}
         showReplyTab={showReplyTab}
         setShowReplyTab={setShowReplyTab}
         showRepostTab={showRepostTab}
         setShowRepostTab={setShowRepostTab}
         currentUser={currentUser}
      />;
   };

   const root = createRoot(modalContainer);
   root.render(<ModalWrapper />);
};

export default ChangeProfileModal;
