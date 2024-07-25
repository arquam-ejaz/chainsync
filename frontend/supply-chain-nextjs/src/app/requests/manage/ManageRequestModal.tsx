import Modal from "@/components/Modal.tsx/Modal";
import { useFormik } from "formik";
import SwitcherThree from "@/components/Switchers/SwitcherThree";
import { useSessionContext } from "@/providers/ContextProvider";
import * as Yup from "yup";
import { toast, Icons } from "react-toastify";
import { FC } from "react";

interface ManageRequestInputs {
  approved: boolean;
  msg: string;
}

type ManageRequestModalProps = {
  isOpen: boolean;
  onSuccess?: () => void;
  onClose: () => void;
  request_id: string;
};

const ManageRequestModal: FC<ManageRequestModalProps> = ({
  isOpen,
  onSuccess,
  onClose,
  request_id,
}) => {
  const { session } = useSessionContext();

  const initialValues: ManageRequestInputs = {
    approved: true,
    msg: "",
  };

  const formik = useFormik<ManageRequestInputs>({
    initialValues,
    validationSchema: Yup.object().shape({
      approved: Yup.boolean().required(),
      msg: Yup.string().required(),
    }),
    validateOnMount: true,
    onSubmit: async (values: ManageRequestInputs) => {
      const tId = toast.loading("Submitting...");
      if (!session) return;
      try {
        await session.call({
          name: "approve_deny_request",
          args: [session.account.id, request_id, ...Object.values(values)],
        });
        toast.update(tId, {
          render: `Request ${values.approved ? "approved" : "denied"}!`,
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
          render: "Error handling request! Please try again.",
          type: "error",
        });
        setTimeout(() => {
          toast.dismiss(tId);
        }, 1000);
      }
    },
  });

  return (
    <Modal onClose={onClose} isOpen={isOpen} heading="Manage request">
      {/* <!-- Contact Form --> */}
      <form action="#" onSubmit={formik.handleSubmit}>
        <div>
          <div className="mb-6 flex gap-2 align-middle">
            <SwitcherThree
              enabled={formik.values.approved}
              onChange={(value) => formik.setFieldValue("approved", value)}
            />
            <label className="block self-end text-sm font-medium text-black dark:text-white">
              {formik.values.approved ? "Approved" : "Denied"}
            </label>
          </div>

          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Message
            </label>
            <textarea
              name="msg"
              rows={4}
              onChange={formik.handleChange}
              value={formik.values.msg}
              placeholder="Enter a short message"
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

export default ManageRequestModal;
