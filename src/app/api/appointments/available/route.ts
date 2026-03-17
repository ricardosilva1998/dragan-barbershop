import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/slots";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD" }, { status: 400 });
  }

  const slots = await getAvailableSlots(date);
  return NextResponse.json({ slots });
}
