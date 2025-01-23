"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";

// Define the type for the LoadingContext
type LoadingContextType = {
  isLoading: boolean;
  setLoadingState: (state: boolean) => void;
};

// Create the context
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Custom hook to consume the context
export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider!");
  }

  return context;
};

// Provider component
export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shouldDisplayLoader, setShouldDisplayLoader] =
    useState<boolean>(false);

  // Function to toggle the loading state
  const setLoadingState = (state: boolean) => {
    if (state) {
      setIsLoading(true);
      setShouldDisplayLoader(true);
    } else {
      // Delay hiding the loader for smooth transition
      setTimeout(() => {
        setShouldDisplayLoader(false);
      }, 100);
    }
  };

  // Effect to synchronize `isLoading` with `shouldDisplayLoader`
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
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
