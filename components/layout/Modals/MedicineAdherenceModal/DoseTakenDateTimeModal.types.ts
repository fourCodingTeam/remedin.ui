export type DoseTakenDateTimeModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  scheduledAt?: string | null; // ISO string
};

