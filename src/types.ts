export enum TaskStatus {
  PENDING = 'pending',
  OVERDUE = 'overdue',
  PAID = 'paid',
}

export interface Task {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  notes: string;
  status: TaskStatus;
  createdAt: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
}

export type Language = 'en' | 'pt' | 'it' | 'fr';
