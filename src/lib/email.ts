import { Resend } from "resend";
import { generateICS, getGoogleCalendarUrl } from "./calendar";

// Escapes characters with special HTML meaning to prevent injection into
// email bodies where user-supplied values are interpolated directly.
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const resend = new Resend(process.env.RESEND_API_KEY);

interface AppointmentData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  timeSlot: string;
}

export async function sendConfirmationEmail(appointment: AppointmentData) {
  const icsContent = generateICS(appointment);
  const googleCalUrl = getGoogleCalendarUrl(appointment);
  const safeName = escapeHtml(appointment.customerName);

  const formattedDate = new Date(appointment.date + "T00:00:00").toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  try {
    await resend.emails.send({
      from: "Barbershop Dragan <onboarding@resend.dev>",
      to: appointment.customerEmail,
      subject: `Appointment Confirmed - ${formattedDate} at ${appointment.timeSlot}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #e5e5e5; padding: 32px; border-radius: 8px;">
          <h1 style="color: #d4a017; margin-bottom: 24px;">Barbershop Dragan</h1>
          <h2 style="color: #f5f5f5;">Appointment Confirmed!</h2>
          <p>Hello <strong>${safeName}</strong>,</p>
          <p>Your appointment has been confirmed:</p>
          <div style="background: #2a2a2a; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #d4a017;">
            <p style="margin: 4px 0;"><strong>Date:</strong> ${formattedDate}</p>
            <p style="margin: 4px 0;"><strong>Time:</strong> ${appointment.timeSlot}</p>
            <p style="margin: 4px 0;"><strong>Duration:</strong> 30 minutes</p>
            <p style="margin: 4px 0;"><strong>Location:</strong> Barbershop Dragan, Oeiras, Portugal</p>
          </div>
          <p><a href="${googleCalUrl}" style="color: #d4a017;">Add to Google Calendar</a></p>
          <p style="color: #999; font-size: 14px; margin-top: 32px;">
            If you need to cancel, please contact us. An .ics calendar file is attached.
          </p>
        </div>
      `,
      attachments: icsContent
        ? [
            {
              filename: "appointment.ics",
              content: Buffer.from(icsContent).toString("base64"),
              contentType: "text/calendar",
            },
          ]
        : undefined,
    });
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
  }
}

export async function sendCancellationEmail(appointment: AppointmentData) {
  const safeName = escapeHtml(appointment.customerName);
  const formattedDate = new Date(appointment.date + "T00:00:00").toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  try {
    await resend.emails.send({
      from: "Barbershop Dragan <onboarding@resend.dev>",
      to: appointment.customerEmail,
      subject: `Appointment Cancelled - ${formattedDate} at ${appointment.timeSlot}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #e5e5e5; padding: 32px; border-radius: 8px;">
          <h1 style="color: #d4a017; margin-bottom: 24px;">Barbershop Dragan</h1>
          <h2 style="color: #f5f5f5;">Appointment Cancelled</h2>
          <p>Hello <strong>${safeName}</strong>,</p>
          <p>Your appointment has been cancelled:</p>
          <div style="background: #2a2a2a; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #dc2626;">
            <p style="margin: 4px 0;"><strong>Date:</strong> ${formattedDate}</p>
            <p style="margin: 4px 0;"><strong>Time:</strong> ${appointment.timeSlot}</p>
          </div>
          <p>If you'd like to rebook, please visit our website.</p>
          <p style="color: #999; font-size: 14px; margin-top: 32px;">
            Barbershop Dragan, Oeiras, Portugal
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send cancellation email:", error);
  }
}

interface RescheduleData {
  customerName: string;
  customerEmail: string;
  oldDate: string;
  oldTimeSlot: string;
  newDate: string;
  newTimeSlot: string;
}

export async function sendRescheduleEmail(data: RescheduleData) {
  const formatD = (d: string) =>
    new Date(d + "T00:00:00").toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const safeName = escapeHtml(data.customerName);
  const oldFormatted = formatD(data.oldDate);
  const newFormatted = formatD(data.newDate);

  const googleCalUrl = getGoogleCalendarUrl({
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    date: data.newDate,
    timeSlot: data.newTimeSlot,
  });

  try {
    const icsContent = generateICS({
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      date: data.newDate,
      timeSlot: data.newTimeSlot,
    } as AppointmentData);

    await resend.emails.send({
      from: "Barbershop Dragan <onboarding@resend.dev>",
      to: data.customerEmail,
      subject: `Appointment Rescheduled - ${newFormatted} at ${data.newTimeSlot}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #e5e5e5; padding: 32px; border-radius: 8px;">
          <h1 style="color: #d4a017; margin-bottom: 24px;">Barbershop Dragan</h1>
          <h2 style="color: #f5f5f5;">Appointment Rescheduled</h2>
          <p>Hello <strong>${safeName}</strong>,</p>
          <p>Your appointment has been rescheduled:</p>
          <div style="background: #2a2a2a; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #dc2626;">
            <p style="margin: 4px 0; text-decoration: line-through; color: #999;"><strong>Was:</strong> ${oldFormatted} at ${data.oldTimeSlot}</p>
          </div>
          <div style="background: #2a2a2a; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #16a34a;">
            <p style="margin: 4px 0;"><strong>New Date:</strong> ${newFormatted}</p>
            <p style="margin: 4px 0;"><strong>New Time:</strong> ${data.newTimeSlot}</p>
            <p style="margin: 4px 0;"><strong>Duration:</strong> 30 minutes</p>
            <p style="margin: 4px 0;"><strong>Location:</strong> Barbershop Dragan, Oeiras, Portugal</p>
          </div>
          <p><a href="${googleCalUrl}" style="color: #d4a017;">Add to Google Calendar</a></p>
          <p style="color: #999; font-size: 14px; margin-top: 32px;">
            If you need to cancel, please contact us.
          </p>
        </div>
      `,
      attachments: icsContent
        ? [
            {
              filename: "appointment.ics",
              content: Buffer.from(icsContent).toString("base64"),
              contentType: "text/calendar",
            },
          ]
        : undefined,
    });
  } catch (error) {
    console.error("Failed to send reschedule email:", error);
  }
}
