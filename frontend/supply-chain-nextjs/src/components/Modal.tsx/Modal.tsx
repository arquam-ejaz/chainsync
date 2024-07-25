import Link from "next/link";
import { FC } from "react";
import Button from "@/components/Button/Button";

export interface ModalProps {
  heading: string;
  isOpen: boolean;
  onClose: () => void;
  children: JSX.Element;
}

const Modal: FC<ModalProps> = ({ heading, onClose, isOpen, children }) => {
  return (
    <div
      className={
        "place-items-cente fixed left-0 top-0 z-[10000] grid h-screen w-screen content-center" +
        (isOpen ? "" : "hidden")
      }
    >
      <div className="fixed h-full w-full bg-black opacity-30"></div>
      <div className="z-[10001] ml-auto mr-auto h-min w-[50%] min-w-100 max-w-[50%] rounded-md">
        <div className="rounded-md border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between border-b border-stroke px-7 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              {heading}
            </h3>
            <div>
              <Button onClick={onClose} size={"small"} variant="danger">
                Close
              </Button>
            </div>
          </div>

          <div className="p-4 md:p-6 xl:p-9">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
