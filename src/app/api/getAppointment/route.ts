import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    // Extract doctorId from the URL parameters
    const url = new URL(request.url);
    const doctorId = url.searchParams.get("doctorId");

    if (!doctorId) {
      return new Response(
        JSON.stringify({ success: false, message: "doctorId is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch appointments related to the doctorId
    const appointments = await db.appointment.findMany({
      where: {
        doctorId: doctorId, // Filter appointments based on doctorId
      },
      include: {
        doctor: true,  // Include doctor details if needed
        patient: true, // Include patient details if needed
      },
    });

    if (appointments.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No appointments found for this doctor" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: appointments }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
