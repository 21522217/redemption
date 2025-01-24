"use client";

import firebase_app from "./config";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import { useLoading } from "@/contexts/LoadingContext";
import { useRouter } from "next/navigation";

const auth = getAuth(firebase_app);

async function performSignUp(email: string, password: string) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

export default function useSignUp() {
  const { setLoadingState } = useLoading();
  const router = useRouter();

  async function signUp({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    setLoadingState(true);
    let result: any = null;
    let error: any = null;

    try {
      result = await performSignUp(email, password);
      toast.success("Account created successfully!", {
        position: "top-right",
      });
      router.push("/login");
    } catch (e: any) {
      error = e;
      const errorMessage =
        e.message || "An unexpected error occurred during signup.";
      toast.error(`Failed to create account: ${errorMessage}`, {
        position: "top-right",
      });
    } finally {
      setLoadingState(false);
    }

    return { result, error };
  }

  return { signUp };
}
