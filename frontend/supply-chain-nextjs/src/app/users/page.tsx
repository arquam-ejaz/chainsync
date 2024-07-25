import Users from "./Users";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users Listing",
};

export default function Page() {
  return <Users />;
}
