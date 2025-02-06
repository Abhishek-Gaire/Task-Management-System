export interface ActivityLog {
  id: string;
  action: string;
  taskId: string;
  timestamp: Date;
  details: string;
}

const ACTIVITY_STORAGE_KEY =
  import.meta.env.VITE_ACTIVITY_STORAGE_KEY || "kanban_tasks_activity_log";

export const getActivityLogs = (): ActivityLog[] => {
  return JSON.parse(localStorage.getItem(ACTIVITY_STORAGE_KEY) || "[]");
};

export const logActivity = (
  action: string,
  taskId: string,
  details: string
) => {
  const log: ActivityLog = {
    id: Date.now().toString(),
    action,
    taskId,
    timestamp: new Date(),
    details,
  };

  // ✅ Ensure existingLogs is always an array
  const existingLogs: ActivityLog[] = JSON.parse(
    localStorage.getItem(ACTIVITY_STORAGE_KEY) || "[]"
  );

  // ✅ Check if parsed value is actually an array (to prevent corruption)
  if (!Array.isArray(existingLogs)) {
    console.error("Corrupt activity log found in localStorage, resetting.");
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify([log]));
    return log;
  }

  // ✅ Keep the latest 50 logs
  const updatedLogs = [log, ...existingLogs].slice(0, 50);
  localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(updatedLogs));
  return log;
};
