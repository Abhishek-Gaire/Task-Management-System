import { Draggable } from "react-beautiful-dnd";
import { useState } from "react";
import { gsap } from "gsap";

import { TaskEditor } from "./task/TaskEditor";
import { TaskView } from "./task/TaskView";
import { Task, TaskCardProps } from "@/utils/types";
import { Card } from "@/components/ui/card";

export const TaskCard = ({
  task,
  index,
  onDelete,
  onEdit,
  children,
}: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (updatedTask: Task) => {
    onEdit(updatedTask);
    setIsEditing(false);

    gsap.to(`#task-${task.id}`, {
      scale: 1.05,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
    });
  };

  const handleDeleteClick = () => {
    gsap.to(`#task-${task.id}`, {
      opacity: 0,
      x: -20,
      duration: 0.3,
      ease: "power2.in",
      onComplete: onDelete,
    });
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          id={`task-${task.id}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-3"
        >
          <Card className="p-4 hover:animate-card-hover cursor-pointer bg-card shadow-sm hover:shadow-md transition-shadow">
            {isEditing ? (
              <TaskEditor
                task={task}
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <TaskView
                task={task}
                onEdit={() => setIsEditing(true)}
                onDelete={handleDeleteClick}
              >
                {children}
              </TaskView>
            )}
          </Card>
        </div>
      )}
    </Draggable>
  );
};
