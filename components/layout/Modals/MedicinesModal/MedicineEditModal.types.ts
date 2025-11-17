import type { MedicineDtoResponse } from "@/services/@types/medicine";

export type MedicineEditModalProps = {
  isVisible: boolean;
  onClose: () => void;
  medicine: MedicineDtoResponse | null;
};
