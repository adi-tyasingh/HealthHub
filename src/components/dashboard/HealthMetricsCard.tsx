import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Heart, Weight } from "lucide-react";

interface MetricProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "stable";
}

const Metric = ({ title, value, icon, trend }: MetricProps) => (
  <div className="flex items-center gap-4 p-4 rounded-lg bg-white/50">
    <div className="p-3 rounded-full bg-primary/10 text-primary">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  </div>
);

const HealthMetricsCard = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Health Metrics</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <Metric
          title="Heart Rate"
          value="72 bpm"
          icon={<Heart className="w-5 h-5" />}
        />
        <Metric
          title="Activity"
          value="7,234 steps"
          icon={<Activity className="w-5 h-5" />}
        />
        <Metric
          title="Weight"
          value="68 kg"
          icon={<Weight className="w-5 h-5" />}
        />
      </CardContent>
    </Card>
  );
};

export default HealthMetricsCard;