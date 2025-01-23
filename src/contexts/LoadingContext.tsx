"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";

type LoadingContextType = {
  isLoading: boolean;
  setLoadingState: (state: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider!");
  }

  return context;
};

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shouldDisplayLoader, setShouldDisplayLoader] =
    useState<boolean>(false);

  const setLoadingState = (state: boolean) => {
    if (state) {
      setIsLoading(true);
      setShouldDisplayLoader(true);
    } else {
      setTimeout(() => {
        setShouldDisplayLoader(false);
      }, 100);
    }
  };

  useEffect(() => {
    if (!shouldDisplayLoader) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [shouldDisplayLoader]);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoadingState }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-red-300/50 backdrop-blur-sm z-50">
          <motion.div
            className="w-16 h-16 border-4 border-general-pink rounded-full border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
      )}
    </LoadingContext.Provider>
  );
};
