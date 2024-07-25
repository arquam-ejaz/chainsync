import Modal from "@/components/Modal.tsx/Modal";
import { useFormik } from "formik";
import { useSessionContext } from "@/providers/ContextProvider";
import * as Yup from "yup";
import { toast, Icons } from "react-toastify";
import { FC } from "react";

interface UpdateUserInput {
  name: string;
}

interface UpdateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  current_name: string;
}

const UpdateUserModal: FC<UpdateUserModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  current_name,
}) => {
  const { session } = useSessionContext();

  const initialValues: UpdateUserInput = {
    name: current_name,
  };

  const formik = useFormik<UpdateUserInput>({
    initialValues,
    validationSchema: Yup.object().shape({
      name: Yup.string().min(3).notOneOf([current_name]).required("Required"),
    }),
    validateOnMount: true,
    onSubmit: async (values) => {
      const tId = toast.loading("Submitting...");
      if (!session) return;
      try {
        await session.call({
          name: "update_username",
          args: [session.account.id, values.name],
        });
        toast.update(tId, {
          render: "User name added successfully!",
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
          render: "Error updating user name! Please try again.",
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
            <div className="w-full">
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

export default UpdateUserModal;
