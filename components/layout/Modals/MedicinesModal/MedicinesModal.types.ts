export type MedicinesModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onMedicinesChanged?: () => void; // Callback quando medicações são deletadas/editadas
};
