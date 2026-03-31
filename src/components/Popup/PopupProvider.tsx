import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import PopupAlert from "./PopupAlert";

type PopupType = "success" | "error";

type PopupState = {
  show: boolean;
  type: PopupType;
  message: string;
};

type PopupContextType = {
  showPopup: (type: PopupType, message: string) => void;
};

const PopupContext = createContext<PopupContextType | null>(null);

type PopupProviderProps = {
  children: ReactNode;
};

export const PopupProvider = ({ children }: PopupProviderProps) => {
  const [popup, setPopup] = useState<PopupState>({
    show: false,
    type: "success",
    message: "",
  });

  const showPopup = (type: PopupType, message: string) => {
    setPopup({
      show: true,
      type,
      message,
    });
  };

  const closePopup = () => {
    setPopup((prev) => ({
      ...prev,
      show: false,
    }));
  };

  return (
    <PopupContext.Provider value={{ showPopup }}>
      {children}

      {popup.show && (
        <PopupAlert
          type={popup.type}
          message={popup.message}
          onClose={closePopup}
        />
      )}
    </PopupContext.Provider>
  );
};

export const usePopup = (): PopupContextType => {
  const context = useContext(PopupContext);

  if (!context) {
    throw new Error("usePopup must be used within PopupProvider");
  }

  return context;
};
