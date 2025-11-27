import { useEffect, useRef } from "react";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { websocketService } from "./websocketService";
import type {
  MedicationReminderNotification,
  MedicationTakenNotification,
} from "./websocketService";
import { showNotificationFromWebSocket } from "@/services/notifications/notificationService";
import { useMemberContext } from "@/hooks";
import { useUserStore } from "@/stores/UserStore";

/**
 * Checks if the app is running in Expo Go
 * SignalR WebSocket connections don't work in Expo Go, only in development builds
 */
function isExpoGo(): boolean {
  try {
    // Expo Go typically has appOwnership === "expo"
    // Development builds have appOwnership === "standalone" or null
    return Constants.appOwnership === "expo";
  } catch {
    // If Constants is not available, assume not Expo Go (development build)
    return false;
  }
}

export function useWebSocketNotifications() {
  const { memberId } = useMemberContext();
  const { isLoggedIn, token } = useUserStore();
  const hasConnectedRef = useRef(false);

  useEffect(() => {
    // Skip WebSocket connection if running in Expo Go
    if (isExpoGo()) {
      console.warn("SignalR WebSocket is disabled in Expo Go. Use a development build for real-time notifications.");
      return;
    }

    let unsubscribe: (() => void) | null = null;

    const connectAndListen = async () => {
      // Only connect if user is authenticated
      if (!isLoggedIn && !token) {
        return;
      }

      try {
        // Connect to websocket
        if (!websocketService.isConnected() && !hasConnectedRef.current) {
          hasConnectedRef.current = true;
          await websocketService.connect();
        }

        // Join member group if member is selected
        if (memberId && websocketService.isConnected()) {
          await websocketService.joinMemberGroup(memberId);
        }

        // Listen for notifications
        unsubscribe = websocketService.onNotification((notification) => {
          if ("doseOccurrenceId" in notification) {
            // MedicationReminder notification
            const reminder = notification as MedicationReminderNotification;
            showNotificationFromWebSocket(
              "Hora de tomar medicação",
              reminder.message,
              {
                type: "medication_reminder",
                doseOccurrenceId: reminder.doseOccurrenceId,
                medicineId: reminder.medicineId,
                scheduleId: reminder.scheduleId,
              }
            );
          } else {
            // MedicationTaken notification
            const taken = notification as MedicationTakenNotification;
            showNotificationFromWebSocket(
              "Medicamento registrado",
              taken.message,
              {
                type: "medication_taken",
                medicineName: taken.medicineName,
              }
            );
          }
        });
      } catch (error) {
        // Silently fail in Expo Go - SignalR doesn't work there anyway
        if (!isExpoGo()) {
          console.error("Error connecting to websocket", error);
        }
        hasConnectedRef.current = false;
      }
    };

    connectAndListen();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [memberId, isLoggedIn, token]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hasConnectedRef.current) {
        websocketService.disconnect().catch(console.error);
        hasConnectedRef.current = false;
      }
    };
  }, []);
}

