import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Check, X } from "lucide-react";
import { Task, TaskEditorProps } from "@/utils/types";

const AVAILABLE_LABELS = [
  "Bug",
  "Feature",
  "Documentation",
  "Enhancement",
  "Urgent",
];

export const TaskEditor = ({ task, onSave, onCancel }: TaskEditorProps) => {
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedAssignee, setEditedAssignee] = useState(task.assignee || "");
  const [editedPriority, setEditedPriority] = useState<
    "low" | "medium" | "high"
  >(task.priority);
  const [editedLabels, setEditedLabels] = useState<string[]>(task.labels);
  const [isRecurring, setIsRecurring] = useState(task.isRecurring || false);
  const [recurrencePattern, setRecurrencePattern] = useState<
    "daily" | "weekly" | "monthly" | undefined
  >(task.recurrencePattern);

  const handleSave = () => {
    const updatedTask: Task = {
      ...task,
      title: editedTitle,
      description: editedDescription,
      assignee: editedAssignee || undefined,
      priority: editedPriority,
      labels: editedLabels,
      isRecurring,
      recurrencePattern: isRecurring ? recurrencePattern : undefined,
      nextRecurrence: isRecurring
        ? calculateNextRecurrence(recurrencePattern)
        : undefined,
    };
    onSave(updatedTask);
  };

  const calculateNextRecurrence = (
    pattern?: "daily" | "weekly" | "monthly"
  ) => {
    if (!pattern) return undefined;

    const now = new Date();
    switch (pattern) {
      case "daily":
        return new Date(now.setDate(now.getDate() + 1));
      case "weekly":
        return new Date(now.setDate(now.getDate() + 7));
      case "monthly":
        return new Date(now.setMonth(now.getMonth() + 1));
      default:
        return undefined;
    }
  };

  const toggleLabel = (label: string) => {
    if (editedLabels.includes(label)) {
      setEditedLabels(editedLabels.filter((l) => l !== label));
    } else {
      setEditedLabels([...editedLabels, label]);
    }
  };

  return (
    <div className="space-y-3">
      <Input
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        placeholder="Task title"
      />
      <Textarea
        value={editedDescription}
        onChange={(e) => setEditedDescription(e.target.value)}
        placeholder="Task description"
      />
      <Input
        value={editedAssignee}
        onChange={(e) => setEditedAssignee(e.target.value)}
        placeholder="Assignee name"
      />
      <Select
        value={editedPriority}
        onValueChange={(value: "low" | "medium" | "high") =>
          setEditedPriority(value)
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
          className="mr-2"
        />
        <span>Recurring Task</span>
      </div>
      {isRecurring && (
        <Select
          value={recurrencePattern}
          onValueChange={(value: "daily" | "weekly" | "monthly") =>
            setRecurrencePattern(value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select recurrence pattern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      )}
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_LABELS.map((label) => (
          <Badge
            key={label}
            variant={editedLabels.includes(label) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleLabel(label)}
          >
            {label}
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="default"
          onClick={handleSave}
          className="w-full"
        >
          <Check className="w-4 h-4 mr-1" /> Save
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onCancel}
          className="w-full"
        >
          <X className="w-4 h-4 mr-1" /> Cancel
        </Button>
      </div>
    </div>
  );
};
