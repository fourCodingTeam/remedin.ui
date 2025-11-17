import { Archive, Edit, Plus, Trash2 } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { Button, StyledText } from "@/components/ui";
import { DetailedMedicineCheckboxCard } from "@/components/ui/Common/CheckboxCard";
import { useToast } from "@/components/ui/Toast";
import { dosageUnitLabels } from "@/services/@types/enums";
import type { MedicineDtoResponse } from "@/services/@types/medicine";
import { getAllMedicines } from "@/services/api/medicine";
import { getAllSchedules } from "@/services/api/schedule";
import { getAuthToken } from "@/services/utils/getAuthToken";
import { formatDateOnlyToDisplay } from "@/utils/DateFormatters/dateOnly";
import { formatTimeOnlyToDisplay } from "@/utils/DateFormatters/timeOnly";
import { ModalPageWrapper } from "../../Common/ModalPageWrapper";
import {
  ButtonsWrapper,
  FormContentWrapper,
  ScrollableContentWrapper,
} from "../../styles";
import { MedicineFormModal } from "../MedicineFormModal/MedicineFormModal";
import { MedicineDeleteModal } from "./MedicineDeleteModal";
import { MedicineEditModal } from "./MedicineEditModal";
import type { MedicinesModalProps } from "./MedicinesModal.types";

type MedicineWithSchedules = MedicineDtoResponse & {
  scheduleTimes: string[];
};

function getSchedulesFromResponse(
  schedulesResponse: Awaited<ReturnType<typeof getAllSchedules>>
) {
  if (schedulesResponse.success && schedulesResponse.data) {
    return schedulesResponse.data.items;
  }
  return [];
}

function mapSchedulesToMedicines(
  medicines: MedicineDtoResponse[],
  schedulesResponse: Awaited<ReturnType<typeof getAllSchedules>>
): MedicineWithSchedules[] {
  const scheduleItems = getSchedulesFromResponse(schedulesResponse);

  return medicines.map((medicine) => {
    const medicineSchedules = scheduleItems.filter(
      (schedule) => schedule.medicineId === medicine.id
    );
    const scheduleTimes = medicineSchedules.map((schedule) =>
      formatTimeOnlyToDisplay(schedule.scheduledTime)
    );

    return {
      ...medicine,
      scheduleTimes,
    };
  });
}

export function MedicinesModal({ isVisible, onClose }: MedicinesModalProps) {
  const [medicines, setMedicines] = useState<MedicineWithSchedules[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMedicines, setSelectedMedicines] = useState<Set<string>>(
    new Set()
  );
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isMedicineFormModalVisible, setIsMedicineFormModalVisible] =
    useState(false);
  const [editingMedicine, setEditingMedicine] =
    useState<MedicineDtoResponse | null>(null);
  const { showToast } = useToast();

  const loadMedicines = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await getAuthToken();
      if (!token) {
        showToast(
          "Você precisa estar autenticado para ver as medicações",
          "error"
        );
        return;
      }

      const [medicinesResponse, schedulesResponse] = await Promise.all([
        getAllMedicines(token, 1, 100),
        getAllSchedules(token, 1, 1000),
      ]);

      if (!medicinesResponse.success) {
        showToast(
          medicinesResponse.message || "Erro ao carregar medicações",
          "error"
        );
        return;
      }

      if (!medicinesResponse.data) {
        showToast("Nenhuma medicação encontrada", "info");
        return;
      }

      const medicinesWithSchedules = mapSchedulesToMedicines(
        medicinesResponse.data.items,
        schedulesResponse
      );

      setMedicines(medicinesWithSchedules);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao carregar medicações";
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (isVisible) {
      loadMedicines();
    }
  }, [isVisible, loadMedicines]);

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
    const medicine = medicines.find((m) => m.id === selectedId);
    if (medicine) {
      setEditingMedicine(medicine);
      setIsEditModalVisible(true);
    }
  };

  const handleAddMedicine = () => {
    setIsMedicineFormModalVisible(true);
  };

  const handleFormModalClose = () => {
    setIsMedicineFormModalVisible(false);
    loadMedicines();
  };

  const handleDeleteConfirm = () => {
    // TODO: Implement delete functionality when backend endpoint is available
    setIsDeleteModalVisible(false);
    setSelectedMedicines(new Set());
    showToast("Funcionalidade de deletar em desenvolvimento", "info");
  };

  const handleEditClose = () => {
    setIsEditModalVisible(false);
    setEditingMedicine(null);
    loadMedicines();
  };

  const renderMedicinesList = () => {
    if (isLoading) {
      return (
        <StyledText
          color="muted"
          style={{ textAlign: "center", marginTop: 16 }}
          variant="mediumRegular"
        >
          Carregando medicações...
        </StyledText>
      );
    }

    if (medicines.length === 0) {
      return (
        <StyledText
          color="muted"
          style={{ textAlign: "center", marginTop: 16 }}
          variant="mediumRegular"
        >
          Nenhuma medicação cadastrada.
        </StyledText>
      );
    }

    return medicines.map((medicine) => {
      const dosageLabel = dosageUnitLabels[medicine.dosageUnit];
      const dosageDisplay = `${medicine.dosageValue} ${dosageLabel}`;
      const hasEndDate = medicine.endDate !== null;

      return (
        <DetailedMedicineCheckboxCard
          checked={selectedMedicines.has(medicine.id)}
          instructions={medicine.observations || undefined}
          key={medicine.id}
          onChange={(_, checked) => handleToggleMedicine(medicine.id, checked)}
          periodLabel={hasEndDate ? undefined : "Uso contínuo"}
          periodRange={
            hasEndDate
              ? {
                  start: formatDateOnlyToDisplay(medicine.startDate),
                  end: formatDateOnlyToDisplay(medicine.endDate),
                }
              : {
                  start: formatDateOnlyToDisplay(medicine.startDate),
                }
          }
          scheduleTimes={
            medicine.scheduleTimes.length > 0
              ? medicine.scheduleTimes
              : undefined
          }
          style={{ marginTop: 8 }}
          title={`${medicine.name} - ${dosageDisplay}`}
          value={medicine.id}
        />
      );
    });
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
            {renderMedicinesList()}
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
        onConfirm={handleDeleteConfirm}
      />

      <MedicineEditModal
        isVisible={isEditModalVisible}
        medicine={editingMedicine}
        onClose={handleEditClose}
      />

      <MedicineFormModal
        isVisible={isMedicineFormModalVisible}
        onClose={handleFormModalClose}
      />
    </>
  );
}
