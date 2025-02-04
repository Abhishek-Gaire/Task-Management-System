import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "./ui/card";
import { AnalyticsData } from "@/utils/types";

interface TaskAnalyticsProps {
  data: AnalyticsData[];
}

export const TaskAnalytics = ({ data }: TaskAnalyticsProps) => {
  return (
    <Card className="p-4 mt-6">
      <h3 className="text-lg font-semibold mb-4">Task Analytics</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="tasks" fill="#3b82f6" name="Tasks" />
            <Bar dataKey="timeSpent" fill="#10b981" name="Time Spent (hours)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
