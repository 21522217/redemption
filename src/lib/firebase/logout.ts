import firebase_app from "./config";
import { signOut, getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import { useLoading } from "@/contexts/LoadingContext";
import { useRouter } from "next/navigation";

const auth = getAuth(firebase_app);

export default function useLogout() {
  const { setLoadingState } = useLoading();
  const router = useRouter();

  async function logout() {
    setLoadingState(true);
    let result = null,
      error = null;

    try {
      result = await signOut(auth);
      toast.success("Logged out successfully!", {
        position: "top-right",
      });
      router.push("/login");
    } catch (e: any) {
      error = e;
      const errorMessage =
        e.message || "An unexpected error occurred during logout.";
      toast.error(`Failed to log out: ${errorMessage}`, {
        position: "top-right",
      });
    } finally {
      setLoadingState(false);
    }

    return { result, error };
  }

  return { logout };
}
