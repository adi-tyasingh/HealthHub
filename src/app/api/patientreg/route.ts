import { db } from "@/lib/db";
import { redirect } from "next/dist/server/api-utils";
import { z } from "zod";

const patientSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  formData: z.record(z.any()),
  history: z.record(z.any()), // For the patient history
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = patientSchema.parse(body);

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
    const newPatient = await db.patient.create({
      data: {
        userId: validatedData.userId,
        patientData: validatedData.formData, // Store form data in patientData
        history: {}, 
      },
    });

    // Structure the response as requested
    const response = {
      userId: newPatient.userId,
      patientData: newPatient.patientData,
      history: newPatient.history
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