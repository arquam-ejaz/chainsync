"use client";

import { useSessionContext } from "@/providers/ContextProvider";
import { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/css/override.css";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";

export default function Template({ children }: { children: React.ReactNode }) {
  const { session } = useSessionContext();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const isSessionValid = useCallback(() => {
    if (isAuthenticating) return;
    if (!session) {
      setIsAuthenticating(true);
      toast.error("You are currently logged out!");
      const event = new Event("register_account");
      window.dispatchEvent(event);
    }
  }, [session, isAuthenticating]);

  useEffect(() => {
    const interval = setInterval(isSessionValid, 5_000);
    return () => clearInterval(interval);
  }, [isSessionValid]);

  return (
    <>
      <ToastContainer />
      {children}
    </>
  );
}
