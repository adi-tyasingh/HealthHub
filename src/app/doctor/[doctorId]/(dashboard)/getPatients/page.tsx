"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface Patient {
  id: string;
  name: string;
  age: number;
  contact: string;
  condition: string;
}

interface DoctorDashboardProps {
  loading: boolean;
  error: string | null;
  patients: Patient[];
}

const DoctorDashboard = () => {
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(`/api/getAppointment`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }); 

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Patients Data:", data);
        setPatients(data);
      } catch (error) {
        console.error("Failed to fetch patients:", error);
        
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Doctor's Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
     
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Condition</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.contact}</TableCell>
                    <TableCell>{patient.condition}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDashboard;
