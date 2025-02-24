import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Clock } from "lucide-react";

import { BoardState, Column, Task } from "@/utils/types";
import {
  ActivityLog,
  getActivityLogs,
  logActivity,
} from "@/utils/activityLogger";

import { BoardHeader } from "./board/BoardHeader";
import { TaskAnalytics } from "./TaskAnalytics";
import { BoardColumn } from "./board/BoardColumn";

import {
  exportBoard,
  handleKeyboardShortcut,
  importBoard,
} from "@/utils/boardUtils";

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
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(boardState.present));
  }, [boardState.present]);

  const pushToHistory = (newPresent: Column[]) => {
    setBoardState((prev) => ({
      past: [...prev.past, prev.present].slice(-MAX_HISTORY),
      present: newPresent,
      future: [],
    }));
  };

  const handleUndo = () => {
    if (boardState.past.length === 0) return;

    setBoardState((prev) => ({
      past: prev.past.slice(0, -1),
      present: prev.past[prev.past.length - 1],
      future: [prev.present, ...prev.future],
    }));
    toast.info("Action undone");
  };

  const handleRedo = () => {
    if (boardState.future.length === 0) return;

    setBoardState((prev) => ({
      past: [...prev.past, prev.present],
      present: prev.future[0],
      future: prev.future.slice(1),
    }));
    toast.info("Action redone");
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      const column = boardState.present.find(
        (col) => col.id === source.droppableId
      );
      if (!column) return;

      const newTasks = Array.from(column.tasks);
      const [removed] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, removed);

      pushToHistory(
        boardState.present.map((col) =>
          col.id === source.droppableId ? { ...col, tasks: newTasks } : col
        )
      );
    } else {
      const sourceColumn = boardState.present.find(
        (col) => col.id === source.droppableId
      );
      const destColumn = boardState.present.find(
        (col) => col.id === destination.droppableId
      );

      if (!sourceColumn || !destColumn) return;

      const sourceTasks = Array.from(sourceColumn.tasks);
      const destTasks = Array.from(destColumn.tasks);
      const [removed] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, removed);

      pushToHistory(
        boardState.present.map((col) => {
          if (col.id === source.droppableId) {
            return {
              ...col,
              tasks: sourceTasks,
            };
          }
          if (col.id === destination.droppableId) {
            return {
              ...col,
              tasks: destTasks,
            };
          }
          return col;
        })
      );
    }
  };

  const handleTaskCreate = (task: Task) => {
    const totalTasks = boardState.present.reduce(
      (sum, col) => sum + col.tasks.length,
      0
    );
    if (totalTasks >= MAX_TASKS) {
      toast.error("Maximum limit of 5 tasks reached!");
      return;
    }

    const newColumns = boardState.present.map((col) =>
      col.id === "todo" ? { ...col, tasks: [task, ...col.tasks] } : col
    );

    pushToHistory(newColumns);
    logActivity("create", task.id, `Created task: ${task.title}`);
    toast.success("Task Created Successfully");
  };

  const handleTaskDelete = (taskId: string) => {
    const newColumns = boardState.present.map((col) => ({
      ...col,
      tasks: col.tasks.filter((t) => t.id !== taskId),
    }));

    pushToHistory(newColumns);
    logActivity("delete", taskId, `Deleted task with ID: ${taskId}`);
  };

  const handleTaskEdit = (taskId: string, updatedTask: Task) => {
    const newColumns = boardState.present.map((col) => ({
      ...col,
      tasks: col.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
    }));

    pushToHistory(newColumns);
    logActivity("edit", taskId, `Edited task: ${updatedTask.title}`);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const importedData = await importBoard(file);
        pushToHistory(importedData);
        toast.success("Board imported successfully");
      } catch (error) {
        toast.error("Failed to import board");
      }
    }
  };

  const calculateAnalytics = () => {
    const data = boardState.present.map((column) => ({
      name: column.title,
      tasks: column.tasks.length,
      timeSpent:
        column.tasks.reduce((acc, task) => acc + (task.timeSpent || 0), 0) /
        3600,
    }));
    setAnalyticsData(data);
  };

  useEffect(() => {
    calculateAnalytics();
  }, [boardState.present]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handleKeyboardShortcut(e, {
        undo: handleUndo,
        redo: handleRedo,
        export: () => exportBoard(boardState.present),
        toggleTimer: () => {},
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [boardState]);
  return (
    <div className="p-6">
      <BoardHeader
        onTaskCreate={handleTaskCreate}
        onExport={() => exportBoard(boardState.present)}
        onImport={handleFileChange}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={boardState.past.length > 0}
        canRedo={boardState.future.length > 0}
      />
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {boardState.present.map((column) => (
            <BoardColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={column.tasks}
              onTaskDelete={handleTaskDelete}
              onTaskEdit={handleTaskEdit}
            />
          ))}
        </div>
      </DragDropContext>
      <TaskAnalytics data={analyticsData} />
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Recent Activity
        </h3>
        <div className="bg-secondary p-4 rounded-lg max-h-40 overflow-y-auto">
          {activityLogs.map((log) => (
            <div key={log.id} className="text-sm mb-2 text-muted-foreground">
              {new Date(log.timestamp).toLocaleString()}:{log.details}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
