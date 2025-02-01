'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form';
import { toast } from 'react-toastify';

interface PatientData{
   fullName: string; dob?: Date; gender: string; contactNumber: string; email: string; address: string; bloodType: string; weight: string; height: string; allergen?: string; chronicCondition?: string; previousSurgeries?: string; ongoingMedications?: string;

 }

const   formSchema = z.object({
  fullName: z.string().min(1, 'Full Name is required'),
  dob: z.date().optional(),
  gender: z.string().min(1, 'Gender is required'),
  contactNumber: z.string().min(10, 'Invalid contact number'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(1, 'Address is required'),
  bloodType: z.string().min(1, 'Blood type is required'),
  weight: z.string().min(1, 'Weight is required'),
  height: z.string().min(1, 'Height is required'),
  allergen: z.string().optional(),
  chronicCondition: z.string().optional(),
  previousSurgeries: z.string().optional(),
  ongoingMedications: z.string().optional(),
});


type formSchemaType = z.infer<typeof formSchema>;


const Page = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      dob: undefined,
      gender: '',
      contactNumber: '',
      email: '',
      address: '',
      bloodType: '',
      weight: '',
      height: '',
      allergen: '',
      chronicCondition: '',
      previousSurgeries: '',
      ongoingMedications: '',
    },
  });

  const onSubmit = async (data: formSchemaType ) => {
    try {
      const response = await fetch('/api/patientreg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (responseData.error) {
        toast.error('An error occurred. Please try again later.');
        return;
      }
      toast.success('Patinet updated!');
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField name="fullName" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="dob" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => field.onChange(date)}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="gender" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="contactNumber" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="email" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="address" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl><Textarea {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default Page;
