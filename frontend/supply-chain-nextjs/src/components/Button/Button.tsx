"use client";

import Link from "next/link";
import { FC, MouseEventHandler } from "react";

interface ButtonProps {
  onClick: () => void;
  size?: "small" | "normal";
  children: JSX.Element | string;
  variant?: "primary" | "danger";
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({
  onClick,
  size,
  children,
  variant,
  disabled,
}) => {
  let additionalClasses: string[] = [];

  switch (size) {
    case "small": {
      additionalClasses.push("px-4 py-2");
      break;
    }
    default: {
      additionalClasses.push("px-10 py-4");
      break;
    }
  }

  switch (variant) {
    case "danger": {
      additionalClasses.push("bg-danger");
      break;
    }
    default: {
      additionalClasses.push("bg-primary");
      break;
    }
  }

  switch (disabled) {
    case true: {
      additionalClasses.push("cursor-not-allowed bg-secondary");
      break;
    }
  }

  const additionalClassString = additionalClasses.join(" ");

  return (
    <Link
      href="#"
      onClick={(ev) => {
        ev.preventDefault();
        if (disabled) return;
        if (onClick) onClick();
      }}
      className={`${additionalClassString} inline-flex items-center justify-center rounded-md text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10`}
    >
      {children}
    </Link>
  );
};

export default Button;
