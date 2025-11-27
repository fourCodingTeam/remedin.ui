import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import {
  dosageUnitLabels,
  MedicineScheduleType,
} from "@/services/@types/enums";
import type { MedicineDtoResponse } from "@/services/@types/medicine";
import type { ScheduleDtoResponse } from "@/services/@types/schedule";

// Configurar como as notificações devem ser tratadas quando o app está em foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export type NotificationData = {
  scheduleId: string;
  medicineId: string;
  medicineName: string;
  scheduledTime: string;
};

/**
 * Solicita permissões para notificações
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      // Permissão de notificações não concedida
      return false;
    }

    // Configurar canal de notificação para Android
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Medicações",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
        sound: "default",
      });
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Agenda uma notificação única
 */
export async function scheduleNotification(
  notificationId: string,
  title: string,
  body: string,
  triggerDate: Date,
  data?: NotificationData
): Promise<string | null> {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return null;
    }

    const trigger: Notifications.DateTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    };

    const notificationIdResult = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger,
      identifier: notificationId,
    });

    return notificationIdResult;
  } catch {
    return null;
  }
}

/**
 * Agenda notificações para tipo OncePerDay
 */
async function handleOncePerDaySchedule(
  schedule: ScheduleDtoResponse,
  medicine: MedicineDtoResponse,
  startDate: Date,
  endDate: Date
): Promise<string[]> {
  if (!schedule.timeOfDay) {
    return [];
  }
  return await scheduleDailyNotifications(
    schedule,
    medicine,
    startDate,
    endDate,
    schedule.timeOfDay
  );
}

/**
 * Agenda notificações para tipo MultipleFixedTimesPerDay
 */
async function handleMultipleTimesPerDaySchedule(
  schedule: ScheduleDtoResponse,
  medicine: MedicineDtoResponse,
  startDate: Date,
  endDate: Date
): Promise<string[]> {
  if (!schedule.timesOfDay || schedule.timesOfDay.length === 0) {
    return [];
  }

  const allNotificationIds: string[] = [];
  for (const timeOfDay of schedule.timesOfDay) {
    const ids = await scheduleDailyNotifications(
      schedule,
      medicine,
      startDate,
      endDate,
      timeOfDay
    );
    allNotificationIds.push(...ids);
  }
  return allNotificationIds;
}

/**
 * Agenda notificações para tipo EveryXHours
 */
async function handleEveryXHoursSchedule(
  schedule: ScheduleDtoResponse,
  medicine: MedicineDtoResponse,
  endDate: Date
): Promise<string[]> {
  const intervalInHours = schedule.intervalInHours;
  if (!intervalInHours || intervalInHours <= 0) {
    return [];
  }
  if (!schedule.firstDoseAt) {
    return [];
  }

  return await scheduleIntervalNotifications(
    schedule,
    medicine,
    schedule.firstDoseAt,
    endDate,
    intervalInHours
  );
}

/**
 * Agenda notificações para tipo SpecificWeekDays
 */
async function handleSpecificWeekDaysSchedule(
  schedule: ScheduleDtoResponse,
  medicine: MedicineDtoResponse,
  startDate: Date,
  endDate: Date
): Promise<string[]> {
  if (!schedule.timeOfDay) {
    return [];
  }
  if (!schedule.weekDays) {
    return [];
  }

  return await scheduleWeeklyNotifications(
    schedule,
    medicine,
    startDate,
    endDate,
    schedule.timeOfDay,
    schedule.weekDays
  );
}

/**
 * Agenda notificações recorrentes baseadas em um schedule
 */
export async function scheduleNotificationsForSchedule(
  schedule: ScheduleDtoResponse,
  medicine: MedicineDtoResponse,
  startDate: Date,
  endDate: Date | null
): Promise<string[]> {
  const now = new Date();
  const end = endDate || new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 ano se não houver data final

  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return [];
    }

    switch (schedule.scheduleType) {
      case MedicineScheduleType.OncePerDay:
        return handleOncePerDaySchedule(schedule, medicine, startDate, end);

      case MedicineScheduleType.MultipleFixedTimesPerDay:
        return handleMultipleTimesPerDaySchedule(
          schedule,
          medicine,
          startDate,
          end
        );

      case MedicineScheduleType.EveryXHours:
        return handleEveryXHoursSchedule(schedule, medicine, end);

      case MedicineScheduleType.SpecificWeekDays:
        return handleSpecificWeekDaysSchedule(
          schedule,
          medicine,
          startDate,
          end
        );

      default:
        return [];
    }
  } catch {
    return [];
  }
}

/**
 * Agenda notificações diárias
 */
async function scheduleDailyNotifications(
  schedule: ScheduleDtoResponse,
  medicine: MedicineDtoResponse,
  startDate: Date,
  endDate: Date,
  timeOfDay: string
): Promise<string[]> {
  const notificationIds: string[] = [];
  const [hours, minutes] = timeOfDay.split(":").map(Number);
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const notificationDate = new Date(currentDate);
    notificationDate.setHours(hours, minutes || 0, 0, 0);

    if (notificationDate >= new Date()) {
      const notificationId = `${schedule.id}-${notificationDate.toISOString()}`;
      const preAlarmDate = new Date(
        notificationDate.getTime() - (schedule.preAlarmMinutes || 0) * 60 * 1000
      );

      // Notificação pré-alarme se configurada
      if (
        schedule.preAlarmMinutes &&
        schedule.preAlarmMinutes > 0 &&
        preAlarmDate >= new Date()
      ) {
        const preAlarmId = `${notificationId}-pre`;
        await scheduleNotification(
          preAlarmId,
          `Lembrete: ${medicine.name}`,
          `Você tem uma medicação em ${schedule.preAlarmMinutes} minutos`,
          preAlarmDate,
          {
            scheduleId: schedule.id,
            medicineId: medicine.id,
            medicineName: medicine.name,
            scheduledTime: timeOfDay,
          }
        );
      }

      // Notificação principal
      await scheduleNotification(
        notificationId,
        `Hora de tomar: ${medicine.name}`,
        `Dosagem: ${medicine.dosageValue} ${getDosageUnitLabel(medicine.dosageUnit)}`,
        notificationDate,
        {
          scheduleId: schedule.id,
          medicineId: medicine.id,
          medicineName: medicine.name,
          scheduledTime: timeOfDay,
        }
      );

      notificationIds.push(notificationId);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return notificationIds;
}

/**
 * Agenda notificações com intervalo de horas
 */
async function scheduleIntervalNotifications(
  schedule: ScheduleDtoResponse,
  medicine: MedicineDtoResponse,
  firstDoseAt: string,
  endDate: Date,
  intervalInHours: number
): Promise<string[]> {
  const notificationIds: string[] = [];
  const firstDoseDate = new Date(firstDoseAt);
  let currentDate = new Date(firstDoseDate);
  const now = new Date();

  while (currentDate <= endDate) {
    // Limitar a 30 dias no futuro para evitar muitas notificações
    if (shouldScheduleForDate(currentDate, endDate, now)) {
      const notificationId = `${schedule.id}-${currentDate.toISOString()}`;
      const timeString = `${currentDate.getHours().toString().padStart(2, "0")}:${currentDate.getMinutes().toString().padStart(2, "0")}`;

      await scheduleNotification(
        notificationId,
        `Hora de tomar: ${medicine.name}`,
        `Dosagem: ${medicine.dosageValue} ${getDosageUnitLabel(medicine.dosageUnit)}`,
        currentDate,
        {
          scheduleId: schedule.id,
          medicineId: medicine.id,
          medicineName: medicine.name,
          scheduledTime: timeString,
        }
      );

      notificationIds.push(notificationId);
    }

    currentDate = new Date(
      currentDate.getTime() + intervalInHours * 60 * 60 * 1000
    );
  }

  return notificationIds;
}

function shouldScheduleForDate(
  currentDate: Date,
  endDate: Date,
  now: Date
): boolean {
  return (
    currentDate <= endDate &&
    currentDate <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  );
}

/**
 * Agenda notificações para dias específicos da semana
 */
async function scheduleWeeklyNotifications(
  schedule: ScheduleDtoResponse,
  medicine: MedicineDtoResponse,
  startDate: Date,
  endDate: Date,
  timeOfDay: string,
  weekDays: number[]
): Promise<string[]> {
  const notificationIds: string[] = [];
  const [hours, minutes] = timeOfDay.split(":").map(Number);
  const currentDate = new Date(startDate);
  const now = new Date();

  // Mapear dias da semana do backend (1=Monday) para JavaScript (0=Sunday)
  const jsWeekDays = weekDays.map((day) => (day === 7 ? 0 : day));

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    if (jsWeekDays.includes(dayOfWeek)) {
      const notificationDate = new Date(currentDate);
      notificationDate.setHours(hours, minutes || 0, 0, 0);

      if (notificationDate >= now) {
        const notificationId = `${schedule.id}-${notificationDate.toISOString()}`;

        await scheduleNotification(
          notificationId,
          `Hora de tomar: ${medicine.name}`,
          `Dosagem: ${medicine.dosageValue} ${getDosageUnitLabel(medicine.dosageUnit)}`,
          notificationDate,
          {
            scheduleId: schedule.id,
            medicineId: medicine.id,
            medicineName: medicine.name,
            scheduledTime: timeOfDay,
          }
        );

        notificationIds.push(notificationId);
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return notificationIds;
}

/**
 * Cancela todas as notificações de um schedule
 */
export async function cancelScheduleNotifications(
  scheduleId: string
): Promise<void> {
  try {
    const allNotifications =
      await Notifications.getAllScheduledNotificationsAsync();
    const notificationsToCancel = allNotifications.filter(
      (notification: { identifier: string }) =>
        notification.identifier.startsWith(scheduleId)
    );

    await Promise.all(
      notificationsToCancel.map((notification: { identifier: string }) =>
        Notifications.cancelScheduledNotificationAsync(notification.identifier)
      )
    );
  } catch {
    // Erro ao cancelar notificações - ignorar
  }
}

/**
 * Cancela todas as notificações
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // Erro ao cancelar todas as notificações - ignorar
  }
}

function getDosageUnitLabel(dosageUnit: number | string): string {
  if (typeof dosageUnit === "number") {
    return (
      dosageUnitLabels[dosageUnit as keyof typeof dosageUnitLabels] || "unidade"
    );
  }
  return dosageUnit;
}

/**
 * Envia uma notificação push local quando recebe uma notificação do websocket
 */
export async function showNotificationFromWebSocket(
  title: string,
  body: string,
  data?: Record<string, unknown>
): Promise<void> {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null, // Enviar imediatamente
    });
  } catch {
    // Silently fail - notification errors are non-critical
  }
}
