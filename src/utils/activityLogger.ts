export interface ActivityLog {
  id: string;
  action: string;
  taskId: string;
  timestamps: Date;
  details: string;
}

const ACTIVITY_STORAGE_KEY =
  import.meta.env.VITE_ACTIVITY_STORAGE_KEY || "kanban_tasks_activity_log";

export const getActivityLogs = (): ActivityLog[] => {
  return JSON.parse(localStorage.getItem(ACTIVITY_STORAGE_KEY) || "[]");
};
