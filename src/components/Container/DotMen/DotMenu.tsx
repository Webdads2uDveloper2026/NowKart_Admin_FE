import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

type DotMenuProps = {
  onEdit?: () => void;
  onDelete?: () => void;
};

const DotMenu: React.FC<DotMenuProps> = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const toggleMenu = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuWidth = 130;
      const screenWidth = window.innerWidth;
      let left = rect.left + window.scrollX - menuWidth / 2 + rect.width / 2;
      let top = rect.bottom + window.scrollY + 6;
      if (left < 8) left = 8;
      if (left + menuWidth > screenWidth) left = screenWidth - menuWidth - 8;
      setPosition({ top, left });
    }
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        !buttonRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="p-2 rounded-full hover:bg-gray-100 focus:outline-none cursor-pointer"
      >
        &#x22EE;
      </button>

      {isOpen &&
        createPortal(
          <AnimatePresence>
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute w-32 bg-white border border-gray-200 rounded-md shadow-lg z-9999"
              style={{
                top: position.top,
                left: position.left,
              }}
            >
              <div className="py-1">
                {onEdit && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onEdit();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Update
                  </button>
                )}

                {onDelete && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onDelete();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Delete
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
};

export default DotMenu;
