import * as z from "zod";

export const userSettingFormSchema = z.object({
   username: z.string().min(1, "Username is required"),
   firstName: z.string().min(1, "First name is required"),
   lastName: z.string().min(1, "Last name is required"),
   bio: z.string().optional(),
   profilePicture: z.string().optional(),
   link: z.string().optional(),
   showReplyTab: z.boolean(),
   showRepostTab: z.boolean(),
});