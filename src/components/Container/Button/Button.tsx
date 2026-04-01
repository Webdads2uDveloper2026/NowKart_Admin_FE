import { motion } from "framer-motion";
import React from "react";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
};

const Button = ({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  className = "",
  icon,
  iconPosition = "left",
}: Props) => {
  const baseStyle =
    "inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg font-medium text-sm transition focus:outline-none";

  const variants = {
    primary: "bg-orange-600 text-white hover:bg-orange-700",
    secondary: "border border-gray-300 text-gray-600 hover:bg-gray-100",
    outline:
      "border border-orange-600 text-orange-600 bg-transparent hover:bg-orange-50",
  };

  return (
    <motion.button
      whileHover={
        !disabled
          ? {
              y: -2,
              scale: 1.02,
              boxShadow: "0px 8px 20px rgba(0,0,0,0.12)",
            }
          : {}
      }
      whileTap={!disabled ? { scale: 0.96 } : {}}
      transition={{
        type: "spring",
        stiffness: 250,
        damping: 15,
      }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      {icon && iconPosition === "left" && icon}

      {children}

      {icon && iconPosition === "right" && icon}
    </motion.button>
  );
};

export default Button;
