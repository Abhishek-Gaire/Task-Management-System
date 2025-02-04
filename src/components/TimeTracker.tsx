import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Play, Pause } from "lucide-react";

import { Button } from "./ui/button";

interface TimeTrackerProps {
  taskId: string;
  onTimeUpdate: (taskId: string, duration: number) => void;
}

export const TimeTracker = ({ taskId, onTimeUpdate }: TimeTrackerProps) => {
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor(
          (now.getTime() - startTime.getTime()) / 1000
        );
        setElapsedTime(elapsed);
        onTimeUpdate(taskId, elapsed);
      }, 1000);
    }
  }, [isTracking, startTime, taskId, onTimeUpdate]);

  const toggleTimer = () => {
    if (!isTracking) {
      setStartTime(new Date());
      setIsTracking(true);
      toast.success("Time tracking started");
    } else {
      setIsTracking(false);
      setStartTime(null);
      toast.success("Time tracking stopped");
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <Button
        variant="outline"
        size="sm"
        onClick={toggleTimer}
        className="flex items-center gap-1"
      >
        {isTracking ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
        {formatTime(elapsedTime)}
      </Button>
    </div>
  );
};
