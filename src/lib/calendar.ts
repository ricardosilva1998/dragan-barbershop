import { createEvent, type EventAttributes } from "ics";

interface AppointmentData {
  customerName: string;
  customerEmail: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:MM
}

export function generateICS(appointment: AppointmentData): string | null {
  const [year, month, day] = appointment.date.split("-").map(Number);
  const [hour, minute] = appointment.timeSlot.split(":").map(Number);

  const event: EventAttributes = {
    start: [year, month, day, hour, minute],
    duration: { minutes: 30 },
    title: "Barbershop Dragan - Appointment",
    description: `Appointment for ${appointment.customerName}`,
    location: "Barbershop Dragan, Oeiras, Portugal",
    status: "CONFIRMED",
    organizer: { name: "Barbershop Dragan", email: "barbershop@placeholder.com" },
    attendees: [
      {
        name: appointment.customerName,
        email: appointment.customerEmail,
        rsvp: true,
        partstat: "ACCEPTED",
        role: "REQ-PARTICIPANT",
      },
    ],
  };

  const { error, value } = createEvent(event);
  if (error) {
    console.error("ICS generation error:", error);
    return null;
  }
  return value ?? null;
}

export function getGoogleCalendarUrl(appointment: AppointmentData): string {
  const [year, month, day] = appointment.date.split("-").map(Number);
  const [hour, minute] = appointment.timeSlot.split(":").map(Number);

  const startDate = new Date(year, month - 1, day, hour, minute);
  const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);

  const format = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Barbershop Dragan - Appointment",
    dates: `${format(startDate)}/${format(endDate)}`,
    details: `Appointment for ${appointment.customerName}`,
    location: "Barbershop Dragan, Oeiras, Portugal",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
