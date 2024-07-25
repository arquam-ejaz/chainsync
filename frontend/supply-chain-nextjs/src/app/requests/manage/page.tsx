import Requests from "./Requests";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Requests",
};

export default function Page() {
  return <Requests />;
}
