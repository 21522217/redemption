import firebase_app from "./config";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import { useLoading } from "@/contexts/LoadingContext";
import { useRouter } from "next/navigation";
import { getFriendlyFirebaseErrorMessage } from "./firebaseErrors";

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
      const result = await performSignIn(email, password);
      toast.success("Logged in successfully!", { position: "top-right" });
      router.push("/");
      return { result, error: null };
    } catch (e: any) {
      const errorMessage = getFriendlyFirebaseErrorMessage(e.code);
      toast.error(`Failed to log in: ${errorMessage}`, {
        position: "top-right",
      });
      return { result: null, error: e };
    } finally {
      setLoadingState(false);
    }
  }

  return { signIn };
}
