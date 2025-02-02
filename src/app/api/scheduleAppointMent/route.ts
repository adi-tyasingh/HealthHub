// /app/api/appointments/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";  // Make sure to import your Prisma client

// Define the data structure expected in the request body
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Extract fields from the incoming request
    const { doctorId, patientId, date, reason } = body;
    console.log({doctorId, patientId, date, reason});
    // const doctor = await db.doctor.findFirst({ where: { name } });
    // const doctorId = doctor?.id || "";

    // Create an appointment record in the database
    const appointment = await db.appointment.create({
      data: {
        doctorId,
        patientId,
        date,
        // time,
        reason,
      },
    });

    // Return success response
    return NextResponse.json({ success: true, appointment });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json({ success: false, message: "Error creating appointment" }, { status: 500 });
  }
}
