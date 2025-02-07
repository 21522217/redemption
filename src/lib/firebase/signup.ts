"use client";

import firebase_app from "./config";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import { useLoading } from "@/contexts/LoadingContext";
import { useRouter } from "next/navigation";
import { createUserDocument } from "./apis/user.server";
import { User } from "@/types/user";
import { FirebaseError } from "firebase/app";
import { getFriendlyFirebaseErrorMessage } from "./firebaseErrors";

const auth = getAuth(firebase_app);

async function performFirebaseSignUp(email: string, password: string) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
}

export default function useSignUp() {
  const { setLoadingState } = useLoading();
  const router = useRouter();

  async function signUp({
    email,
    password,
    firstName,
    lastName,
    username,
  }: SignUpData): Promise<void> {
    setLoadingState(true);

    try {
      // Create Firebase Auth user
      const result = await performFirebaseSignUp(email, password);
      const uid = result.user.uid;

      // Create Firestore user document
      const newUser: Omit<User, "id" | "passwordHash"> = {
        username,
        firstName,
        lastName,
        email,
        profilePicture: "https://github.com/shadcn.png",
        bio: "",
        followers: 0,
        isVerified: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await createUserDocument(uid, newUser);

      toast.success("Account created successfully!", { position: "top-right" });
      router.push("/login");
    } catch (error) {
      const errorMessage =
        error instanceof FirebaseError
          ? getFriendlyFirebaseErrorMessage(error.code)
          : "An unexpected error occurred.";
      toast.error(`Failed to create account: ${errorMessage}`, {
        position: "top-right",
      });
    } finally {
      setLoadingState(false);
    }
  }

  return { signUp };
}
