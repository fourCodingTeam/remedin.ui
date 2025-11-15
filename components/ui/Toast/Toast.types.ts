export type ToastType = "success" | "error" | "info";

export type ToastData = {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
};

export type ToastProps = ToastData & {
  onClose: () => void;
  index?: number;
  totalToasts?: number;
};
