'use client';

import React, { useState } from 'react';
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
import { cn } from '@/lib/utils';

interface FormData {
  fullName: string;
  dob: Date | undefined;
  gender: string;
  contactNumber: string;
  email: string;
  address: string;
  bloodType: string;
  weight: string;
  height: string;
  allergen: string;
  chronicCondition: string;
  previousSurgeries: string;
  ongoingMedications: string;
}

const Page = () => {
  const [stage, setStage] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
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
    ongoingMedications: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    console.log(formData);
    // Submit form data to the server or handle accordingly
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="relative h-2 bg-secondary rounded-full mb-4">
        <div
          className="absolute h-2 bg-primary rounded-full transition-all duration-300"
          style={{ width: `${stage === 1 ? 50 : 100}%` }}
        ></div>
      </div>

      {stage === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Basic Information</h2>
          <Input
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.dob && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dob ? format(formData.dob, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.dob}
                onSelect={(date) => setFormData({ ...formData, dob: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Select onValueChange={(value) => setFormData({ ...formData, gender: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Input
            name="contactNumber"
            type="tel"
            placeholder="Contact Number"
            value={formData.contactNumber}
            onChange={handleChange}
          />
          <Input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />
          <Textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />
          <Button onClick={() => setStage(2)}>Next</Button>
        </div>
      )}

      {stage === 2 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Medical Details</h2>
          <Select onValueChange={(value) => setFormData({ ...formData, bloodType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select Blood Type" />
            </SelectTrigger>
            <SelectContent>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            name="weight"
            type="number"
            placeholder="Weight kg"
            value={formData.weight}
            onChange={handleChange}
          />
          <Input
            name="height"
            type="number"
            placeholder="Height cm"
            value={formData.height}
            onChange={handleChange}
          />
          <Input
            name="allergen"
            placeholder="Allergies (separate with commas)"
            value={formData.allergen}
            onChange={handleChange}
          />
          <Input
            name="chronicCondition"
            placeholder="Chronic Conditions (separate with commas)"
            value={formData.chronicCondition}
            onChange={handleChange}
          />
          <Textarea
            name="previousSurgeries"
            placeholder="Previous Surgeries"
            value={formData.previousSurgeries}
            onChange={handleChange}
          />
          <Textarea
            name="ongoingMedications"
            placeholder="Ongoing Medications"
            value={formData.ongoingMedications}
            onChange={handleChange}
          />
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStage(1)}>Back</Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;