export type MedicineEditModalProps = {
  isVisible: boolean;
  onClose: () => void;
  medicine: {
    id: string;
    name: string;
    dosage: string;
    periodStart?: string;
    periodEnd?: string;
    periodLabel?: string;
    times?: string[];
    note?: string;
  } | null;
};

