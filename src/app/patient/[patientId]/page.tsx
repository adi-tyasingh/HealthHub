'use client';

import React, { useState } from 'react';
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
import { CalendarIcon, ChevronRight, ChevronLeft, User, Activity } from 'lucide-react';
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

const Page = ({ params }: { params: { patientId: string } }) => {
  const [phase, setPhase] = useState(1);
  const session = useSession();
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
      userId: params.patientId,
      formData: data,
      history: {},
    };
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="max-w-3xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className={`flex items-center ${phase === 1 ? 'text-green-600' : 'text-gray-400'}`}>
              <User className="w-6 h-6" />
              <span className="ml-2 font-medium">Personal Information</span>
            </div>
            <div className="w-24 h-1 mx-4 bg-gray-200">
              <div className={`h-full bg-green-500 transition-all ${phase === 2 ? 'w-full' : 'w-0'}`} />
            </div>
            <div className={`flex items-center ${phase === 2 ? 'text-green-600' : 'text-gray-400'}`}>
              <Activity className="w-6 h-6" />
              <span className="ml-2 font-medium">Medical Information</span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {phase === 1 ? (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Personal Information</h2>
                  <FormField name="fullName" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input {...field} className="border-gray-200" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

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

                  <FormField name="contactNumber" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl><Input {...field} type="tel" maxLength={10} className="border-gray-200" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField name="email" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input {...field} type="email" className="border-gray-200" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField name="address" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl><Input {...field} className="border-gray-200" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Medical Information</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField name="bloodType" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Type</FormLabel>
                        <FormControl><Input {...field} className="border-gray-200" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField name="weight" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl><Input {...field} type="number" className="border-gray-200" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField name="height" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl><Input {...field} type="number" className="border-gray-200" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField name="allergen" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allergies</FormLabel>
                      <FormControl><Input {...field} className="border-gray-200" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField name="chronicCondition" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chronic Conditions</FormLabel>
                      <FormControl><Input {...field} className="border-gray-200" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField name="previousSurgeries" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Previous Surgeries</FormLabel>
                      <FormControl><Input {...field} className="border-gray-200" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField name="ongoingMedications" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ongoing Medications</FormLabel>
                      <FormControl><Input {...field} className="border-gray-200" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              )}

              <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
                {phase === 2 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPhase(1)}
                    className="flex items-center"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                ) : (
                  <div></div>
                )}
                
                {phase === 1 ? (
                  <Button
                    type="button"
                    onClick={() => setPhase(2)}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Submit
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Page;