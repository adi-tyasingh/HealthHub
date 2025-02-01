import z from 'zod';
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

export async function POST(req: Request) {

}