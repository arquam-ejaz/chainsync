import Products from "./Products";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products Listing",
};

export default function Page() {
  return <Products />;
}
