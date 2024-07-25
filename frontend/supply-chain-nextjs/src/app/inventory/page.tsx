import Inventory from "./Inventory";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventory Listing",
};

export default function Page() {
  return <Inventory />;
}
