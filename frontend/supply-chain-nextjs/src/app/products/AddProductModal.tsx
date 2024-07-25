import Modal from "@/components/Modal.tsx/Modal";
import { useFormik } from "formik";
import { useSessionContext } from "@/providers/ContextProvider";
import * as Yup from "yup";
import { toast, Icons } from "react-toastify";
import { FC, useState } from "react";
import { productTypes } from "@/config/constant";
import { uuid } from "uuidv4";

interface AddProductInput {
  id: string;
  name: string;
  desc: string;
  type: string;
}

interface AddSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddProductModal: FC<AddSiteModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { session } = useSessionContext();
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  const initialValues: AddProductInput = {
    id: uuid(),
    name: "",
    desc: "",
    type: productTypes[0],
  };

  const formik = useFormik<AddProductInput>({
    initialValues,
    validationSchema: Yup.object().shape({
      id: Yup.string().uuid().required(),
      name: Yup.string().required(),
      desc: Yup.string().required(),
      type: Yup.string().oneOf(productTypes).required(),
    }),
    validateOnMount: true,
    onSubmit: async (values) => {
      const tId = toast.loading("Submitting...");
      if (!session) return;
      try {
        await session.call({
          name: "add_product",
          args: [session.account.id, ...Object.values(values)],
        });
        toast.update(tId, {
          render: "Product added successfully!",
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
          render: "Error adding product! Please try again.",
          type: "error",
        });
        setTimeout(() => {
          toast.dismiss(tId);
        }, 1000);
      }
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} heading="Add product details">
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
                placeholder="Product name"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Product type
              </label>
              <div className="relative z-20 bg-white dark:bg-form-input">
                <select
                  value={formik.values.type}
                  onChange={(e) => {
                    formik.setFieldValue("type", e.target.value);
                    changeTextColor();
                  }}
                  name="type"
                  className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${
                    isOptionSelected ? "text-black dark:text-white" : ""
                  }`}
                >
                  {productTypes.map((type, index) => (
                    <option
                      value={type}
                      className="text-body dark:text-bodydark"
                      key={index}
                    >
                      {type}
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
              Product description
            </label>
            <textarea
              name="desc"
              rows={4}
              onChange={formik.handleChange}
              value={formik.values.desc}
              placeholder="Enter a short product description"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            ></textarea>
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

export default AddProductModal;
