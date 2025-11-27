import { ModalBase } from "@/components/ui/ModalBase";
import type { MedicineEditConfirmModalProps } from "./MedicineEditConfirmModal.types";

export function MedicineEditConfirmModal({
  isVisible,
  onClose,
  onConfirm,
}: MedicineEditConfirmModalProps) {
  return (
    <ModalBase
      button={[
        {
          label: "Sim, quero editar",
          onPress: () => {
            onConfirm();
            onClose();
          },
          variant: "primary",
        },
        {
          label: "Cancelar",
          onPress: onClose,
          variant: "outline",
        },
      ]}
      description="Após confirmar, a medicação será alterada para sempre, sem chances de voltar atrás."
      isVisible={isVisible}
      onClose={onClose}
      title="Confirmar alterações?"
    />
  );
}
