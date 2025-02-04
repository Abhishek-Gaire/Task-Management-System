import { saveAs } from "file-saver";
import { Task } from "./types";

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export const exportBoard = (columns: Column[]) => {
  const data = JSON.stringify(columns, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  saveAs(blob, `kanban-board-${new Date().toISOString().split("T")[0]}.json`);
};

export const importBoard = async (file: File): Promise<Column[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        resolve(data);
      } catch (error) {
        reject(new Error("Invalid file format"));
      }
    };
    reader.readAsText(file);
  });
};

export const handleKeyboardShortcut = (
  e: KeyboardEvent,
  actions: {
    undo: () => void;
    redo: () => void;
    export: () => void;
    toggleTimer: (taskId: string) => void;
  }
) => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key.toLowerCase()) {
      case "z":
        if (!e.shiftKey) actions.undo();
        break;
      case "y":
        actions.redo();
        break;
      case "e":
        e.preventDefault();
        actions.export();
        break;
    }
  }
};
