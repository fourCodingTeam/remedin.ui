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
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = "success", duration?: number) => {
      toastIdCounter += 1;
      const id = `toast-${toastIdCounter}`;
      const newToast: ToastData = { id, message, type, duration };
      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastProviderContainer>
        {toasts.map((toast, index) => (
          <Toast
            index={index}
            key={toast.id}
            totalToasts={toasts.length}
            {...toast}
            onClose={() => hideToast(toast.id)}
          />
        ))}
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
