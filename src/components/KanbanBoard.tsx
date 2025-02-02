import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Clock } from "lucide-react";
import { BoardState } from "@/utils/types";
import { ActivityLog, getActivityLogs } from "@/utils/activityLogger";

const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY || "kanban_board_tasks";
const MAX_TASKS = 5;
const MAX_HISTORY = 10;

export const KanbanBoard = () => {
  const [boardState, setBoardState] = useState<BoardState>({
    past: [],
    present: [
      { id: "todo", title: "To Do", tasks: [] },
      { id: "inProgress", title: "In Progress", tasks: [] },
      { id: "done", title: "Done", tasks: [] },
    ],
    future: [],
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [analyticsData, setAnalyticsData] = useState([]);

  useEffect(() => {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    if (storedTasks) {
      setBoardState((prev) => ({
        ...prev,
        present: JSON.parse(storedTasks),
      }));
    }
    setActivityLogs(getActivityLogs());
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(boardState.present));
  }, [boardState.present]);

  return <div className="p-6"></div>;
};
