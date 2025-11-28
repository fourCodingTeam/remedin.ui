import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react-native";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  InputBase,
  InputDate,
  InputSelect,
  MultiSelectTag,
  StyledText,
} from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { useMemberContext } from "@/hooks";
import {
  DosageUnit,
  MedicineScheduleType,
  type WeekDay,
  weekDayLabels,
} from "@/services/@types/enums";
import { createMedicine } from "@/services/api/medicine";
import { createSchedule } from "@/services/api/schedule";
import { getAuthToken } from "@/services/utils/getAuthToken";
import { dateToDateOnly } from "@/utils/DateFormatters/dateOnly";
import { dateToTimeOnly } from "@/utils/DateFormatters/timeOnly";
import { getDosageUnitOptions } from "@/utils/medicine/dosageUnitMapper";
import { getMedicineScheduleTypeOptions } from "@/utils/schedule/medicineScheduleTypeMapper";
import {
  type MedicineWithScheduleFormData,
  medicineWithScheduleSchema,
} from "@/validators";
import { ModalPageWrapper } from "../../Common/ModalPageWrapper";
import {
  ButtonsWrapper,
  FormContentWrapper,
  InputsWrapper,
  ScrollableContentWrapper,
} from "../../styles";
import {
  SideBySideInputsWrapper,
  WeekDaysWrapper,
} from "./MedicineFormModal.styles";
import type { MedicineFormModalProps } from "./MedicineFormMotal.types";

export function MedicineFormModal({
  isVisible,
  onClose,
}: MedicineFormModalProps) {
  const { showToast } = useToast();
  const { memberId } = useMemberContext();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MedicineWithScheduleFormData>({
    resolver: zodResolver(medicineWithScheduleSchema),
    defaultValues: {
      name: "",
      dosageValue: 0,
      dosageUnit: DosageUnit.G,
      startDate: undefined,
      endDate: undefined,
      observations: "",
      scheduleType: MedicineScheduleType.OncePerDay,
      timeOfDay: null,
      weekDays: null,
      preAlarmMinutes: 15,
      posAlarmMinutes: 15,
      intervalInHours: null,
      firstDoseAt: null,
    },
    mode: "onChange",
  });

  const scheduleType = watch("scheduleType");
  const intervalInHours = watch("intervalInHours");
  const startDate = watch("startDate");

  useEffect(() => {
    if (!isVisible) {
      reset();
    }
  }, [isVisible, reset]);

  // Atualizar firstDoseAt quando startDate mudar (para EveryXHours)
  useEffect(() => {
    if (scheduleType === MedicineScheduleType.EveryXHours && startDate) {
      const currentFirstDoseAt = watch("firstDoseAt");
      if (currentFirstDoseAt) {
        // Se já houver um horário definido, atualizar a data mantendo o horário
        const existingDate = new Date(currentFirstDoseAt);
        const updatedDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate(),
          existingDate.getHours(),
          existingDate.getMinutes(),
          existingDate.getSeconds()
        );
        setValue("firstDoseAt", updatedDate.toISOString());
      }
    }
  }, [startDate, scheduleType, setValue, watch]);

  const handleCancel = () => {
    reset();
    onClose();
  };

  const handleCreateMedicine = async (
    data: MedicineWithScheduleFormData,
    token: string
  ) => {
    const createRequest = {
      name: data.name.trim(),
      dosageValue: data.dosageValue,
      dosageUnit: data.dosageUnit,
      startDate: dateToDateOnly(data.startDate) ?? "",
      endDate: data.endDate ? dateToDateOnly(data.endDate) : null,
      observations: data.observations?.trim() || null,
    };

    const medicineResponse = await createMedicine(
      createRequest,
      token,
      memberId || undefined
    );

    if (!(medicineResponse.success && medicineResponse.data)) {
      showToast(
        medicineResponse.message || "Erro ao adicionar medicação",
        "error"
      );
      return null;
    }

    return medicineResponse.data.id;
  };

  const validateScheduleData = (
    data: MedicineWithScheduleFormData
  ): string | null => {
    const scheduleType = data.scheduleType || MedicineScheduleType.OncePerDay;

    const needsTimeOfDay =
      scheduleType === MedicineScheduleType.OncePerDay ||
      scheduleType === MedicineScheduleType.SpecificWeekDays;
    if (needsTimeOfDay && !data.timeOfDay) {
      return "Horário é obrigatório para este tipo de agendamento";
    }

    if (
      scheduleType === MedicineScheduleType.SpecificWeekDays &&
      (!data.weekDays || data.weekDays.length === 0)
    ) {
      return "Selecione pelo menos um dia da semana";
    }

    if (
      scheduleType === MedicineScheduleType.MultipleFixedTimesPerDay &&
      (!data.timesOfDay || data.timesOfDay.length === 0)
    ) {
      return "Adicione pelo menos um horário";
    }

    if (
      scheduleType === MedicineScheduleType.EveryXHours &&
      !(data.intervalInHours && data.firstDoseAt)
    ) {
      return "Intervalo e primeira dose são obrigatórios";
    }

    return null;
  };

  const buildScheduleRequest = (
    data: MedicineWithScheduleFormData,
    medicineId: string
  ) => {
    const scheduleType = data.scheduleType || MedicineScheduleType.OncePerDay;
    const request: {
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
      medicineId,
      scheduleType,
      preAlarmMinutes: data.preAlarmMinutes || null,
      posAlarmMinutes: data.posAlarmMinutes || null,
    };

    const isOncePerDay = scheduleType === MedicineScheduleType.OncePerDay;
    const isSpecificWeekDays =
      scheduleType === MedicineScheduleType.SpecificWeekDays;
    const needsTimeOfDay = isOncePerDay || isSpecificWeekDays;

    if (needsTimeOfDay) {
      request.timeOfDay = data.timeOfDay || null;
    }

    if (isSpecificWeekDays) {
      request.weekDays = data.weekDays || null;
    } else if (scheduleType === MedicineScheduleType.MultipleFixedTimesPerDay) {
      request.timesOfDay = data.timesOfDay || null;
    } else if (scheduleType === MedicineScheduleType.EveryXHours) {
      request.intervalInHours = data.intervalInHours || null;
      request.firstDoseAt = data.firstDoseAt || null;
    }

    return request;
  };

  const handleCreateSchedule = async (
    data: MedicineWithScheduleFormData,
    medicineId: string,
    token: string
  ) => {
    const validationError = validateScheduleData(data);
    if (validationError) {
      showToast(validationError, "error");
      return false;
    }

    const scheduleRequest = buildScheduleRequest(data, medicineId);
    const scheduleResponse = await createSchedule(
      scheduleRequest,
      token,
      memberId || undefined
    );

    if (!scheduleResponse.success) {
      showToast(
        scheduleResponse.message ||
          "Medicação criada, mas houve erro ao criar agendamento",
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
            "Você precisa estar autenticado para adicionar medicações",
            "error"
          );
          return;
        }

        const medicineId = await handleCreateMedicine(data, token);
        if (!medicineId) {
          return;
        }

        const scheduleCreated = await handleCreateSchedule(
          data,
          medicineId,
          token
        );
        if (!scheduleCreated) {
          return;
        }

        showToast("Medicação e agendamento criados com sucesso!", "success");
        reset();
        onClose();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Erro ao adicionar medicação";
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
    <ModalPageWrapper
      header={{
        title: "Adicionar medicação",
        description:
          "Preencha os campos abaixo para adicionar uma nova medicação",
        icon: <Plus color="black" size={20} />,
      }}
      isVisible={isVisible}
      onClose={onClose}
    >
      <ScrollableContentWrapper>
        <FormContentWrapper>
          <InputsWrapper>
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
            {scheduleType === MedicineScheduleType.OncePerDay ||
            scheduleType === MedicineScheduleType.SpecificWeekDays ? (
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
            ) : null}
            {scheduleType === MedicineScheduleType.SpecificWeekDays ? (
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
            ) : null}
            {scheduleType === MedicineScheduleType.EveryXHours ? (
              <>
                <Controller
                  control={control}
                  name="firstDoseAt"
                  render={({ field: { onChange, value } }) => {
                    // Converter ISO string para Date para InputDate
                    let dateValue: Date | null = null;
                    if (value) {
                      try {
                        dateValue = new Date(value);
                      } catch {
                        dateValue = null;
                      }
                    }
                    return (
                      <>
                        <InputDate
                          mode="time"
                          onChange={(date) => {
                            if (date) {
                              // Usar a data de início da medicação ou data atual se não houver
                              const baseDate = startDate || new Date();
                              const selectedDate = new Date(
                                baseDate.getFullYear(),
                                baseDate.getMonth(),
                                baseDate.getDate(),
                                date.getHours(),
                                date.getMinutes(),
                                date.getSeconds()
                              );
                              // Converter para ISO string com timezone
                              const isoString = selectedDate.toISOString();
                              onChange(isoString);
                            } else {
                              onChange(null);
                            }
                          }}
                          placeholder="Horário inicial"
                          suffixIcon="clock-o"
                          value={dateValue}
                        />
                        {errors.firstDoseAt && (
                          <StyledText color="error" variant="mediumRegular">
                            {errors.firstDoseAt.message}
                          </StyledText>
                        )}
                      </>
                    );
                  }}
                />
                <StyledText style={{ marginTop: 8 }} variant="mediumRegular">
                  Intervalo
                </StyledText>
                <Controller
                  control={control}
                  name="intervalInHours"
                  render={({ field: { onChange, value } }) => {
                    const intervalOptions = [
                      { label: "6 horas", value: 6 },
                      { label: "8 horas", value: 8 },
                    ];
                    const isCustomInterval = value !== null && value !== undefined && value !== 6 && value !== 8;
                    const showCustomField = isCustomInterval || value === null || value === undefined;
                    
                    return (
                      <>
                        <WeekDaysWrapper>
                          {intervalOptions.map((option) => {
                            const isSelected = value === option.value;
                            
                            return (
                              <MultiSelectTag
                                id={option.value.toString()}
                                isSelected={isSelected}
                                key={option.value.toString()}
                                label={option.label}
                                onPress={() => {
                                  onChange(option.value);
                                }}
                              />
                            );
                          })}
                          <MultiSelectTag
                            id="custom"
                            isSelected={isCustomInterval}
                            key="custom"
                            label="Personalizado"
                            onPress={() => {
                              // Ao clicar em personalizado, limpar o valor para mostrar o campo
                              onChange(null);
                            }}
                          />
                        </WeekDaysWrapper>
                        {showCustomField ? (
                          <>
                            <InputBase
                              keyboardType="numeric"
                              onChangeText={(text) => {
                                const num = Number.parseInt(text, 10);
                                if (!Number.isNaN(num) && num > 0) {
                                  onChange(num);
                                } else {
                                  onChange(null);
                                }
                              }}
                              placeholder="Intervalo personalizado (horas)"
                              style={{ marginTop: 8 }}
                              value={isCustomInterval && value ? value.toString() : ""}
                            />
                            {errors.intervalInHours && (
                              <StyledText color="error" variant="mediumRegular">
                                {errors.intervalInHours.message}
                              </StyledText>
                            )}
                          </>
                        ) : null}
                      </>
                    );
                  }}
                />
              </>
            ) : null}
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
        </FormContentWrapper>
      </ScrollableContentWrapper>
      <ButtonsWrapper addPadding>
        <Button
          disabled={isSubmitting}
          isLoading={isSubmitting}
          label="Adicionar"
          onPress={onSubmit}
          variant="primary"
        />
        <Button
          disabled={isSubmitting}
          label="Cancelar"
          onPress={handleCancel}
          variant="outline"
        />
      </ButtonsWrapper>
    </ModalPageWrapper>
  );
}
