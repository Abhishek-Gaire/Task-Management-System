import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

import { Task } from "@/utils/types";
import { toast } from "sonner";

interface CreateTaskDialogProps {
  onTaskCreate: (task: Task) => void;
}

const AVAILABLE_LABELS = [
  "Bug",
  "Feature",
  "Documentation",
  "Enhancement",
  "Urgent",
];

export const CreateTaskDialog = ({ onTaskCreate }: CreateTaskDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      assignee: assignee || undefined,
      priority,
      labels: selectedLabels,
      timeSpent: 0, // Initialize with 0
      progress: 0, // Initialize with 0
    };

    onTaskCreate(newTask);
    setOpen(false);
    setTitle("");
    setDescription("");
    setAssignee("");
    setPriority("medium");
    setSelectedLabels([]);
    toast.success("Task created successfully!");
  };

  const toggleLabel = (label: string) => {
    if (selectedLabels.includes(label)) {
      setSelectedLabels(selectedLabels.filter((l) => l !== label));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4">Create New Task</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Textarea
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Input
              placeholder="Assignee name"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            />
          </div>
          <div>
            <Select
              value={priority}
              onValueChange={(value: "low" | "medium" | "high") =>
                setPriority(value)
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
          </div>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_LABELS.map((label) => (
              <Badge
                key={label}
                variant={selectedLabels.includes(label) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleLabel(label)}
              >
                {label}
              </Badge>
            ))}
          </div>
          <Button type="submit" className="w-full">
            Create Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
