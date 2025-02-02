import { db } from "@/lib/db";

export async function GET() {
  try {
    // You can add search parameters if needed, but for this example, it's just fetching all doctors.
// Example of optional query param

    const doctors =  await db.doctor.findMany(); // Fetch all doctors if no specialty is provided
    console.log(doctors);
    return new Response(
      JSON.stringify({ success: true, data: doctors }),
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
