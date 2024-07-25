"use client";

import { useSessionContext } from "@/providers/ContextProvider";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Spinner from "@/components/Spinner/Spinner";
import AddUserModal from "./AddUserModal";
import Button from "@/components/Button/Button";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { FC, useEffect, useState } from "react";
import { Session } from "@chromia/ft4";
import { toast } from "react-toastify";
import { SiteDto } from "../sites/Sites";
import { uint8_to_hexStr } from "@/utils";

export interface UserDto {
  account: {
    id: ArrayBuffer | string;
    type: string;
  };
  name: string;
  active: 1 | -1;
  role: {
    title: "ADMIN" | "MANAGER";
  };
  site: SiteDto;
  timestamp: number;
}

const TablesPage: FC<{}> = () => {
  const { session } = useSessionContext();
  const [sites, setSites] = useState<SiteDto[]>([]);
  const [users, setUsers] = useState<UserDto[]>([]);
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const [isUsersLoading, setIsUsersLoading] = useState(true);

  const fetchUsers = async (session: Session) => {
    try {
      setIsUsersLoading(true);
      // @ts-ignore
      const users = await session.query<UserDto[]>({
        name: "get_users",
      });
      // @ts-ignore
      const temp_users = await session.query<UserDto[]>({
        name: "get_temp_users",
      });
      users.push(...temp_users);
      console.log(users.sort((a, b) => b.timestamp - a.timestamp));
      setUsers(users);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching users! Please try again.");
    } finally {
      setIsUsersLoading(false);
    }
  };

  const fetchSites = async (session: Session) => {
    try {
      const data = await session.query<SiteDto[]>({
        name: "get_sites",
      });
      setSites(data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching sites! Please try again.");
    }
  };

  useEffect(() => {
    if (session) {
      fetchSites(session);
      fetchUsers(session);
    }
  }, [session]);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Users Listing" />

      <div className="mb-2 flex justify-end">
        <Button
          onClick={() => {
            setOpenAddUserModal(true);
          }}
          size={"small"}
        >
          Add User
        </Button>
      </div>

      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="flex flex-col">
            <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
              <div className="p-2.5 xl:p-5">
                <h5 className="text-center text-sm font-medium uppercase xsm:text-base">
                  Sl No.
                </h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Name
                </h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Role
                </h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Site
                </h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Status
                </h5>
              </div>
            </div>

            {isUsersLoading && <Spinner />}

            {users.map((user, key) => (
              <div
                className={`grid grid-cols-3 sm:grid-cols-5 ${
                  key === users.length - 1
                    ? ""
                    : "border-b border-stroke dark:border-strokedark"
                }`}
                key={user.timestamp + ""}
              >
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{key + 1}</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{user.name}</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">
                    {user.role.title}
                  </p>
                </div>

                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="text-black dark:text-white">
                    {user.role.title === "ADMIN" ? "-" : user.site.name}
                  </p>
                </div>

                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="text-black dark:text-white">
                    {user.active === 1 ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {openAddUserModal && (
        <AddUserModal
          isOpen={openAddUserModal}
          onClose={() => setOpenAddUserModal(false)}
          onSuccess={() => session && fetchUsers(session)}
          sites={sites}
        />
      )}
    </DefaultLayout>
  );
};

export default TablesPage;
