import Modal from "@/components/Modal.tsx/Modal";
import { useFormik } from "formik";
import { useSessionContext } from "@/providers/ContextProvider";
import * as Yup from "yup";
import { toast, Icons } from "react-toastify";
import { FC, useState } from "react";
import { SiteDto } from "../sites/Sites";
import { ProductDto } from "../products/Products";

interface AssignProductInput {
  product_id: string;
  quantity: number;
}

interface AssignProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  selectedSite: SiteDto;
  products: ProductDto[];
}

const AssignProductModal: FC<AssignProductModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  selectedSite,
  products,
}) => {
  const { session } = useSessionContext();
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  const initialValues: AssignProductInput = {
    product_id: "",
    quantity: 0,
  };

  const formik = useFormik<AssignProductInput>({
    initialValues,
    validationSchema: Yup.object().shape({
      product_id: Yup.string().uuid().required(),
      quantity: Yup.number().positive().integer().required(),
    }),
    validateOnMount: true,
    onSubmit: async (values) => {
      const tId = toast.loading("Submitting...");
      if (!session) return;
      try {
        await session.call({
          name: "add_inventory",
          args: [session.account.id, selectedSite.id, ...Object.values(values)],
        });
        toast.update(tId, {
          render: "Product assigned successfully!",
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
          render: "Error assigning product! Please try again.",
          type: "error",
        });
        setTimeout(() => {
          toast.dismiss(tId);
        }, 1000);
      }
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      heading={`Assign product to site: ${selectedSite.name}`}
    >
      <form action="#" onSubmit={formik.handleSubmit}>
        <div>
          <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <div className="w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Product
              </label>
              <div className="relative z-20 bg-white dark:bg-form-input">
                <select
                  value={formik.values.product_id}
                  onChange={(e) => {
                    formik.setFieldValue("product_id", e.target.value);
                    changeTextColor();
                  }}
                  name="product_id"
                  className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 pl-4 pr-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${
                    isOptionSelected ? "text-black dark:text-white" : ""
                  }`}
                >
                  <option
                    value={""}
                    className="text-body dark:text-bodydark"
                    selected
                    disabled
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
            <div className="w-1/2">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Quantiy
              </label>
              <input
                value={formik.values.quantity + ""}
                onChange={formik.handleChange}
                type="number"
                name="quantity"
                placeholder="Product quantity"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
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

export default AssignProductModal;
