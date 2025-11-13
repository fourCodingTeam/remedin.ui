import { ModalBase } from "@/components/ui/ModalBase";
import type { MedicineDeleteModalProps } from "./MedicineDeleteModal.types";

export function MedicineDeleteModal({
  isVisible,
  onClose,
  onConfirm,
}: MedicineDeleteModalProps) {
  return (
    <ModalBase
      button={[
        {
          label: "Sim, quero deletar",
          onPress: () => {
            onConfirm();
            onClose();
          },
          variant: "danger",
        },
        {
          label: "Cancelar",
          onPress: onClose,
          variant: "outline",
        },
      ]}
      description="Após confirmar, a medicação será deletada para sempre, sem chances de voltar atrás."
      isVisible={isVisible}
      onClose={onClose}
      title="Tem certeza, quer deletar?"
    />
  );
}

