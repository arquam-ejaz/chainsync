"use client";

import { useSessionContext } from "@/providers/ContextProvider";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Spinner from "@/components/Spinner/Spinner";
import AddProductModal from "./AddProductModal";
import Button from "@/components/Button/Button";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { FC, useEffect, useState } from "react";
import { Session } from "@chromia/ft4";
import { toast } from "react-toastify";

export interface ProductDto {
  id: string;
  name: string;
  desc: string;
  type: string;
}

const TablesPage: FC<{}> = () => {
  const { session } = useSessionContext();
  const [openAddProductModal, setOpenAddProductModal] = useState(false);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [products, setProducts] = useState<ProductDto[]>([]);

  const fetchProducts = async (session: Session) => {
    try {
      setIsProductsLoading(true);
      // @ts-ignore
      const data = await session.query<ProuctDto[]>({
        name: "get_products",
      });
      setProducts(data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching users! Please try again.");
    } finally {
      setIsProductsLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchProducts(session);
  }, [session]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Products Listing" />

      <div className="mb-2 flex justify-end">
        <Button
          onClick={() => {
            setOpenAddProductModal(true);
          }}
          size={"small"}
        >
          Add Product
        </Button>
      </div>

      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="flex flex-col">
            <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
              <div className="p-2.5 xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Serial No.
                </h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Name
                </h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Type
                </h5>
              </div>
              <div className="col-span-2 p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Description
                </h5>
              </div>
            </div>

            {isProductsLoading && <Spinner />}

            {products.map((product, key) => (
              <div
                className={`grid grid-cols-3 sm:grid-cols-5 ${
                  key === products.length - 1
                    ? ""
                    : "border-b border-stroke dark:border-strokedark"
                }`}
                key={product.id}
              >
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{key + 1}</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{product.name}</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{product.type}</p>
                </div>

                <div className="col-span-2 hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="text-black dark:text-white">{product.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {openAddProductModal && (
        <AddProductModal
          isOpen={openAddProductModal}
          onClose={() => setOpenAddProductModal(false)}
          onSuccess={() => session && fetchProducts(session)}
        />
      )}
    </DefaultLayout>
  );
};

export default TablesPage;
