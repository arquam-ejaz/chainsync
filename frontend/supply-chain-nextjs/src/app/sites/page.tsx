import Sites from "./Sites";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sites Listing",
};

export default function Page() {
  return <Sites />;
}
