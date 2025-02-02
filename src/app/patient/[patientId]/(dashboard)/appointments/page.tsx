'use client'
import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";  
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";

// Define the form schema with Zod
const appointmentSchema = z.object({
  doctorId: z.string({
    required_error: "Please select a doctor",
  }),
  date: z
    .string({
      required_error: "Please select a date",
    })
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, "Please select a future date"),
  time:  z.string().optional(),
  reason: z.string().optional(),
});

// Infer TypeScript type from Zod schema
type AppointmentFormValues = z.infer<typeof appointmentSchema>;

const AppointmentScheduler: React.FC = () => {
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);  // State for storing doctors
  const [loading, setLoading] = useState(true);  // State for loading indicator
  const [error, setError] = useState<string | null>(null);  // State for error handling

  // Fetch doctors from the API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/getAvailableDoctor");  // API endpoint to fetch doctors
        const data = await response.json();  // Convert response to JSON
        console.log("hello",data.data);  // Log the response to check its structure
        
        if (Array.isArray(data.data)) {  // If the response itself is an array
          setDoctors(data.data);  // Set the doctors array
        } else if (data && Array.isArray(data.doctors)) {  // If the response contains a 'doctors' field
          setDoctors(data.doctors);  // Set the doctors array from the 'doctors' field
        } else {
          setError("Failed to load doctors.");
        }
      } catch (err) {
        setError("An error occurred while fetching doctors.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);
  

  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      doctorId: "",
      date: "",
      // time: "",
      reason: "",
    },
  });

  const onSubmit = async (data: AppointmentFormValues) => {
    console.log("Form submitted:", data);
  
    try {
      // Send the data to the backend API
      const response = await fetch('/api/scheduleAppointMent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId: data.doctorId,
          patientId: "cm6mtk19h0002ur1k1g89g2az" , // Make sure you get the patientId correctly
          date: data.date,
          // time: data.time,
          reason: data.reason || null,  // Optional reason field
        }),
      });
  
      const result = await response.json();
  
      if (result.success) {
        setShowConfirmation(true);  // Show confirmation on success
      } else {
        setError("Failed to schedule appointment.");
      }
    } catch (error) {
      setError("An error occurred while scheduling the appointment.");
    }
  };
  

  const getSelectedDoctor = (id: string) => {
    return doctors.find((d) => d.id === id);
  };

  if (loading) return <div>Loading doctors...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Book an Appointment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Doctor Selection */}
              <FormField
                control={form.control}
                name="doctorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doctor</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a doctor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {doctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            {doctor.name} - {doctor.speciality}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date Selection */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <input
                        type="date"
                        className="w-full p-2 border rounded-md"
                        min={new Date().toISOString().split("T")[0]}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Time Selection */}
              {/* <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                     
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for appointment</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter reason.." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Schedule Appointment
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {showConfirmation && (
        <Alert className="mt-4">
          <AlertDescription>
            Appointment scheduled successfully with{" "}
            {getSelectedDoctor(form.getValues("doctorId"))?.name} on{" "}
            {new Date(form.getValues("date")).toLocaleDateString()} at{" "}
            {form.getValues("time")}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AppointmentScheduler;
