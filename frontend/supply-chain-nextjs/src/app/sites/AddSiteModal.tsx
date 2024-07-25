import Modal, { ModalProps } from "@/components/Modal.tsx/Modal";
import { useFormik } from "formik";
import SwitcherThree from "@/components/Switchers/SwitcherThree";
import { uuid } from "uuidv4";
import { useSessionContext } from "@/providers/ContextProvider";
import * as Yup from "yup";
import { toast, Icons } from "react-toastify";
import { FC } from "react";

interface ISite {
  id: string;
  name: string;
  address_desc: string;
  is_warehouse: boolean;
}

type AddSiteModalProps = Omit<ModalProps, "children" | "heading"> & {
  onSuccess?: () => void;
};

const AddSiteModal: FC<AddSiteModalProps> = (props) => {
  const { session } = useSessionContext();

  const initialValues: ISite = {
    id: uuid(),
    name: "",
    address_desc: "",
    is_warehouse: false,
  };

  const formik = useFormik<ISite>({
    initialValues,
    validationSchema: Yup.object().shape({
      id: Yup.string().uuid().required(),
      name: Yup.string()
        .min(2, "Too Short!")
        .max(50, "Too Long!")
        .required("Required"),
      address_desc: Yup.string().required("Required"),
      is_warehouse: Yup.boolean().required(),
    }),
    validateOnMount: true,
    onSubmit: async (values: ISite) => {
      const tId = toast.loading("Submitting...");
      if (!session) return;
      try {
        await session.call({
          name: "add_site",
          args: [session.account.id, ...Object.values(values)],
        });
        toast.update(tId, {
          render: "Site added successfully!",
          type: "success",
          icon: Icons.success,
        });
        setTimeout(() => {
          toast.dismiss(tId);
          if (props.onSuccess) props.onSuccess();
          props.onClose();
        }, 1000);
      } catch (error) {
        toast.update(tId, {
          render: "Error adding site! Please try again.",
          type: "error",
        });
        setTimeout(() => {
          toast.dismiss(tId);
        }, 1000);
      }
    },
  });

  return (
    <Modal {...props} heading="Add site details">
      {/* <!-- Contact Form --> */}
      <form action="#" onSubmit={formik.handleSubmit}>
        <div>
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-full">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Name
              </label>
              <input
                value={formik.values.name}
                onChange={formik.handleChange}
                type="text"
                name="name"
                placeholder="Enter site name"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Address description
            </label>
            <textarea
              name="address_desc"
              rows={4}
              onChange={formik.handleChange}
              value={formik.values.address_desc}
              placeholder="Enter the site address"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            ></textarea>
          </div>

          <div className="mb-6 flex gap-2 align-middle">
            <SwitcherThree
              enabled={formik.values.is_warehouse}
              onChange={(value) => formik.setFieldValue("is_warehouse", value)}
            />
            <label className="block self-end text-sm font-medium text-black dark:text-white">
              Is site a warehouse?
            </label>
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

export default AddSiteModal;
