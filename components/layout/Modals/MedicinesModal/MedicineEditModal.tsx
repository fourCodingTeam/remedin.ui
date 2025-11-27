import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  InputBase,
  InputDate,
  InputSelect,
  MultiSelectTag,
  StyledText,
} from "@/components/ui";
import { ModalBase } from "@/components/ui/ModalBase/ModalBase";
import { useToast } from "@/components/ui/Toast";
import { useMemberContext } from "@/hooks";
import {
  DosageUnit,
  MedicineScheduleType,
  type WeekDay,
  weekDayLabels,
} from "@/services/@types/enums";
import type { ScheduleDtoResponse } from "@/services/@types/schedule";
import { updateMedicine } from "@/services/api/medicine";
import { updateSchedule } from "@/services/api/schedule";
import { getAuthToken } from "@/services/utils/getAuthToken";
import {
  dateOnlyToDate,
  dateToDateOnly,
} from "@/utils/DateFormatters/dateOnly";
import { dateToTimeOnly } from "@/utils/DateFormatters/timeOnly";
import { getDosageUnitOptions } from "@/utils/medicine/dosageUnitMapper";
import { getMedicineScheduleTypeOptions } from "@/utils/schedule/medicineScheduleTypeMapper";
import {
  type MedicineWithScheduleUpdateFormData,
  medicineWithScheduleUpdateSchema,
} from "@/validators";
import { ModalPageWrapper } from "../../Common/ModalPageWrapper";
import {
  ButtonsWrapper,
  FormContentWrapper,
  InputsWrapper,
} from "../../styles";
import {
  SideBySideInputsWrapper,
  WeekDaysWrapper,
} from "../MedicineFormModal/MedicineFormModal.styles";
import type { MedicineEditModalProps } from "./MedicineEditModal.types";

export function MedicineEditModal({
  isVisible,
  onClose,
  medicine,
}: MedicineEditModalProps) {
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [scheduleId, setScheduleId] = useState<string | null>(null);
  const { showToast } = useToast();
  const { memberId } = useMemberContext();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MedicineWithScheduleUpdateFormData>({
    // @ts-expect-error - zodResolver type inference issue with default values
    resolver: zodResolver(medicineWithScheduleUpdateSchema),
    defaultValues: {
      id: "",
      name: "",
      dosageValue: 0,
      dosageUnit: DosageUnit.G,
      startDate: undefined,
      endDate: undefined,
      observations: "",
      scheduleType: MedicineScheduleType.OncePerDay,
      timeOfDay: null,
      timesOfDay: null,
      intervalInHours: null,
      firstDoseAt: null,
      weekDays: null,
      preAlarmMinutes: 15,
      posAlarmMinutes: 15,
    },
    mode: "onChange",
  });

  const scheduleType = watch("scheduleType");

  const resetFormWithSchedule = useCallback(
    (schedule: ScheduleDtoResponse) => {
      if (!medicine) {
        return;
      }
      const baseFormData = {
        id: medicine.id,
        name: medicine.name || "",
        dosageValue: medicine.dosageValue,
        dosageUnit: medicine.dosageUnit,
        startDate: dateOnlyToDate(medicine.startDate) || undefined,
        endDate: dateOnlyToDate(medicine.endDate) || undefined,
        observations: medicine.observations || "",
      };
      setScheduleId(schedule.id);
      reset({
        ...baseFormData,
        scheduleType: schedule.scheduleType,
        timeOfDay: schedule.timeOfDay || null,
        timesOfDay: schedule.timesOfDay || null,
        intervalInHours: schedule.intervalInHours || null,
        firstDoseAt: schedule.firstDoseAt || null,
        weekDays: schedule.weekDays || null,
        preAlarmMinutes: schedule.preAlarmMinutes || 15,
        posAlarmMinutes: schedule.posAlarmMinutes || 15,
      });
    },
    [medicine, reset]
  );

  const resetFormWithoutSchedule = useCallback(() => {
    if (!medicine) {
      return;
    }
    const baseFormData = {
      id: medicine.id,
      name: medicine.name || "",
      dosageValue: medicine.dosageValue,
      dosageUnit: medicine.dosageUnit,
      startDate: dateOnlyToDate(medicine.startDate) || undefined,
      endDate: dateOnlyToDate(medicine.endDate) || undefined,
      observations: medicine.observations || "",
    };
    reset({
      ...baseFormData,
      scheduleType: MedicineScheduleType.OncePerDay,
      timeOfDay: null,
      timesOfDay: null,
      intervalInHours: null,
      firstDoseAt: null,
      weekDays: null,
      preAlarmMinutes: 15,
      posAlarmMinutes: 15,
    });
  }, [medicine, reset]);

  const loadScheduleForMedicine = useCallback(
    async (medicineId: string) => {
      if (!medicine) {
        return;
      }

      try {
        const token = await getAuthToken();
        if (!token) {
          return;
        }

        const { getAllSchedules } = await import("@/services/api/schedule");
        const response = await getAllSchedules(
          token,
          1,
          1000,
          memberId || undefined
        );

        if (response.success && response.data) {
          const schedule = response.data.items.find(
            (s) => s.medicineId === medicineId
          );

          if (schedule) {
            resetFormWithSchedule(schedule);
          } else {
            resetFormWithoutSchedule();
          }
        }
      } catch {
        resetFormWithoutSchedule();
      }
    },
    [medicine, memberId, resetFormWithSchedule, resetFormWithoutSchedule]
  );

  useEffect(() => {
    if (medicine) {
      setScheduleId(null);
      loadScheduleForMedicine(medicine.id);
    }
  }, [medicine, loadScheduleForMedicine]);

  if (!medicine) {
    return null;
  }

  const handleConfirm = () => {
    setIsConfirmModalVisible(true);
  };

  const addScheduleTypeSpecificFields = (
    request: {
      id: string;
      medicineId: string;
      scheduleType: MedicineScheduleType;
      timeOfDay?: string | null;
      timesOfDay?: string[] | null;
      intervalInHours?: number | null;
      firstDoseAt?: string | null;
      weekDays?: number[] | null;
      preAlarmMinutes?: number | null;
      posAlarmMinutes?: number | null;
    },
    data: MedicineWithScheduleUpdateFormData
  ) => {
    const scheduleType = data.scheduleType || MedicineScheduleType.OncePerDay;

    if (
      scheduleType === MedicineScheduleType.OncePerDay ||
      scheduleType === MedicineScheduleType.SpecificWeekDays
    ) {
      request.timeOfDay = data.timeOfDay || null;
    }

    if (scheduleType === MedicineScheduleType.SpecificWeekDays) {
      request.weekDays = data.weekDays || null;
      return;
    }

    if (scheduleType === MedicineScheduleType.MultipleFixedTimesPerDay) {
      request.timesOfDay = data.timesOfDay || null;
      return;
    }

    if (scheduleType === MedicineScheduleType.EveryXHours) {
      request.intervalInHours = data.intervalInHours || null;
      request.firstDoseAt = data.firstDoseAt || null;
    }
  };

  const buildScheduleRequest = (
    data: MedicineWithScheduleUpdateFormData
  ): {
    id: string;
    medicineId: string;
    scheduleType: MedicineScheduleType;
    timeOfDay?: string | null;
    timesOfDay?: string[] | null;
    intervalInHours?: number | null;
    firstDoseAt?: string | null;
    weekDays?: number[] | null;
    preAlarmMinutes?: number | null;
    posAlarmMinutes?: number | null;
  } | null => {
    if (!scheduleId) {
      return null;
    }

    const request: {
      id: string;
      medicineId: string;
      scheduleType: MedicineScheduleType;
      timeOfDay?: string | null;
      timesOfDay?: string[] | null;
      intervalInHours?: number | null;
      firstDoseAt?: string | null;
      weekDays?: number[] | null;
      preAlarmMinutes?: number | null;
      posAlarmMinutes?: number | null;
    } = {
      id: scheduleId,
      medicineId: medicine.id,
      scheduleType: data.scheduleType || MedicineScheduleType.OncePerDay,
      preAlarmMinutes: data.preAlarmMinutes || null,
      posAlarmMinutes: data.posAlarmMinutes || null,
    };

    addScheduleTypeSpecificFields(request, data);

    return request;
  };

  const handleUpdateSchedule = async (
    data: MedicineWithScheduleUpdateFormData,
    token: string
  ) => {
    if (!scheduleId) {
      return true; // No schedule to update
    }

    const scheduleRequest = buildScheduleRequest(data);
    if (!scheduleRequest) {
      showToast("Erro ao processar agendamento", "error");
      return false;
    }

    const scheduleResponse = await updateSchedule(
      scheduleRequest.id,
      scheduleRequest,
      token,
      memberId || undefined
    );

    if (!scheduleResponse.success) {
      showToast(
        scheduleResponse.message || "Erro ao atualizar agendamento",
        "error"
      );
      return false;
    }

    return true;
  };

  const handleUpdateMedicine = async (
    data: MedicineWithScheduleUpdateFormData,
    token: string
  ) => {
    const updateRequest = {
      id: data.id,
      name: data.name.trim(),
      dosageValue: data.dosageValue,
      dosageUnit: data.dosageUnit,
      startDate: dateToDateOnly(data.startDate) ?? "",
      endDate: data.endDate ? dateToDateOnly(data.endDate) : null,
      observations: data.observations?.trim() || null,
    };

    const medicineResponse = await updateMedicine(
      medicine.id,
      updateRequest,
      token
    );

    if (!medicineResponse.success) {
      showToast(
        medicineResponse.message || "Erro ao atualizar medicação",
        "error"
      );
      return false;
    }

    return true;
  };

  const onSubmit = handleSubmit(
    async (data) => {
      try {
        const token = await getAuthToken();
        if (!token) {
          showToast(
            "Você precisa estar autenticado para editar medicações",
            "error"
          );
          return;
        }

        const medicineUpdated = await handleUpdateMedicine(
          data as unknown as MedicineWithScheduleUpdateFormData,
          token
        );
        if (!medicineUpdated) {
          return;
        }

        const scheduleUpdated = await handleUpdateSchedule(
          data as unknown as MedicineWithScheduleUpdateFormData,
          token
        );
        if (!scheduleUpdated) {
          return;
        }

        showToast(
          "Medicação e agendamento atualizados com sucesso!",
          "success"
        );
        setIsConfirmModalVisible(false);
        reset();
        onClose();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Erro ao atualizar medicação";
        showToast(errorMessage, "error");
      }
    },
    (validationErrors) => {
      const firstError = Object.values(validationErrors)[0];
      if (firstError?.message) {
        showToast(firstError.message, "error");
      } else {
        showToast("Por favor, preencha todos os campos corretamente", "error");
      }
    }
  );

  return (
    <>
      <ModalPageWrapper
        header={{
          title: "Editar medicação",
          description:
            "Altere as informações de uma medicação que cadastrou anteriormente",
          icon: <Pencil color="black" size={18} />,
        }}
        isVisible={isVisible}
        onClose={onClose}
      >
        <FormContentWrapper>
          <InputsWrapper>
            <StyledText variant="mediumSemiBold">
              Informações da medicação
            </StyledText>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <>
                  <InputBase
                    onChangeText={onChange}
                    placeholder="Nome da medicação"
                    value={value}
                  />
                  {errors.name && (
                    <StyledText color="error" variant="mediumRegular">
                      {errors.name.message}
                    </StyledText>
                  )}
                </>
              )}
            />
            <SideBySideInputsWrapper>
              <Controller
                control={control}
                name="dosageValue"
                render={({ field: { onChange, value } }) => (
                  <InputBase
                    compact
                    enableFlexOne
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      const num = Number.parseFloat(text);
                      onChange(Number.isNaN(num) ? 0 : num);
                    }}
                    placeholder="Dosagem"
                    value={value > 0 ? value.toString() : ""}
                  />
                )}
              />
              <Controller
                control={control}
                name="dosageUnit"
                render={({ field: { onChange, value } }) => (
                  <InputSelect
                    compact
                    enableFlexOne
                    onChange={(val) => {
                      const numVal =
                        typeof val === "string"
                          ? Number.parseInt(val, 10)
                          : val;
                      onChange(numVal as DosageUnit);
                    }}
                    options={getDosageUnitOptions()}
                    placeholder="Medida"
                    value={value.toString()}
                  />
                )}
              />
            </SideBySideInputsWrapper>
            {(errors.dosageValue || errors.dosageUnit) && (
              <StyledText color="error" variant="mediumRegular">
                {errors.dosageValue?.message || errors.dosageUnit?.message}
              </StyledText>
            )}
            <Controller
              control={control}
              name="startDate"
              render={({ field: { onChange, value } }) => (
                <>
                  <InputDate
                    onChange={onChange}
                    placeholder="Data de início"
                    value={value}
                  />
                  {errors.startDate && (
                    <StyledText color="error" variant="mediumRegular">
                      {errors.startDate.message}
                    </StyledText>
                  )}
                </>
              )}
            />
            <Controller
              control={control}
              name="endDate"
              render={({ field: { onChange, value } }) => (
                <InputDate
                  onChange={onChange}
                  placeholder="Data de fim (opcional)"
                  value={value || null}
                />
              )}
            />
            <Controller
              control={control}
              name="observations"
              render={({ field: { onChange, value } }) => (
                <>
                  <InputBase
                    multiline
                    numberOfLines={3}
                    onChangeText={onChange}
                    placeholder="Observações (opcional)"
                    value={value || ""}
                  />
                  {errors.observations && (
                    <StyledText color="error" variant="mediumRegular">
                      {errors.observations.message}
                    </StyledText>
                  )}
                </>
              )}
            />
            <StyledText style={{ marginTop: 16 }} variant="largeRegular">
              Agendamento
            </StyledText>
            <Controller
              control={control}
              name="scheduleType"
              render={({ field: { onChange, value } }) => (
                <>
                  <InputSelect
                    onChange={(val) => {
                      const numVal =
                        typeof val === "string"
                          ? Number.parseInt(val, 10)
                          : val;
                      onChange(numVal as MedicineScheduleType);
                    }}
                    options={getMedicineScheduleTypeOptions()}
                    placeholder="Tipo de agendamento"
                    value={value.toString()}
                  />
                  {errors.scheduleType && (
                    <StyledText color="error" variant="mediumRegular">
                      {errors.scheduleType.message}
                    </StyledText>
                  )}
                </>
              )}
            />
            {(scheduleType === MedicineScheduleType.OncePerDay ||
              scheduleType === MedicineScheduleType.SpecificWeekDays) && (
              <Controller
                control={control}
                name="timeOfDay"
                render={({ field: { onChange, value } }) => {
                  // Converter string para Date para InputDate
                  const dateValue = value
                    ? new Date(`2000-01-01T${value}`)
                    : null;
                  return (
                    <>
                      <InputDate
                        mode="time"
                        onChange={(date) => {
                          if (date) {
                            const timeStr = dateToTimeOnly(date);
                            onChange(timeStr || null);
                          } else {
                            onChange(null);
                          }
                        }}
                        placeholder="Horário"
                        suffixIcon="clock-o"
                        value={dateValue}
                      />
                      {errors.timeOfDay && (
                        <StyledText color="error" variant="mediumRegular">
                          {errors.timeOfDay.message}
                        </StyledText>
                      )}
                    </>
                  );
                }}
              />
            )}
            {scheduleType === MedicineScheduleType.SpecificWeekDays && (
              <>
                <StyledText style={{ marginTop: 8 }} variant="mediumRegular">
                  Dias da semana
                </StyledText>
                <Controller
                  control={control}
                  name="weekDays"
                  render={({ field: { onChange, value } }) => (
                    <>
                      <WeekDaysWrapper>
                        {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
                          const dayLabel =
                            weekDayLabels[dayNum as WeekDay] || `Dia ${dayNum}`;
                          const isSelected = (value || []).includes(dayNum);
                          return (
                            <MultiSelectTag
                              id={dayNum}
                              isSelected={isSelected}
                              key={dayNum}
                              label={dayLabel}
                              onPress={() => {
                                const currentWeekDays = value || [];
                                if (isSelected) {
                                  onChange(
                                    currentWeekDays.filter((d) => d !== dayNum)
                                  );
                                } else {
                                  onChange([...currentWeekDays, dayNum]);
                                }
                              }}
                            />
                          );
                        })}
                      </WeekDaysWrapper>
                      {errors.weekDays && (
                        <StyledText color="error" variant="mediumRegular">
                          {errors.weekDays.message}
                        </StyledText>
                      )}
                    </>
                  )}
                />
              </>
            )}
            <SideBySideInputsWrapper>
              <Controller
                control={control}
                name="preAlarmMinutes"
                render={({ field: { onChange, value } }) => (
                  <>
                    <InputBase
                      compact
                      enableFlexOne
                      keyboardType="numeric"
                      onChangeText={(text) => {
                        const num = Number.parseInt(text, 10);
                        onChange(Number.isNaN(num) ? 0 : num);
                      }}
                      placeholder="Alarme antes (min)"
                      value={value && value > 0 ? value.toString() : ""}
                    />
                    {errors.preAlarmMinutes && (
                      <StyledText color="error" variant="mediumRegular">
                        {errors.preAlarmMinutes.message}
                      </StyledText>
                    )}
                  </>
                )}
              />
              <Controller
                control={control}
                name="posAlarmMinutes"
                render={({ field: { onChange, value } }) => (
                  <>
                    <InputBase
                      compact
                      enableFlexOne
                      keyboardType="numeric"
                      onChangeText={(text) => {
                        const num = Number.parseInt(text, 10);
                        onChange(Number.isNaN(num) ? 0 : num);
                      }}
                      placeholder="Alarme depois (min)"
                      value={value && value > 0 ? value.toString() : ""}
                    />
                    {errors.posAlarmMinutes && (
                      <StyledText color="error" variant="mediumRegular">
                        {errors.posAlarmMinutes.message}
                      </StyledText>
                    )}
                  </>
                )}
              />
            </SideBySideInputsWrapper>
          </InputsWrapper>
          <ButtonsWrapper addPadding>
            <Button
              disabled={isSubmitting}
              label="Confirmar"
              onPress={handleConfirm}
              variant="primary"
            />
            <Button
              disabled={isSubmitting}
              label="Cancelar"
              onPress={onClose}
              variant="outline"
            />
          </ButtonsWrapper>
        </FormContentWrapper>
      </ModalPageWrapper>

      <ModalBase
        button={[
          {
            label: "Sim, quero editar",
            onPress: () => {
              if (!isSubmitting) {
                onSubmit();
              }
            },
            isLoading: isSubmitting,
            variant: "primary",
          },
          {
            label: "Cancelar",
            onPress: () => setIsConfirmModalVisible(false),
            variant: "outline",
          },
        ]}
        description="Após confirmar, a medicação será alterada para sempre, sem chances de voltar atrás."
        isVisible={isConfirmModalVisible}
        onClose={() => setIsConfirmModalVisible(false)}
        title="Confirmar alterações?"
      />
    </>
  );
}
