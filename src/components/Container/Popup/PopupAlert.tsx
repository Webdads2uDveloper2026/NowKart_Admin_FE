import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import React from "react";
import success from "../../../assets/success.jpg";
import error from "../../../assets/error.jpg";

type PopupAlertProps = {
  type?: "success" | "error";
  message?: string;
  onClose: () => void;
  onAction?: () => void;
};

const PopupAlert: React.FC<PopupAlertProps> = ({
  type = "success",
  message,
  onClose,
  onAction,
}) => {
  const isSuccess = type === "success";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-black/40 z-9999"
      >
        <motion.div
          initial={{ scale: 0.7, y: 80 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.7, y: 80 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className={`w-[340px] rounded-2xl overflow-hidden bg-[#f4f4f4] relative 
shadow-[0_10px_30px_rgba(0,0,0,0.2)] 
${isSuccess ? "shadow-green-200/40" : "shadow-red-200/40"}`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-3 z-20 border-2 rounded-full cursor-pointer"
          >
            <X size={18} />
          </button>
          <div className="relative h-[171px] flex items-center justify-center">
            <div
              className={`absolute inset-0 ${
                isSuccess ? "bg-green-500" : "bg-orange-500"
              }`}
              style={{ borderBottomRightRadius: "180px" }}
            />
            <div
              className="absolute inset-0 bg-white/20"
              style={{ borderBottomRightRadius: "190px" }}
            />
            <div className="relative z-10">
              <img
                src={isSuccess ? success : error}
                alt="status"
                className="w-20 h-20 object-contain rounded-full border-2 border-white bg-white p-1"
              />
            </div>
          </div>
          <div className="px-6 py-6 text-center bg-[#f4f4f4]">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              {isSuccess ? "Success!" : "Error!"}
            </h2>
            <p className="text-xs font-medium mb-5 leading-5">
              {message ||
                (isSuccess
                  ? "Welcome to our platform. Login has been successful."
                  : "Something went wrong while signing up.")}
            </p>
            <button
              onClick={onAction || onClose}
              className={`w-full py-2 rounded-md text-white text-sm font-semibold cursor-pointer ${
                isSuccess ? "bg-green-500" : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {isSuccess ? "Continue" : "Try again"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PopupAlert;
