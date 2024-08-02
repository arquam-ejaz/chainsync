"use client";

import { ContextProvider } from "@/providers/ContextProvider";
import { FC, ReactNode } from "react";

const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return <ContextProvider>{children}</ContextProvider>;
};

export default Providers;
