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
import {
  DosageUnit,
  FrequencyType,
  WeekDay,
  weekDayLabels,
} from "@/services/@types/enums";
import { createMedicine } from "@/services/api/medicine";
import { createSchedule } from "@/services/api/schedule";
import { getAuthToken } from "@/services/utils/getAuthToken";
import { dateToDateOnly } from "@/utils/DateFormatters/dateOnly";
import { dateToTimeOnly } from "@/utils/DateFormatters/timeOnly";
import { getDosageUnitOptions } from "@/utils/medicine/dosageUnitMapper";
import { getFrequencyTypeOptions } from "@/utils/schedule/frequencyTypeMapper";
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

  const {
    control,
    handleSubmit,
    reset,
    watch,
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
      scheduledTime: undefined,
      frequencyType: FrequencyType.Daily,
      weekDays: [],
      preAlarmMinutes: 15,
      posAlarmMinutes: 15,
    },
    mode: "onChange",
  });

  const frequencyType = watch("frequencyType");

  useEffect(() => {
    if (!isVisible) {
      reset();
    }
  }, [isVisible, reset]);

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

    const medicineResponse = await createMedicine(createRequest, token);

    if (!(medicineResponse.success && medicineResponse.data)) {
      showToast(
        medicineResponse.message || "Erro ao adicionar medicação",
        "error"
      );
      return null;
    }

    return medicineResponse.data.id;
  };

  const handleCreateSchedule = async (
    data: MedicineWithScheduleFormData,
    medicineId: string,
    token: string
  ) => {
    const timeOnly = dateToTimeOnly(data.scheduledTime);
    if (!timeOnly) {
      showToast("Erro ao processar horário", "error");
      return false;
    }

    const scheduleRequest = {
      medicineId,
      scheduledTime: timeOnly,
      frequencyType: data.frequencyType,
      preAlarmMinutes: data.preAlarmMinutes,
      posAlarmMinutes: data.posAlarmMinutes,
      weekDays:
        data.frequencyType === FrequencyType.Weekly &&
        data.weekDays &&
        data.weekDays.length > 0
          ? data.weekDays
          : null,
    };

    const scheduleResponse = await createSchedule(scheduleRequest, token);

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
              name="scheduledTime"
              render={({ field: { onChange, value } }) => (
                <>
                  <InputDate
                    mode="time"
                    onChange={onChange}
                    placeholder="Horário"
                    suffixIcon="clock-o"
                    value={value || null}
                  />
                  {errors.scheduledTime && (
                    <StyledText color="error" variant="mediumRegular">
                      {errors.scheduledTime.message}
                    </StyledText>
                  )}
                </>
              )}
            />
            <Controller
              control={control}
              name="frequencyType"
              render={({ field: { onChange, value } }) => (
                <>
                  <InputSelect
                    onChange={(val) => {
                      const numVal =
                        typeof val === "string"
                          ? Number.parseInt(val, 10)
                          : val;
                      onChange(numVal as FrequencyType);
                    }}
                    options={getFrequencyTypeOptions()}
                    placeholder="Frequência"
                    value={value.toString()}
                  />
                  {errors.frequencyType && (
                    <StyledText color="error" variant="mediumRegular">
                      {errors.frequencyType.message}
                    </StyledText>
                  )}
                </>
              )}
            />
            {frequencyType === FrequencyType.Weekly && (
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
                        {Object.entries(WeekDay)
                          .filter(([, val]) => typeof val === "number")
                          .map(([, val]) => {
                            const day = val as WeekDay;
                            const isSelected = (value || []).includes(day);
                            return (
                              <MultiSelectTag
                                id={day}
                                isSelected={isSelected}
                                key={day}
                                label={weekDayLabels[day]}
                                onPress={() => {
                                  const currentWeekDays = value || [];
                                  if (isSelected) {
                                    onChange(
                                      currentWeekDays.filter((d) => d !== day)
                                    );
                                  } else {
                                    onChange([...currentWeekDays, day]);
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
                      value={value > 0 ? value.toString() : ""}
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
                      value={value > 0 ? value.toString() : ""}
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
