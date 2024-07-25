import MyInventory from "./MyInventory";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Site Inventory",
};

export default function Page() {
  return <MyInventory />;
}
