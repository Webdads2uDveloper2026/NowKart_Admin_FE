import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  className?: string;
};

const Button = ({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  className = "",
}: Props) => {
  const baseStyle =
    "px-5 py-2 rounded-lg font-medium transition focus:outline-none cursor-pointer";

  const variants = {
    primary: "bg-orange-600 text-white hover:bg-orange-700",
    secondary: "border text-gray-600 hover:bg-gray-100",
  };

  return (
    <motion.button
      whileHover={
        !disabled
          ? {
              y: -2,
              scale: 1.01,
              boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
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
      {children}
    </motion.button>
  );
};

export default Button;
