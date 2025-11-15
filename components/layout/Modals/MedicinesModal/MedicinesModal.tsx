import { Archive, Edit, Plus, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { Button } from "@/components/ui";
import { DetailedMedicineCheckboxCard } from "@/components/ui/Common/CheckboxCard";
import { ModalPageWrapper } from "../../Common/ModalPageWrapper";
import {
  ButtonsWrapper,
  FormContentWrapper,
  ScrollableContentWrapper,
} from "../../styles";
import { MedicineDeleteModal } from "./MedicineDeleteModal";
import { MedicineEditModal } from "./MedicineEditModal";
import type { MedicinesModalProps } from "./MedicinesModal.types";

// Mock data matching the image
const medicinesMock = [
  {
    id: "1",
    name: "Trenbolona",
    dosage: "1g",
    periodStart: "28/09/2025",
    periodEnd: "29/10/2025",
    times: ["23h00", "07h00", "15h00"],
    note: "Tomar depois do treino",
  },
  {
    id: "2",
    name: "Dipirona",
    dosage: "1g",
    periodLabel: "Uso contínuo",
    times: ["22h00", "06h00", "14h00"],
    note: "Tomar depois do treino",
  },
  {
    id: "23",
    name: "Dipirona",
    dosage: "1g",
    periodLabel: "Uso contínuo",
    times: ["22h00", "06h00", "14h00"],
    note: "Tomar depois do treino",
  },
];

export function MedicinesModal({ isVisible, onClose }: MedicinesModalProps) {
  const [selectedMedicines, setSelectedMedicines] = useState<Set<string>>(
    new Set()
  );
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<
    (typeof medicinesMock)[0] | null
  >(null);

  const handleToggleMedicine = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedMedicines);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedMedicines(newSelected);
  };

  const handleDelete = () => {
    setIsDeleteModalVisible(true);
  };

  const handleEdit = () => {
    const selectedId = Array.from(selectedMedicines)[0];
    const medicine = medicinesMock.find((m) => m.id === selectedId);
    if (medicine) {
      setEditingMedicine(medicine);
      setIsEditModalVisible(true);
    }
  };

  const handleAddMedicine = () => {
    // This would open the MedicineFormModal
    onClose();
  };

  return (
    <>
      <ModalPageWrapper
        header={{
          title: "Medicações",
          description: "Visualize e edite suas medicações cadastradas",
          icon: <Archive color="black" size={20} />,
        }}
        isVisible={isVisible}
        onClose={onClose}
      >
        <FormContentWrapper>
          <ScrollableContentWrapper>
            {medicinesMock.map((medicine) => (
              <DetailedMedicineCheckboxCard
                checked={selectedMedicines.has(medicine.id)}
                instructions={medicine.note}
                key={medicine.id}
                onChange={(_, checked) =>
                  handleToggleMedicine(medicine.id, checked)
                }
                periodLabel={medicine.periodLabel}
                periodRange={
                  medicine.periodStart && medicine.periodEnd
                    ? {
                        start: medicine.periodStart,
                        end: medicine.periodEnd,
                      }
                    : undefined
                }
                scheduleTimes={medicine.times}
                style={{ marginTop: 8 }}
                title={`${medicine.name} - ${medicine.dosage}`}
                value={medicine.id}
              />
            ))}
          </ScrollableContentWrapper>
        </FormContentWrapper>
        <ButtonsWrapper addPadding>
          <Button
            disabled={selectedMedicines.size === 0}
            icon={Trash2}
            label="Deletar"
            onPress={handleDelete}
            variant="danger"
          />
          <Button
            disabled={selectedMedicines.size !== 1}
            icon={Edit}
            label="Editar"
            onPress={handleEdit}
            variant="secondary"
          />
          <Button
            icon={Plus}
            label="Adicionar medicação"
            onPress={handleAddMedicine}
            variant="primary"
          />
          <Button label="Voltar" onPress={onClose} variant="outline" />
        </ButtonsWrapper>
      </ModalPageWrapper>

      <MedicineDeleteModal
        isVisible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={() => {
          setIsDeleteModalVisible(false);
          setSelectedMedicines(new Set());
        }}
      />

      <MedicineEditModal
        isVisible={isEditModalVisible}
        medicine={editingMedicine}
        onClose={() => {
          setIsEditModalVisible(false);
          setEditingMedicine(null);
        }}
      />
    </>
  );
}
