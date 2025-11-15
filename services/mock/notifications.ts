export type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: "medication" | "reminder" | "system";
};

export const notificationsMock: Notification[] = [
  {
    id: "1",
    title: "Hora do remédio Clonazepan!",
    message: "É hora de tomar seu medicamento Clonazepan - 2mg",
    timestamp: "Há 9 minutos",
    isRead: false,
    type: "medication",
  },
  {
    id: "2",
    title: "Hora do remédio Clonazepan!",
    message: "É hora de tomar seu medicamento Clonazepan - 2mg",
    timestamp: "Há 8 horas",
    isRead: false,
    type: "medication",
  },
  {
    id: "3",
    title: "Hora do remédio Clonazepan!",
    message: "É hora de tomar seu medicamento Clonazepan - 2mg",
    timestamp: "Há 16 horas",
    isRead: false,
    type: "medication",
  },
  {
    id: "4",
    title: "Hora do remédio Clonazepan!",
    message: "É hora de tomar seu medicamento Clonazepan - 2mg",
    timestamp: "Há 1 dia",
    isRead: true,
    type: "medication",
  },
  {
    id: "5",
    title: "Lembrete de consulta",
    message: "Você tem uma consulta agendada para amanhã às 14h",
    timestamp: "Há 2 dias",
    isRead: true,
    type: "reminder",
  },
  {
    id: "6",
    title: "Lembrete de consulta",
    message: "Você tem uma consulta agendada para amanhã às 14h",
    timestamp: "Há 2 dias",
    isRead: true,
    type: "reminder",
  },
  {
    id: "7",
    title: "Lembrete de consulta",
    message: "Você tem uma consulta agendada para amanhã às 14h",
    timestamp: "Há 2 dias",
    isRead: true,
    type: "reminder",
  },
  {
    id: "8",
    title: "Lembrete de consulta",
    message: "Você tem uma consulta agendada para amanhã às 14h",
    timestamp: "Há 2 dias",
    isRead: true,
    type: "reminder",
  },
];
