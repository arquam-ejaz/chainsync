"use client";

import { useSessionContext } from "@/providers/ContextProvider";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Spinner from "@/components/Spinner/Spinner";
import AddSiteModal from "./AddSiteModal";
import Button from "@/components/Button/Button";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { FC, useEffect, useState } from "react";
import { Session } from "@chromia/ft4";
import { toast } from "react-toastify";

export type SiteDto = {
  id: string;
  name: string;
  address_desc: string;
  type: "SHOWROOM" | "WAREHOUSE";
};

const TablesPage: FC<{}> = () => {
  const { session } = useSessionContext();
  const [sites, setSites] = useState<SiteDto[]>([]);
  const [openAddSiteModal, setOpenAddSiteModal] = useState(false);
  const [isSitesLoading, setIsSitesLoading] = useState(true);

  const fetchSites = async (session: Session) => {
    try {
      setIsSitesLoading(true);
      const data = await session.query<SiteDto[]>({
        name: "get_sites",
      });
      console.log(data);
      setSites(data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching sites! Please try again.");
    } finally {
      setIsSitesLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchSites(session);
  }, [session]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Sites Listing" />

      <div className="mb-2 flex justify-end">
        <Button
          onClick={() => {
            setOpenAddSiteModal(true);
          }}
          size={"small"}
        >
          Add Site
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
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Address
                </h5>
              </div>
            </div>

            {isSitesLoading && <Spinner />}

            {sites.map((site, key) => (
              <div
                className={`grid grid-cols-3 sm:grid-cols-5 ${
                  key === sites.length - 1
                    ? ""
                    : "border-b border-stroke dark:border-strokedark"
                }`}
                key={site.id}
              >
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{key + 1}</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{site.name}</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{site.type}</p>
                </div>

                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="text-black dark:text-white">
                    {site.address_desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {openAddSiteModal && (
        <AddSiteModal
          isOpen={openAddSiteModal}
          onClose={() => setOpenAddSiteModal(false)}
          onSuccess={() => session && fetchSites(session)}
        />
      )}
    </DefaultLayout>
  );
};

export default TablesPage;
