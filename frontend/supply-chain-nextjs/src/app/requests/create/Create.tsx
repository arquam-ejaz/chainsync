"use client";

import { useSessionContext } from "@/providers/ContextProvider";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Spinner from "@/components/Spinner/Spinner";
import CreateRequestModal from "./CreateRequestModal";
import Button from "@/components/Button/Button";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { FC, useCallback, useEffect, useState } from "react";
import { Session } from "@chromia/ft4";
import { toast } from "react-toastify";
import { SiteDto } from "../../sites/Sites";
import { ProductDto } from "../../products/Products";
import { InventoryDto } from "@/app/inventory/Inventory";

interface IntentoryDto {
  product: ProductDto;
  quantity: number;
  site: SiteDto;
}

const TablesPage: FC<{}> = () => {
  const { session, account } = useSessionContext();
  const [openCreateRequestModal, setOpenCreateRequestModal] = useState(false);
  const [isInventoriesLoading, setIsInventoriesLoading] = useState(true);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [inventories, setInventories] = useState<IntentoryDto[]>([]);
  const [selectedInventory, setSelectedInventory] =
    useState<InventoryDto | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(
    null,
  );

  const fetchSiteInventories = useCallback(async () => {
    try {
      if (!selectedProduct || !session || !account) return;

      setIsInventoriesLoading(true);
      // @ts-ignore
      const data = await session.query<IntentoryDto[]>({
        name: "get_inventory_by_product",
        args: {
          product_id: selectedProduct.id,
        },
      });
      setInventories(data.filter((inv) => inv.site.id !== account.site.id));
    } catch (error) {
      console.error(error);
      toast.error("Error fetching inventory! Please try again.");
    } finally {
      setIsInventoriesLoading(false);
    }
  }, [selectedProduct, session, account]);

  const fetchProducts = async (session: Session) => {
    try {
      // @ts-ignore
      const data = await session.query<ProuctDto[]>({
        name: "get_products",
      });
      setProducts(data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching users! Please try again.");
    }
  };

  const handleCreateRequestModal = () => {
    setOpenCreateRequestModal(false);
    setSelectedInventory(null);
  };

  useEffect(() => {
    fetchSiteInventories();
  }, [fetchSiteInventories]);

  useEffect(() => {
    if (session) {
      fetchProducts(session);
    }
  }, [session, account]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Create Product Request" />

      <div className="mb-2 flex justify-between">
        <div>
          <div className="relative z-20 bg-white dark:bg-form-input">
            <select
              value={selectedProduct?.id ?? ""}
              onChange={(e) => {
                const product_id = e.target.value;
                setSelectedProduct(
                  products.find((product) => product.id === product_id) || null,
                );
                setOpenCreateRequestModal(true);
              }}
              name="type"
              className={`} relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 pl-4 pr-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input`}
            >
              <option
                value={""}
                selected
                disabled
                className="text-body dark:text-bodydark"
              >
                Select a product
              </option>
              {products.map((product) => (
                <option
                  value={product.id}
                  className="text-body dark:text-bodydark"
                  key={product.id}
                >
                  {product.name}
                </option>
              ))}
            </select>

            <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.8">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                    fill="#637381"
                  ></path>
                </g>
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          {!selectedProduct && (
            <h2 className="pb-3.5 font-semibold">
              Select a product to view available sites
            </h2>
          )}

          {selectedProduct && (
            <div className="flex flex-col">
              <div>
                <h2 className="pb-3.5 font-semibold">
                  Showing site inventories for product: {selectedProduct.name}
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
                    Site
                  </h5>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Quantity
                  </h5>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Action
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
                      {inventory.site.name}
                    </p>
                  </div>

                  <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <p className="text-black dark:text-white">
                      {inventory.quantity}
                    </p>
                  </div>

                  <div className="col-span-2 flex items-center p-2.5 xl:p-5">
                    <div>
                      <Button
                        size="small"
                        onClick={() => {
                          setSelectedInventory(inventory);
                          setOpenCreateRequestModal(true);
                        }}
                      >
                        Create Request
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {openCreateRequestModal && selectedInventory && (
        <CreateRequestModal
          isOpen={openCreateRequestModal}
          onClose={handleCreateRequestModal}
          onSuccess={handleCreateRequestModal}
          selectedInventory={selectedInventory}
        />
      )}
    </DefaultLayout>
  );
};

export default TablesPage;
