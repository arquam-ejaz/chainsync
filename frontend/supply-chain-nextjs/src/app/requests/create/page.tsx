import Create from "./Create";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Request",
};

export default function Page() {
  return <Create />;
}
