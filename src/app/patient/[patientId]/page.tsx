'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSession } from 'next-auth/react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { toast } from 'react-toastify';

const formSchema = z.object({
  fullName: z.string().min(1, 'Full Name is required'),
  dob: z.date().optional(),
  gender: z.enum(['Male', 'Female', 'Other'], { message: 'Gender is required' }),
  contactNumber: z.string().regex(/^\d{10}$/, 'Invalid contact number'),
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

type FormSchemaType = z.infer<typeof formSchema>;

const Page = (  {
  params,
}: {
  params: { patientId: string };
}) => {
  console.log("params",params)
  const session = useSession();
  console.log(session)
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      dob: undefined,
      gender: undefined,
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

  const onSubmit = async (data: FormSchemaType) => {
    const patient = {
      userId:params.patientId,
      formData: data,
      history: {},

    }
    try {
      const response = await fetch('/api/patientreg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient),
      });

      const responseData = await response.json();
      if (responseData.error) {
        toast.error('An error occurred. Please try again later.');
        return;
      }
      toast.success('Patient updated!');
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <FormField name="fullName" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Date of Birth */}
          <Controller
            name="dob"
            control={form.control}
            render={({ field }) => (
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
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Gender */}
          <FormField name="gender" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          {/* Contact Number */}
          <FormField name="contactNumber" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl><Input {...field} type="tel" maxLength={10} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Email */}
          <FormField name="email" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input {...field} type="email" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Address */}
          <FormField name="address" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Blood Type */}
          <FormField name="bloodType" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Blood Type</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Weight */}
          <FormField name="weight" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Weight (kg)</FormLabel>
              <FormControl><Input {...field} type="number" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Height */}
          <FormField name="height" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Height (cm)</FormLabel>
              <FormControl><Input {...field} type="number" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="allergen" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Allergies </FormLabel>
              <FormControl><Input {...field} type="string" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="chronicCondition" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>chronicCondition : </FormLabel>
              <FormControl><Input {...field} type="string" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="previousSurgeries" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>previousSurgeries </FormLabel>
              <FormControl><Input {...field} type="string" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField name="ongoingMedications" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>ongoingMedications </FormLabel>
              <FormControl><Input {...field} type="string" /></FormControl>
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
