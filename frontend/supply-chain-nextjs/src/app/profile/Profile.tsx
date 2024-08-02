"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useSessionContext } from "@/providers/ContextProvider";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UpdateUserModal from "./UpdateUserModal";
import Spinner from "@/components/Spinner/Spinner";
import { useEffect, useState } from "react";

const Profile = () => {
  const { account, session } = useSessionContext();
  const [openUpdateUserModal, setOpenUpdateUserModal] = useState(false);

  const handleUserUpdated = () => {
    const event = new Event("refetch_account");
    window.dispatchEvent(event);
  };

  useEffect(() => {
    console.log({ account, session });
  }, [account, session]);

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="Profile" />

        {!account && <Spinner />}

        {account && (
          <div className="overflow-hidden rounded-s bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="p-6 text-center lg:pb-8 xl:pb-11.5">
              <div className="mt-4">
                <div className="grid grid-cols-2 border-b border-stroke pb-3 dark:border-strokedark">
                  <h3 className="text-2xl font-semibold text-black dark:text-white">
                    Name
                  </h3>
                  <div className="flex justify-center gap-1">
                    <h3 className="text-2xl font-medium text-black dark:text-white">
                      {account.name}
                    </h3>
                    <button
                      className="text-primary"
                      onClick={() => setOpenUpdateUserModal(true)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 border-b border-stroke p-3 dark:border-strokedark">
                  <h3 className="text-2xl font-semibold text-black dark:text-white">
                    Role
                  </h3>
                  <h3 className="text-2xl font-medium text-black dark:text-white">
                    {account.role.title}
                  </h3>
                </div>
                <div className="grid grid-cols-2 border-b border-stroke p-3 p-3 dark:border-strokedark">
                  <h3 className="text-2xl font-semibold text-black dark:text-white">
                    Site Name
                  </h3>
                  <h3 className="text-2xl font-medium text-black dark:text-white">
                    {account.site.name}
                  </h3>
                </div>
                <div className="grid grid-cols-2 pt-3">
                  <h3 className="text-2xl font-semibold text-black dark:text-white">
                    Site Type
                  </h3>
                  <h3 className="text-2xl font-medium text-black dark:text-white">
                    {account.site.type}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {openUpdateUserModal && account && (
        <UpdateUserModal
          isOpen={openUpdateUserModal}
          onClose={() => setOpenUpdateUserModal(false)}
          current_name={account.name}
          onSuccess={handleUserUpdated}
        />
      )}
    </DefaultLayout>
  );
};

export default Profile;
