"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { onAuthStateChanged, getAuth, User } from "firebase/auth";
import { useLoading } from "./LoadingContext";
import firebase_app from "@/lib/firebase/config";

interface AuthContextValue {
  user: User | null;
  isLogin: boolean;
  isLoading: boolean;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

const auth = getAuth(firebase_app);

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export const useAuthContext = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
};

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { setLoadingState } = useLoading();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          setIsLogin(true);

          const token = await firebaseUser.getIdToken();
          document.cookie = `firebaseAuthToken=${token}; path=/; max-age=3600`;
        } else {
          setUser(null);
          setIsLogin(false);
          document.cookie = "firebaseAuthToken=; path=/; max-age=0";
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        setUser(null);
        setIsLogin(false);
      } finally {
        setIsLoading(false);
        setLoadingState(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLogin, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
};
