import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
};

const modalVariants: Variants = {
  hidden: { y: "-100vh", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 15,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="bg-white rounded-xl w-full max-w-sm p-6 space-y-5 text-center"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <p className="text-md font-semibold">{title || "Are you sure?"}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={onConfirm}
                className="bg-orange-600 text-white cursor-pointer px-4 py-2 rounded-md hover:bg-orange-700"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 cursor-pointer rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDeleteModal;
