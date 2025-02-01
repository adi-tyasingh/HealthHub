import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mockData = [
  { date: "Mon", intensity: 3 },
  { date: "Tue", intensity: 2 },
  { date: "Wed", intensity: 4 },
  { date: "Thu", intensity: 3 },
  { date: "Fri", intensity: 1 },
  { date: "Sat", intensity: 2 },
  { date: "Sun", intensity: 1 },
];

const SymptomTracker = () => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Symptom Tracker</CardTitle>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Log Symptom
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="intensity"
                stroke="#0D9488"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SymptomTracker;