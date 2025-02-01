import HealthMetricsCard from "@/components/patientdash/HealthMetricsCard";
import SymptomTracker from "@/components/patientdash/SymptomTracker";
import AIHealthAssistant from "@/components/patientdash/AIHealthAssistant";
import MedicalHistory from "@/components/patientdash/MedicalHistory";
import { User } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">HealthDash</h1>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-primary/10">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-gray-600">Patient ID: 12345</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid gap-8">
          <HealthMetricsCard />
          <div className="grid gap-8 md:grid-cols-2">
            {/* <SymptomTracker /> */}
            <AIHealthAssistant />
          </div>
          <MedicalHistory />
        </div>
      </main>
    </div>
  );
};

export default Index;