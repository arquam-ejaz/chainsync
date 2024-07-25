import Modal from "@/components/Modal.tsx/Modal";
import { useFormik } from "formik";
import { useSessionContext } from "@/providers/ContextProvider";
import * as Yup from "yup";
import { toast, Icons } from "react-toastify";
import { FC } from "react";
import { uuid } from "uuidv4";
import { InventoryDto } from "@/app/inventory/Inventory";

interface CreateRequestInput {
  id: string;
  quantity: number;
}

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  selectedInventory: InventoryDto;
}

const AssignProductModal: FC<CreateRequestModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  selectedInventory,
}) => {
  const { session, account } = useSessionContext();

  const initialValues: CreateRequestInput = {
    id: uuid(),
    quantity: 0,
  };

  const formik = useFormik<CreateRequestInput>({
    initialValues,
    validationSchema: Yup.object().shape({
      id: Yup.string().uuid().required(),
      quantity: Yup.number()
        .positive()
        .integer()
        .max(selectedInventory.quantity)
        .required(),
    }),
    validateOnMount: true,
    onSubmit: async (values) => {
      const tId = toast.loading("Submitting...");
      if (!session || !account) return;
      try {
        const [id, quantity] = Object.values(values);
        await session.call({
          name: "create_request",
          args: [
            session.account.id,
            id,
            selectedInventory.product.id,
            account.site.id,
            selectedInventory.site.id,
            quantity,
          ],
        });
        toast.update(tId, {
          render: "Request created successfully!",
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
          render: "Error creating request! Please try again.",
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
      heading={`Request to site ${selectedInventory.site.name} for product ${selectedInventory.product.name}`}
    >
      <form action="#" onSubmit={formik.handleSubmit}>
        <div>
          <div className="mb-3.5 flex flex-col gap-6 xl:flex-row">
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

          <div className="mb-4.5">
            <h3 className="font-medium">
              You can request upto {selectedInventory.quantity} units of the
              product
            </h3>
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
