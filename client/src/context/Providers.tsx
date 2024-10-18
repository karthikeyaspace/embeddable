import React from "react";
import { AuthProvider } from "./AuthContext";
import { ThemeProvider } from "./ThemeContext";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </AuthProvider>
  );
};

export default Providers;
