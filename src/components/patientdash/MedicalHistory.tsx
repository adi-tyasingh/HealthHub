import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Pill, Stethoscope } from "lucide-react";

const MedicalHistory = () => {
  const history = [
    {
      date: "2024-02-15",
      type: "Visit",
      title: "Annual Check-up",
      icon: <Stethoscope className="w-4 h-4" />,
    },
    {
      date: "2024-02-01",
      type: "Prescription",
      title: "Amoxicillin 500mg",
      icon: <Pill className="w-4 h-4" />,
    },
    {
      date: "2024-01-15",
      type: "Report",
      title: "Blood Test Results",
      icon: <FileText className="w-4 h-4" />,
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Medical History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-600">{item.type}</p>
              </div>
              <p className="text-sm text-gray-600">{item.date}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalHistory;