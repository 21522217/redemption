import firebase_app from "./config";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import { useLoading } from "@/contexts/LoadingContext";
import { useRouter } from "next/navigation";
import { getFriendlyFirebaseErrorMessage } from "./firebaseErrors";
import { FirebaseError } from "firebase/app";

const auth = getAuth(firebase_app);

async function performSignIn(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export default function useSignIn() {
  const { setLoadingState } = useLoading();
  const router = useRouter();

  async function signIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    setLoadingState(true);

    try {
      await performSignIn(email, password);
      toast.success("Logged in successfully!", { position: "top-right" });
      router.push("/");
    } catch (error) {
      const errorMessage =
        error instanceof FirebaseError
          ? getFriendlyFirebaseErrorMessage(error.code)
          : "An unexpected error occurred.";
      toast.error(`Failed to log in: ${errorMessage}`, {
        position: "top-right",
      });
    } finally {
      setLoadingState(false);
    }
  }

  return { signIn };
}
