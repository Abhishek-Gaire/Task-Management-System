import { Droppable } from "react-beautiful-dnd";
import { TaskCard } from "../TaskCard";
import { TimeTracker } from "../TimeTracker";
import { BoardColumnProps } from "@/utils/types";

export const BoardColumn = ({
  id,
  title,
  tasks,
  onTaskDelete,
  onTaskEdit,
}: BoardColumnProps) => {
  return (
    <div className="bg-secondary p-4 rounded-lg shadow-sm">
      <h2 className="font-semibold mb-4 text-lg">{title}</h2>
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="min-h-[200px]"
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onDelete={() => onTaskDelete(task.id)}
                onEdit={(updatedTask) => onTaskEdit(task.id, updatedTask)}
              >
                <TimeTracker
                  taskId={task.id}
                  onTimeUpdate={(taskId, duration) => {
                    const updatedTask = { ...task, timeSpent: duration };
                    onTaskEdit(taskId, updatedTask);
                  }}
                />
              </TaskCard>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
