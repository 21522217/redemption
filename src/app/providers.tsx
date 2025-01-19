"use client";

import React from "react";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthContextProvider } from "@/contexts/AuthContext";
import { Bounce } from "react-toastify";
import { ToastContainer } from "react-toastify";

interface ProviderProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProviderProps> = ({ children }) => {
  return (
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
  );
};

export default Providers;
