import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useState } from "react";
import { Toast } from "./Toast";
import type { ToastData, ToastType } from "./Toast.types";
import { ToastProviderContainer } from "./ToastProvider.styles";

let toastIdCounter = 0;

type ToastContextType = {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = useCallback(
    (message: string, type: ToastType = "success", duration?: number) => {
      toastIdCounter += 1;
      const id = `toast-${toastIdCounter}`;
      const newToast: ToastData = { id, message, type, duration };
      // Replace existing toast instead of adding to array
      setToast(newToast);
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastProviderContainer>
        {toast && (
          <Toast
            index={0}
            key={toast.id}
            totalToasts={1}
            {...toast}
            onClose={hideToast}
          />
        )}
      </ToastProviderContainer>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};
