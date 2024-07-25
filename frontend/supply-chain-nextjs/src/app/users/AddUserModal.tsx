import Modal from "@/components/Modal.tsx/Modal";
import { useFormik } from "formik";
import SwitcherThree from "@/components/Switchers/SwitcherThree";
import { useSessionContext } from "@/providers/ContextProvider";
import * as Yup from "yup";
import { toast, Icons } from "react-toastify";
import { FC, useState } from "react";
import { SiteDto } from "../sites/Sites";
import { initSiteId } from "@/config/constant";

enum RoleType {
  admin = "ADMIN",
  manager = "MANAGER",
}

interface AddUserInput {
  pubkey: string;
  role_title: "ADMIN" | "MANAGER";
  site_id: string;
  name: string;
  is_active: boolean;
}

interface AddSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  sites: SiteDto[];
}

const AddUserModal: FC<AddSiteModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  sites,
}) => {
  const { session } = useSessionContext();
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  const initialValues: AddUserInput = {
    pubkey: "",
    role_title: "MANAGER",
    site_id: "",
    name: "",
    is_active: true,
  };

  const formik = useFormik<AddUserInput>({
    initialValues,
    validationSchema: Yup.object().shape({
      pubkey: Yup.string().required(),
      role_title: Yup.string()
        .oneOf([RoleType.admin, RoleType.manager])
        .required(),
      site_id: Yup.string().uuid().required("Required"),
      name: Yup.string().min(3).required("Required"),
      is_active: Yup.boolean().required(),
    }),
    validateOnMount: true,
    onSubmit: async (values) => {
      const tId = toast.loading("Submitting...");
      if (!session) return;
      try {
        await session.call({
          name: "add_user",
          args: [session.account.id, ...Object.values(values)],
        });
        toast.update(tId, {
          render: "User added successfully!",
          type: "success",
          icon: Icons.success,
        });
        setTimeout(() => {
          toast.dismiss(tId);
          if (onSuccess) onSuccess();
          onClose();
        }, 1000);
      } catch (error) {
        toast.update(tId, {
          render: "Error adding user! Please try again.",
          type: "error",
        });
        setTimeout(() => {
          toast.dismiss(tId);
        }, 1000);
      }
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} heading="Add user details">
      {/* <!-- Add User Form --> */}
      <form action="#" onSubmit={formik.handleSubmit}>
        <div>
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Name
              </label>
              <input
                value={formik.values.name}
                onChange={formik.handleChange}
                type="text"
                name="name"
                placeholder="User name"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Assign site
              </label>
              <div className="relative z-20 bg-white dark:bg-form-input">
                <select
                  disabled={formik.values.role_title === "ADMIN"}
                  value={formik.values.site_id}
                  onChange={(e) => {
                    formik.setFieldValue("site_id", e.target.value);
                    changeTextColor();
                  }}
                  name="site_id"
                  className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${
                    isOptionSelected ? "text-black dark:text-white" : ""
                  }`}
                >
                  <option
                    value=""
                    selected
                    disabled
                    className="text-body dark:text-bodydark"
                  >
                    Select Site
                  </option>
                  {sites
                    .filter(({ id }) => {
                      if (formik.values.role_title === "MANAGER")
                        return id !== initSiteId;
                      return true;
                    })
                    .map((site) => (
                      <option
                        value={site.id}
                        className="text-body dark:text-bodydark"
                        key={site.id}
                      >
                        {site.name}
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

          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Wallet address of user (without &apos;0x&apos;)
            </label>
            <input
              value={formik.values.pubkey}
              onChange={formik.handleChange}
              type="text"
              name="pubkey"
              placeholder="Enter hex string"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Assign role
              </label>
              <div className="relative z-20 bg-white dark:bg-form-input">
                <select
                  value={formik.values.role_title}
                  onChange={(e) => {
                    const role_title = e.target.value;
                    formik.setFieldValue("role_title", role_title);
                    if (role_title === "ADMIN") {
                      formik.setFieldValue("site_id", initSiteId);
                    }
                    changeTextColor();
                  }}
                  name="site_id"
                  className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${
                    isOptionSelected ? "text-black dark:text-white" : ""
                  }`}
                >
                  <option
                    value=""
                    selected
                    disabled
                    className="text-body dark:text-bodydark"
                  >
                    Select Role
                  </option>
                  <option
                    value={RoleType.manager}
                    className="text-body dark:text-bodydark"
                  >
                    Manager
                  </option>
                  <option
                    value={RoleType.admin}
                    className="text-body dark:text-bodydark"
                  >
                    Admin
                  </option>
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
            <div className="w-1/2 self-end">
              <div className="mb-3 flex gap-2 align-middle">
                <SwitcherThree
                  enabled={formik.values.is_active}
                  onChange={(value) => formik.setFieldValue("is_active", value)}
                />
                <label className="block self-end text-sm font-medium text-black dark:text-white">
                  Is user active?
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!formik.isValid}
            className={`flex w-full justify-center rounded ${formik.isValid ? "cursor-pointer bg-primary" : "cursor-not-allowed bg-secondary"} p-3 font-medium text-gray hover:bg-opacity-90`}
          >
            {formik.isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddUserModal;
