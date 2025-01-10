import React from "react";
import { UserProvier } from "./UserContext";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserProvier>
      {children}
    </UserProvier>
  );
};

export default Providers;
