"use client";

import React from "react";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthContextProvider } from "@/contexts/AuthContext";
import { Bounce } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface ProviderProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
    mutations: {
      onError: (error) => {
        console.error('Mutation data error:', error);
      },
    },
  }
});

const Providers: React.FC<ProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <LoadingProvider>
        <AuthContextProvider>
          <ThemeProvider>{children}</ThemeProvider>
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
        </AuthContextProvider>
      </LoadingProvider>
    </QueryClientProvider>
  );
};

export default Providers;
