"use client";
import React from "react";
import { usePathname } from "next/navigation";
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

const DoctorDashboard = () => {
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const pathname = usePathname();
  const doctorId = pathname.split("/")[2]; // Assuming doctorId is the last segment in the URL

  React.useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(`/api/getAppointment?doctorId=${doctorId}`, {
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
        setError("Failed to load patient data.");
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchPatients();
    } else {
      setLoading(false);
      setError("Doctor ID is missing in the URL.");
    }
  }, [doctorId]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Doctor's Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center">
              <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
            </div>
          ) : error ? (
            <Alert>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDashboard;
