"use client";

import { ChatLayout } from "@/components/chat/chat-layout";
import { Message, useChat } from "ai/react";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
  } from "@/components/ui/select";
  import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

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
  symptoms: z.object({}).optional(),
});
// Type inference for form values
type AppointmentFormValues = z.infer<typeof appointmentSchema>;

export default function AppointmentForm({patientData}:{patientData:JSON}) {

       const form = useForm<AppointmentFormValues>({
         resolver: zodResolver(appointmentSchema),
         defaultValues: {
           doctorId: "",
           date: "",
           // time: "",
           reason: "",
           symptoms: patientData || {}
         },
       });

    const [showConfirmation, setShowConfirmation] = React.useState(false);
      const [doctors, setDoctors] = useState<any[]>([]);  // State for storing doctors
      const [loading, setLoading] = useState(true);  // State for loading indicator
      const [error, setError] = useState<string | null>(null);  // State for error handling
    
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

      
    const onSubmit = async (data: AppointmentFormValues) => {
        try {
          const response = await fetch("/api/scheduleAppointment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data }),
          });
  
          const responseData = await response.json();
          if (responseData.error) {
            toast.error("An error occurred. Please try again later.");
            return;
          }
          toast.success("Appointment booked successfully!");
        } catch (error) {
          toast.error("An error occurred. Please try again later.");
        }
      };
    return (
        <div className="flex h-[calc(100dvh)] flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Book Appointment</h1>
          <div className="p-4 bg-gray-100 rounded-xl shadow-md mb-4">
            <h2 className="text-xl font-bold mb-2">Patient Information</h2>
            <pre>{JSON.stringify(patientData, null, 2)}</pre>
          </div>
          <Card className="w-full max-w-md p-4">
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
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
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Appointment Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Appointment Time</FormLabel>
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
                            <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                            <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                            <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                            <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                            <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                            <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Book Appointment
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      );

}