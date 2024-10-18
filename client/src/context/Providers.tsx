import React from "react";
import { UserProvier } from "./UserContext";
import { ThemeProvider } from "./ThemeContext";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserProvier>
      <ThemeProvider>{children}</ThemeProvider>
    </UserProvier>
  );
};

export default Providers;
