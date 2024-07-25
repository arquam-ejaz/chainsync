import { Metadata } from "next";
import SignIn from "@/app/auth/signin/SignIn";

export const metadata: Metadata = {
  title: "ChainSync",
  description: "Supply chain management software on Chromia blockchain",
};

export default function Home() {
  return <SignIn />;
}
