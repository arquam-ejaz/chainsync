"use client";

import { useSessionContext } from "@/providers/ContextProvider";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Spinner from "@/components/Spinner/Spinner";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { FC, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SiteDto } from "../sites/Sites";
import { ProductDto } from "../products/Products";

export interface InventoryDto {
  product: ProductDto;
  quantity: number;
  site: SiteDto;
}

const TablesPage: FC<{}> = () => {
  const { session, account } = useSessionContext();
  const [isInventoriesLoading, setIsInventoriesLoading] = useState(true);
  const [inventories, setInventories] = useState<InventoryDto[]>([]);

  const fetchInventory = useCallback(async () => {
    try {
      if (!session || !account) return;

      setIsInventoriesLoading(true);
      // @ts-ignore
      const data = await session.query<IntentoryDto[]>({
        name: "get_inventory_by_site",
        args: {
          site_id: account.site.id,
        },
      });
      setInventories(data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching inventory! Please try again.");
    } finally {
      setIsInventoriesLoading(false);
    }
  }, [session, account]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Site Inventory Listing" />

      <div className="flex flex-col gap-10">
        {account && (
          <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="flex flex-col">
              <div>
                <h2 className="pb-3.5 font-semibold">
                  Showing inventory for your site {account.site.name}
                </h2>
              </div>
              <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
                <div className="p-2.5 xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Serial No.
                  </h5>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Product
                  </h5>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Quantity
                  </h5>
                </div>
              </div>

              {isInventoriesLoading && <Spinner />}

              {inventories.map((inventory, key) => (
                <div
                  className={`grid grid-cols-3 sm:grid-cols-5 ${
                    key === inventories.length - 1
                      ? ""
                      : "border-b border-stroke dark:border-strokedark"
                  }`}
                  key={inventory.product.id + key}
                >
                  <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <p className="text-black dark:text-white">{key + 1}</p>
                  </div>

                  <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <p className="text-black dark:text-white">
                      {inventory.product.name}
                    </p>
                  </div>

                  <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <p className="text-black dark:text-white">
                      {inventory.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
