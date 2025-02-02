export interface Task {
  id: string;
  title: string;
  description: string;
  assignee?: string;
  priority: "low" | "medium" | "high";
  labels: string[];
  isRecurring?: boolean;
  recurrencePattern?: "daily" | "weekly" | "monthly";
  nextRecurrence?: Date;
  dueDate?: Date;
  timeSpent: number;
  progress: number;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export interface BoardState {
  past: Column[][];
  present: Column[];
  future: Column[][];
}
