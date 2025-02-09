"use client";

import firebase_app from "./config";
import { signInWithPopup, signOut, getAuth } from "firebase/auth";
import { googleProvider } from "./config";
import { toast } from "react-toastify";
import { useLoading } from "@/contexts/LoadingContext";
import { useRouter } from "next/navigation";
import { createUserDocument } from "./apis/user.server";
import { User } from "@/types/user";
import { FirebaseError } from "firebase/app";

const firebaseAuth = getAuth(firebase_app);

export default function useGoogleAuth() {
  const { setLoadingState } = useLoading();
  const router = useRouter();

  const signInWithGoogle = async () => {
    setLoadingState(true);
    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      const user = result.user;

      // Create Firestore user document
      const newUser: Omit<User, "id" | "passwordHash"> = {
        username: user.displayName || "",
        firstName: user.displayName?.split(" ")[0] || "",
        lastName: user.displayName?.split(" ")[1] || "",
        email: user.email || "",
        profilePicture: user.photoURL || "https://github.com/shadcn.png",
        bio: "",
        followers: 0,
        isVerified: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await createUserDocument(user.uid, newUser);

      toast.success("Logged in successfully!", { position: "top-right" });
      router.push("/");
      return user;
    } catch (error) {
      const errorMessage =
        error instanceof FirebaseError
          ? error.message
          : "An unexpected error occurred.";
      toast.error(`Failed to log in: ${errorMessage}`, {
        position: "top-right",
      });
      throw error;
    } finally {
      setLoadingState(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(firebaseAuth);
      toast.success("Logged out successfully!", { position: "top-right" });
    } catch (error) {
      console.error("Sign-Out Error:", error);
      toast.error("Failed to log out.", { position: "top-right" });
    }
  };

  return { signInWithGoogle, logout };
}
