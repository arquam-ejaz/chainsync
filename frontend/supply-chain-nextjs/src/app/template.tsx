"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/css/override.css";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToastContainer />
      {children}
    </>
  );
}
