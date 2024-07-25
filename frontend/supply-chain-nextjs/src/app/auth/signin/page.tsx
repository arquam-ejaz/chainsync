import React from "react";
import { Metadata } from "next";
import SignIn from "./SignIn";

export const metadata: Metadata = {
  title: "Sign in to get started",
};

const Page: React.FC = () => {
  return <SignIn />;
};

export default Page;
