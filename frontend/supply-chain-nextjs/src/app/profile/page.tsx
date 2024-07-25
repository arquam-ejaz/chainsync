import { Metadata } from "next";
import Profile from "./Profile";

export const metadata: Metadata = {
  title: "My Profile",
  description:
    "View your account details",
};

const Page = () => {
  return <Profile />;
};

export default Page;
