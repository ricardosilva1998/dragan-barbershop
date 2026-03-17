import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../../../auth";
import { sendCancellationEmail } from "@/lib/email";

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

  const updated = await prisma.appointment.update({
    where: { id },
    data: { status: "cancelled" },
  });

  // Send cancellation email
  sendCancellationEmail({
    customerName: appointment.customerName,
    customerEmail: appointment.customerEmail,
    customerPhone: appointment.customerPhone,
    date: appointment.date,
    timeSlot: appointment.timeSlot,
  });

  return NextResponse.json({ appointment: updated });
}
