import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, RefreshCw } from "lucide-react";
import { TaskViewProps } from "@/utils/types";

const PRIORITY_COLORS = {
  low: "bg-blue-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
};

export const TaskView = ({
  task,
  onEdit,
  onDelete,
  children,
}: TaskViewProps) => {
  return (
    <>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{task.title}</h3>
          {task.isRecurring && (
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={onEdit}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
      <div className="flex flex-wrap gap-2 mb-3">
        <Badge className={`${PRIORITY_COLORS[task.priority]} text-white`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </Badge>
        {task.labels.map((label) => (
          <Badge key={label} variant="secondary">
            {label}
          </Badge>
        ))}
      </div>
      {task.assignee && (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center text-xs">
              {task.assignee[0].toUpperCase()}
            </div>
          </Avatar>
          <span className="text-sm text-muted-foreground">{task.assignee}</span>
        </div>
      )}
      {task.isRecurring && task.nextRecurrence && (
        <div className="mt-2 text-sm text-muted-foreground">
          Next: {new Date(task.nextRecurrence).toLocaleDateString()}
        </div>
      )}
      {children}
    </>
  );
};
