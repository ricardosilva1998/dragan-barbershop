import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../../auth";
import { sendConfirmationEmail } from "@/lib/email";
import { getGoogleCalendarUrl } from "@/lib/calendar";
import { ALL_SLOTS } from "@/lib/slots";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, date, timeSlot } = body;

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !date || !timeSlot) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    // Validate time slot
    if (!ALL_SLOTS.includes(timeSlot)) {
      return NextResponse.json({ error: "Invalid time slot" }, { status: 400 });
    }

    // Validate not in the past
    const now = new Date();
    const appointmentDate = new Date(date + "T" + timeSlot + ":00");
    if (appointmentDate < now) {
      return NextResponse.json({ error: "Cannot book appointments in the past" }, { status: 400 });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Check if slot exists
    const existing = await prisma.appointment.findUnique({
      where: { date_timeSlot: { date, timeSlot } },
    });

    let appointment;

    if (existing) {
      if (existing.status === "booked") {
        return NextResponse.json({ error: "This time slot is already booked" }, { status: 409 });
      }
      // Rebook a cancelled slot
      appointment = await prisma.appointment.update({
        where: { id: existing.id },
        data: {
          customerName,
          customerEmail,
          customerPhone,
          status: "booked",
          createdAt: new Date(),
        },
      });
    } else {
      appointment = await prisma.appointment.create({
        data: {
          customerName,
          customerEmail,
          customerPhone,
          date,
          timeSlot,
          status: "booked",
        },
      });
    }

    const googleCalendarUrl = getGoogleCalendarUrl({
      customerName,
      customerEmail,
      date,
      timeSlot,
    });

    // Send confirmation email (fire and forget)
    sendConfirmationEmail({ customerName, customerEmail, customerPhone, date, timeSlot });

    return NextResponse.json({
      appointment,
      googleCalendarUrl,
    }, { status: 201 });
  } catch (error: unknown) {
    // Handle unique constraint violation (double-booking race condition)
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "This time slot has just been booked" },
        { status: 409 }
      );
    }
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // This route returns all appointments (admin use)
  // Optionally filter by date
  const appointments = await prisma.appointment.findMany({
    orderBy: [{ date: "asc" }, { timeSlot: "asc" }],
  });

  return NextResponse.json({ appointments });
}
