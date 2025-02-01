import { db } from "@/lib/db";
import { z } from "zod";

const doctorSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  name: z.string().min(1, "Name is required"),
  degree: z.string().min(1, "Degree is required"),
  gender: z.string().min(1, "Gender is required"),
  address: z.string().min(1, "Address is required"),
  specialisation: z.string().min(1, "Specialisation is required"),
  phone: z.string().min(1, "Phone number is required").regex(/^\d{10}$/, "Invalid phone number"),

});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = doctorSchema.parse(body);

    console.log(validatedData);

    const user = await db.user.findUnique({
      where: { id: validatedData.userId },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create a new patient row 
    const newDoctor = await db.doctor.create({
      data: {
        userId: validatedData.userId,
        name: validatedData.name,
        degree: validatedData.degree,
        gender: validatedData.gender,
        address: validatedData.address,
        speciality: validatedData.specialisation,
        phone: validatedData.phone,


      },
    });

    // Structure the response as requested
    const response = {
      userId: newDoctor.userId,
      patientData: newDoctor.name,
      history: newDoctor.degree
    };

    return new Response(JSON.stringify({ success: true, data: response }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ success: false, errors: error.errors }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(
      JSON.stringify({ success: false, message: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}