"use client";

import { createContext, useContext, useState, useEffect } from "react";

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

const FullScreenLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-100">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-violet-500"></div>
  </div>
);

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
      {isLoading && <FullScreenLoader />}
    </LoadingContext.Provider>
  );
};
