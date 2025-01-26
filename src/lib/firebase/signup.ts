"use client";

import firebase_app from "./config";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import { useLoading } from "@/contexts/LoadingContext";
import { useRouter } from "next/navigation";
import { createUserDocument } from "./apis/user.server";

export interface CreateUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
}

const auth = getAuth(firebase_app);
async function performFirebaseSignUp(email: string, password: string) {
  return await createUserWithEmailAndPassword(auth, email, password);
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
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username: string;
  }) {
    setLoadingState(true);

    try {
      const result = await performFirebaseSignUp(email, password);

      await createUserDocument(result, {
        email,
        password,
        firstName,
        lastName,
        username,
      });

      toast.success("Account created successfully!", {
        position: "top-right",
      });

      router.push("/login");
    } catch (e: any) {
      const errorMessage =
        e.message || "An unexpected error occurred during signup.";
      toast.error(`Failed to create account: ${errorMessage}`, {
        position: "top-right",
      });
    } finally {
      setLoadingState(false);
    }
  }

  return { signUp };
}
