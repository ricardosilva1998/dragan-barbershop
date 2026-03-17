import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../../../auth";
import { sendCancellationEmail, sendRescheduleEmail } from "@/lib/email";
import { ALL_SLOTS } from "@/lib/slots";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const appointment = await prisma.appointment.findUnique({ where: { id } });
  if (!appointment) {
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  }

  if (appointment.status === "cancelled") {
    return NextResponse.json({ error: "Appointment already cancelled" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const { action, newDate, newTimeSlot } = body as {
    action?: string;
    newDate?: string;
    newTimeSlot?: string;
  };

  if (action === "reschedule") {
    if (!newDate || !newTimeSlot) {
      return NextResponse.json({ error: "New date and time slot are required" }, { status: 400 });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    if (!ALL_SLOTS.includes(newTimeSlot)) {
      return NextResponse.json({ error: "Invalid time slot" }, { status: 400 });
    }

    // Check if the new slot is available
    const existing = await prisma.appointment.findUnique({
      where: { date_timeSlot: { date: newDate, timeSlot: newTimeSlot } },
    });

    if (existing && existing.status === "booked") {
      return NextResponse.json({ error: "This time slot is already booked" }, { status: 409 });
    }

    // Cancel old appointment
    await prisma.appointment.update({
      where: { id },
      data: { status: "cancelled" },
    });

    // Create or rebook new slot
    let newAppointment;
    if (existing) {
      newAppointment = await prisma.appointment.update({
        where: { id: existing.id },
        data: {
          customerName: appointment.customerName,
          customerEmail: appointment.customerEmail,
          customerPhone: appointment.customerPhone,
          status: "booked",
          createdAt: new Date(),
        },
      });
    } else {
      newAppointment = await prisma.appointment.create({
        data: {
          customerName: appointment.customerName,
          customerEmail: appointment.customerEmail,
          customerPhone: appointment.customerPhone,
          date: newDate,
          timeSlot: newTimeSlot,
          status: "booked",
        },
      });
    }

    // Send reschedule email
    sendRescheduleEmail({
      customerName: appointment.customerName,
      customerEmail: appointment.customerEmail,
      oldDate: appointment.date,
      oldTimeSlot: appointment.timeSlot,
      newDate,
      newTimeSlot,
    });

    return NextResponse.json({ appointment: newAppointment });
  }

  // Default: cancel
  const updated = await prisma.appointment.update({
    where: { id },
    data: { status: "cancelled" },
  });

  sendCancellationEmail({
    customerName: appointment.customerName,
    customerEmail: appointment.customerEmail,
    customerPhone: appointment.customerPhone,
    date: appointment.date,
    timeSlot: appointment.timeSlot,
  });

  return NextResponse.json({ appointment: updated });
}
