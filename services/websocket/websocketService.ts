import * as SignalR from "@microsoft/signalr";
import { API_BASE_URL } from "@/constants/apiConfig";
import { getAuthToken } from "@/services/utils/getAuthToken";

export interface MedicationReminderNotification {
  doseOccurrenceId: string;
  medicineId: string;
  scheduleId: string;
  medicineName: string;
  dosage: string;
  scheduledAt: string;
  message: string;
  forMemberId?: string;
  forMemberName?: string;
}

export interface MedicationTakenNotification {
  medicineName: string;
  takenAt: string;
  message: string;
  forMemberId?: string;
}

type NotificationCallback = (notification: MedicationReminderNotification | MedicationTakenNotification) => void;

class WebSocketService {
  private connection: SignalR.HubConnection | null = null;
  private isConnecting = false;
  private callbacks: NotificationCallback[] = [];

  async connect(): Promise<void> {
    if (this.connection?.state === SignalR.HubConnectionState.Connected) {
      return;
    }

    if (this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error("No auth token available");
      }

      const hubUrl = `${API_BASE_URL}/hubs/notifications`;

      this.connection = new SignalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: async () => {
            const currentToken = await getAuthToken();
            if (!currentToken) {
              throw new Error("No auth token available");
            }
            return currentToken;
          },
          withCredentials: false,
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            // Exponential backoff: 0s, 2s, 10s, 30s
            if (retryContext.previousRetryCount === 0) return 0;
            if (retryContext.previousRetryCount === 1) return 2000;
            if (retryContext.previousRetryCount === 2) return 10000;
            return 30000;
          },
        })
        .configureLogging(SignalR.LogLevel.Information)
        .build();

      // Set up handlers
      this.connection.on("MedicationReminder", (notification: MedicationReminderNotification) => {
        this.notifyCallbacks(notification);
      });

      this.connection.on("MedicationTaken", (notification: MedicationTakenNotification) => {
        this.notifyCallbacks(notification);
      });

      this.connection.onclose((error) => {
        console.log("WebSocket connection closed", error);
        this.isConnecting = false;
      });

      this.connection.onreconnecting((error) => {
        console.log("WebSocket reconnecting", error);
      });

      this.connection.onreconnected((connectionId) => {
        console.log("WebSocket reconnected", connectionId);
      });

      await this.connection.start();
      console.log("WebSocket connected");

      // Join member groups if needed (can be called after connection)
    } catch (error) {
      console.error("Failed to connect to WebSocket", error);
      this.isConnecting = false;
      throw error;
    } finally {
      this.isConnecting = false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log("WebSocket disconnected");
      } catch (error) {
        console.error("Error disconnecting WebSocket", error);
      }
      this.connection = null;
    }
    this.callbacks = [];
  }

  async joinMemberGroup(memberId: string): Promise<void> {
    if (this.connection?.state === SignalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke("JoinMemberGroup", memberId);
      } catch (error) {
        console.error("Failed to join member group", error);
      }
    }
  }

  async leaveMemberGroup(memberId: string): Promise<void> {
    if (this.connection?.state === SignalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke("LeaveMemberGroup", memberId);
      } catch (error) {
        console.error("Failed to leave member group", error);
      }
    }
  }

  onNotification(callback: NotificationCallback): () => void {
    this.callbacks.push(callback);
    // Return unsubscribe function
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  private notifyCallbacks(notification: MedicationReminderNotification | MedicationTakenNotification): void {
    this.callbacks.forEach((callback) => {
      try {
        callback(notification);
      } catch (error) {
        console.error("Error in notification callback", error);
      }
    });
  }

  getConnectionState(): SignalR.HubConnectionState | null {
    return this.connection?.state ?? null;
  }

  isConnected(): boolean {
    return this.connection?.state === SignalR.HubConnectionState.Connected;
  }
}

export const websocketService = new WebSocketService();

