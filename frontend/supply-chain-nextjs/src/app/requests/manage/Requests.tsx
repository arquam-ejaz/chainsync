"use client";

import { ProductDto } from "@/app/products/Products";
import { SiteDto } from "@/app/sites/Sites";
import { useSessionContext } from "@/providers/ContextProvider";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Spinner from "@/components/Spinner/Spinner";
import ManageRequestModal from "./ManageRequestModal";
import Button from "@/components/Button/Button";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useCallback, useEffect, useState } from "react";
import { Session } from "@chromia/ft4";

export interface RequestDto {
  id: string;
  approved: 1 | 0;
  msg: string;
  pending: 1 | 0;
  product: ProductDto;
  quantity: number;
  requested_by: SiteDto;
  requested_from: SiteDto;
}

const TablesPage = () => {
  const { session, account } = useSessionContext();
  const [selectedRequest, setSelectedRequest] = useState<RequestDto | null>(
    null,
  );
  const [requestsBy, setRequestsBy] = useState<RequestDto[]>([]);
  const [requestsFrom, setRequestsFrom] = useState<RequestDto[]>([]);
  const [openManageRequestModal, setOpenManageRequestModal] = useState(false);
  const [isRequestsFromLoading, setIsRequestsFromLoading] = useState(true);
  const [isRequestsByLoading, setIsRequestsByLoading] = useState(true);

  const fetchRequestsBy = useCallback(
    async (session: Session, site_id: string) => {
      try {
        setIsRequestsByLoading(true);
        // @ts-ignore
        const data = await session.query<RequestDto[]>({
          name: "get_products_requested_by",
          args: {
            req_by_site_id: site_id,
          },
        });
        setRequestsBy(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsRequestsByLoading(false);
      }
    },
    [],
  );

  const fetchRequestsFrom = useCallback(
    async (session: Session, site_id: string) => {
      try {
        setIsRequestsFromLoading(true);
        // @ts-ignore
        const data = await session.query<RequestDto[]>({
          name: "get_products_requested_from",
          args: {
            req_from_site_id: site_id,
          },
        });
        setRequestsFrom(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsRequestsFromLoading(false);
      }
    },
    [],
  );

  const handleManageRequestClick = (request: RequestDto) => {
    setSelectedRequest(request);
    setOpenManageRequestModal(true);
  };

  const handleManageRequestModalClose = () => {
    setSelectedRequest(null);
    setOpenManageRequestModal(false);
  };

  useEffect(() => {
    if (session && account) {
      if (account.site.type !== "WAREHOUSE")
        fetchRequestsBy(session, account.site.id);
      fetchRequestsFrom(session, account.site.id);
    }
  }, [session, account, fetchRequestsBy, fetchRequestsFrom]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Manage requests" />

      <div className="flex flex-col gap-10">
        {account && account.site.type !== "WAREHOUSE" && (
          <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="flex flex-col">
              <div>
                <h2 className="pb-3.5 text-xl font-semibold uppercase">
                  Requests made by you
                </h2>
              </div>
              <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-6">
                <div className="p-2.5 xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Serial No.
                  </h5>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    To
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
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Status
                  </h5>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Message
                  </h5>
                </div>
              </div>

              {isRequestsByLoading && <Spinner />}

              {requestsBy.map((request, key) => (
                <div
                  className={`grid grid-cols-3 sm:grid-cols-6 ${
                    key === requestsBy.length - 1
                      ? ""
                      : "border-b border-stroke dark:border-strokedark"
                  }`}
                  key={request.id}
                >
                  <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <p className="text-black dark:text-white">{key + 1}</p>
                  </div>

                  <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <p className="text-black dark:text-white">
                      {request.requested_from.name}
                    </p>
                  </div>

                  <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <p className="text-black dark:text-white">
                      {request.product.name}
                    </p>
                  </div>
                  <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <p className="text-black dark:text-white">
                      {request.quantity}
                    </p>
                  </div>
                  <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${
                        request.pending
                          ? "bg-warning text-warning"
                          : request.approved
                            ? "bg-success text-success"
                            : "bg-danger text-danger"
                      }`}
                    >
                      {request.pending
                        ? "Pending"
                        : request.approved
                          ? "Approved"
                          : "Rejected"}
                    </p>
                  </div>
                  <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <p className="text-black dark:text-white">{request.msg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="flex flex-col">
            <div>
              <h2 className="pb-3.5 text-xl font-semibold uppercase">
                Requests to your site
              </h2>
            </div>
            <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-6">
              <div className="p-2.5 xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Serial No.
                </h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  From
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
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Status
                </h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Action
                </h5>
              </div>
            </div>

            {isRequestsFromLoading && <Spinner />}

            {requestsFrom.map((request, key) => (
              <div
                className={`grid grid-cols-3 sm:grid-cols-6 ${
                  key === requestsFrom.length - 1
                    ? ""
                    : "border-b border-stroke dark:border-strokedark"
                }`}
                key={request.id}
              >
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{key + 1}</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">
                    {request.requested_from.name}
                  </p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">
                    {request.product.name}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">
                    {request.quantity}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p
                    className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${
                      request.pending
                        ? "bg-warning text-warning"
                        : request.approved
                          ? "bg-success text-success"
                          : "bg-danger text-danger"
                    }`}
                  >
                    {request.pending
                      ? "Pending"
                      : request.approved
                        ? "Approved"
                        : "Rejected"}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <Button
                    size="small"
                    onClick={() => handleManageRequestClick(request)}
                    disabled={request.pending === 0}
                  >
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {openManageRequestModal && selectedRequest && (
        <ManageRequestModal
          isOpen={openManageRequestModal}
          onClose={handleManageRequestModalClose}
          onSuccess={() => {
            handleManageRequestModalClose();
            if (session && account) fetchRequestsFrom(session, account.site.id);
          }}
          request_id={selectedRequest.id}
        />
      )}
    </DefaultLayout>
  );
};

export default TablesPage;
