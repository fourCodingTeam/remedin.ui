import { CheckCircle2, Clock, Pill, XCircle } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import Modal from "react-native-modal";
import { Button, StyledText } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { theme } from "@/constants/theme";
import { useMemberContext } from "@/hooks";
import {
  type DoseOccurrenceDto,
  getDoseOccurrenceByMedicineScheduleAndDate,
  markDoseSkipped,
  markDoseTaken,
  snoozeDose,
} from "@/services/api/medicineAdherence";
import { getAuthToken } from "@/services/utils/getAuthToken";
import {
  ButtonsContainer,
  ContentArea,
  FloatingModalContent,
  ModalHeader,
  ModalHeaderTitle,
  StatusWrapper,
} from "./MedicineAdherenceModal.styles";
import type { MedicineAdherenceModalProps } from "./MedicineAdherenceModal.types";

function isValidDateObject(dateObj: Date | undefined | null): boolean {
  if (!dateObj) {
    return false;
  }
  if (!(dateObj instanceof Date)) {
    return false;
  }
  const time = dateObj.getTime();
  if (Number.isNaN(time)) {
    return false;
  }
  if (!Number.isFinite(time)) {
    return false;
  }
  return time > 0;
}

export function MedicineAdherenceModal({
  isVisible,
  onClose,
  medicineId,
  scheduleId,
  date,
}: MedicineAdherenceModalProps) {
  const { memberId } = useMemberContext();
  const [doseOccurrence, setDoseOccurrence] =
    useState<DoseOccurrenceDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const { showToast } = useToast();

  const fetchDoseData = useCallback(
    async (token: string, medId: string, schedId: string, dateObj: Date, retryCount = 0) => {
      const response = await getDoseOccurrenceByMedicineScheduleAndDate(
        medId,
        schedId,
        dateObj,
        token,
        memberId || undefined
      );

      if (response.success) {
        // If dose was found, set it
        if (response.data) {
          setDoseOccurrence(response.data);
          return;
        }
        
        // If dose not found and it's the first attempt, retry once after a short delay
        // The backend creates doses automatically, so we give it a moment
        if (!response.data && retryCount === 0) {
          setTimeout(async () => {
            await fetchDoseData(token, medId, schedId, dateObj, 1);
          }, 800);
          return;
        }
        
        // After retry, if still not found, set to null
        setDoseOccurrence(null);
      } else {
        const errorMessage =
          response.message || "Erro ao carregar informações da dose";
        // Only show error toast if it's not a "not found" message or if it's the retry
        if (retryCount > 0 || (!errorMessage.toLowerCase().includes("não encontrada") && !errorMessage.toLowerCase().includes("not found"))) {
          showToast(errorMessage, "error");
        }
        setDoseOccurrence(null);
      }
    },
    [showToast, memberId]
  );

  const normalizeAndValidateDate = useCallback((): Date | null => {
    if (!date) {
      return null;
    }

    // Ensure date is a Date object
    let dateObj: Date;
    if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === "string") {
      dateObj = new Date(date);
    } else {
      return null;
    }

    const isDateValid = isValidDateObject(dateObj);
    if (!isDateValid) {
      return null;
    }

    // Normalize date to start of day (midnight) to avoid timezone issues
    const normalized = new Date(dateObj);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  }, [date]);

  const validateAndLoadDose = useCallback(async () => {
    const hasRequiredIds = Boolean(medicineId && scheduleId);
    if (!hasRequiredIds) {
      return;
    }

    const dateObj = normalizeAndValidateDate();
    if (!dateObj) {
      showToast("Data inválida", "error");
      return;
    }

    setIsLoading(true);
    try {
      const token = await getAuthToken();
      if (!token) {
        showToast("Você precisa estar autenticado", "error");
        return;
      }

      await fetchDoseData(token, medicineId, scheduleId, dateObj);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao carregar dose";
      showToast(errorMessage, "error");
      setDoseOccurrence(null);
    } finally {
      setIsLoading(false);
    }
  }, [
    medicineId,
    scheduleId,
    normalizeAndValidateDate,
    showToast,
    fetchDoseData,
  ]);

  const handleMarkTaken = async () => {
    if (!doseOccurrence) {
      showToast("Dose não encontrada", "error");
      return;
    }

    setIsActionLoading(true);
    try {
      const token = await getAuthToken();
      if (!token) {
        showToast("Você precisa estar autenticado", "error");
        setIsActionLoading(false);
        return;
      }

      // Create ISO string for current time
      const takenAt = new Date().toISOString();

      const response = await markDoseTaken(
        doseOccurrence.id,
        {
          takenAt,
        },
        token,
        memberId || undefined
      );

      if (response.success) {
        showToast("Dose marcada como tomada!", "success");
        // Reload dose data to update status
        const dateObj = normalizeAndValidateDate();
        if (dateObj) {
          await fetchDoseData(token, medicineId, scheduleId, dateObj);
        }
        onClose();
      } else {
        const errorMsg = response.message || "Erro ao marcar dose como tomada";
        showToast(errorMsg, "error");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao marcar dose como tomada";
      showToast(errorMessage, "error");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleMarkSkipped = async () => {
    if (!doseOccurrence) {
      return;
    }

    setIsActionLoading(true);
    try {
      const token = await getAuthToken();
      if (!token) {
        showToast("Você precisa estar autenticado", "error");
        return;
      }

      const response = await markDoseSkipped(
        doseOccurrence.id,
        {
          reason: null,
        },
        token,
        memberId || undefined
      );

      if (response.success) {
        showToast("Dose marcada como pulada!", "success");
        await validateAndLoadDose();
        onClose();
      } else {
        showToast(response.message || "Erro ao pular dose", "error");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao pular dose";
      showToast(errorMessage, "error");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSnooze = async (delayInMinutes: number) => {
    if (!doseOccurrence) {
      return;
    }

    setIsActionLoading(true);
    try {
      const token = await getAuthToken();
      if (!token) {
        showToast("Você precisa estar autenticado", "error");
        return;
      }

      const response = await snoozeDose(
        doseOccurrence.id,
        {
          delayInMinutes,
        },
        token,
        memberId || undefined
      );

      if (response.success) {
        showToast(`Dose adiada por ${delayInMinutes} minutos!`, "success");
        await validateAndLoadDose();
        onClose();
      } else {
        showToast(response.message || "Erro ao adiar dose", "error");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao adiar dose";
      showToast(errorMessage, "error");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isVisible) {
      setDoseOccurrence(null);
      setIsLoading(false);
      setIsActionLoading(false);
    }
  }, [isVisible]);

  // Load dose occurrence when modal opens
  useEffect(() => {
    if (!isVisible) {
      return;
    }

    if (!medicineId) {
      showToast("Informações da medicação incompletas", "error");
      return;
    }

    if (!scheduleId) {
      showToast("Informações da medicação incompletas", "error");
      return;
    }

    if (!date) {
      showToast("Data inválida", "error");
      return;
    }

    // Validate date before loading
    const dateObj = normalizeAndValidateDate();
    if (!dateObj) {
      showToast("Data inválida", "error");
      return;
    }

    validateAndLoadDose();
  }, [
    isVisible,
    medicineId,
    scheduleId,
    date,
    validateAndLoadDose,
    normalizeAndValidateDate,
    showToast,
  ]);

  const getStatusLabel = () => {
    if (!doseOccurrence) {
      return "Desconhecido";
    }
    if (doseOccurrence.status === "Taken") {
      return "Tomada";
    }
    if (doseOccurrence.status === "Skipped") {
      return "Pulada";
    }
    return "Pendente";
  };

  const isPending = doseOccurrence?.status === "Pending";

  return (
    <Modal
      animationIn="slideInUp"
      animationInTiming={300}
      animationOut="slideOutDown"
      animationOutTiming={300}
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={{ margin: 0, padding: 0, justifyContent: "flex-end" }}
      useNativeDriver={true}
    >
      <FloatingModalContent>
        <ModalHeader>
          <ModalHeaderTitle>
            <Pill color={theme.colors.text.default} size={20} />
            <StyledText variant="largeSemiBold">Ações da medicação</StyledText>
          </ModalHeaderTitle>
          <StyledText color="muted" variant="mediumRegular">
            Escolha uma ação para esta dose
          </StyledText>
        </ModalHeader>

        <ContentArea>
          {(() => {
            if (isLoading) {
              return (
                <StyledText
                  color="muted"
                  style={{ textAlign: "center" }}
                  variant="mediumRegular"
                >
                  Carregando...
                </StyledText>
              );
            }

            if (!doseOccurrence) {
              return (
                <StyledText
                  color="muted"
                  style={{ textAlign: "center" }}
                  variant="mediumRegular"
                >
                  Dose não encontrada para esta data
                </StyledText>
              );
            }

            return (
              <>
                <StatusWrapper>
                  <StyledText variant="mediumSemiBold">
                    Status: {getStatusLabel()}
                  </StyledText>
                </StatusWrapper>

                {isPending && (
                  <ButtonsContainer>
                    <Button
                      disabled={isActionLoading}
                      icon={CheckCircle2}
                      isLoading={isActionLoading}
                      label="Marcar como tomada"
                      onPress={handleMarkTaken}
                      variant="primary"
                    />
                    <Button
                      disabled={isActionLoading}
                      icon={XCircle}
                      isLoading={isActionLoading}
                      label="Pular dose"
                      onPress={handleMarkSkipped}
                      variant="danger"
                    />
                    <Button
                      disabled={isActionLoading}
                      icon={Clock}
                      isLoading={isActionLoading}
                      label="Adiar 15 minutos"
                      onPress={() => handleSnooze(15)}
                      variant="secondary"
                    />
                    <Button
                      disabled={isActionLoading}
                      icon={Clock}
                      isLoading={isActionLoading}
                      label="Adiar 30 minutos"
                      onPress={() => handleSnooze(30)}
                      variant="secondary"
                    />
                  </ButtonsContainer>
                )}
              </>
            );
          })()}
        </ContentArea>

        <ButtonsContainer style={{ marginTop: 8 }}>
          <Button
            disabled={isActionLoading}
            label="Fechar"
            onPress={onClose}
            variant="outline"
          />
        </ButtonsContainer>
      </FloatingModalContent>
    </Modal>
  );
}
