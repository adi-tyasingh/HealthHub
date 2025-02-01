'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

// Define the validation schema
const doctorFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  degree: z.string().min(2, "Degree must be at least 2 characters"),
  gender: z.string().min(1, "Please select a gender"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  specialisation: z.string().min(2, "Specialisation must be at least 2 characters"),
  contact: z.string().min(10, "Contact number must be at least 10 characters"),
})

// Type for our form
type DoctorFormValues = z.infer<typeof doctorFormSchema>

// Default values for the form
const defaultValues: Partial<DoctorFormValues> = {
  name: "",
  degree: "",
  gender: "",
  address: "",
  specialisation: "",
  contact: "",
}

export default function DoctorForm() {
  // Initialize the form
  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues,
  })

  // Handle form submission
  function onSubmit(data: DoctorFormValues) {
    console.log(data)
    // Handle the form submission here
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto bg-card rounded-lg border shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Doctor Information</h2>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Doctor Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Dr. John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="degree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Doctor Degree</FormLabel>
                  <FormControl>
                    <Input placeholder="MBBS, MD, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visiting Address</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter clinic/hospital address"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialisation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialisation</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Cardiology, Neurology" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Save Doctor Information
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}