"use client";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect } from "react";
import success from "../../../assets/success.jpg";
import error from "../../../assets/error.jpg";
import { X } from "lucide-react";

type PopupAlertProps = {
  type?: "success" | "error";
  message?: string;
  onClose: () => void;
};

const PopupAlert: React.FC<PopupAlertProps> = ({
  type = "success",
  message,
  onClose,
}) => {
  const isSuccess = type === "success";

  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={message}
        initial={{ opacity: 0, x: 80, y: 20, scale: 0.95 }}
        animate={{
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 160,
            damping: 18,
            mass: 0.8,
          },
        }}
        exit={{
          opacity: 0,
          x: 80,
          y: 10,
          scale: 0.96,
          transition: {
            duration: 0.25,
            ease: [0.4, 0, 0.2, 1],
          },
        }}
        whileHover={{ scale: 1.02 }}
        className={`fixed bottom-6 right-6 z-[9999] w-[300px] bg-white rounded-xl shadow-xl border border-gray-200 p-5 backdrop-blur-md ${
          isSuccess
            ? "border-l-4 border-orange-500"
            : "border-l-4 border-red-500"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-black transition"
        >
          <X size={16} />
        </button>

        <div className="flex gap-3 items-start">
          <motion.img
            src={isSuccess ? success : error}
            alt="status"
            className="w-9 h-9 object-cover rounded-full border shadow"
            initial={{ scale: 0.6, rotate: -15, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{
              delay: 0.1,
              type: "spring",
              stiffness: 220,
              damping: 15,
            }}
          />

          <div className="flex-1">
            <h4 className="text-md font-semibold text-gray-900">
              {isSuccess ? "Success" : "Error"}
            </h4>

            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
              {message ||
                (isSuccess
                  ? "Operation completed successfully."
                  : "Something went wrong. Please try again.")}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(PopupAlert);
