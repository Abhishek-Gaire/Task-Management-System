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

export interface BoardHeaderProps {
  onTaskCreate: (task: any) => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export interface BoardColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onTaskDelete: (taskId: string) => void;
  onTaskEdit: (taskId: string, updatedTask: Task) => void;
}

export interface TaskCardProps {
  task: Task;
  index: number;
  onDelete: () => void;
  onEdit: (task: Task) => void;
  children?: React.ReactNode;
}

export interface AnalyticsData {
  name: string;
  tasks: number;
  timeSpent: number;
}

export interface TaskViewProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  children?: React.ReactNode;
}

export interface TimeLog {
  taskId: string;
  startTime: Date;
  endTime?: Date;
}
