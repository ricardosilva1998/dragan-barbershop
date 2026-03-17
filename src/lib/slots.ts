import { prisma } from "./prisma";

// 30-minute slots from 10:00 to 19:30 (last appointment starts at 19:30, ends at 20:00)
export const ALL_SLOTS = [
  "10:00", "10:30",
  "11:00", "11:30",
  "12:00", "12:30",
  "13:00", "13:30",
  "14:00", "14:30",
  "15:00", "15:30",
  "16:00", "16:30",
  "17:00", "17:30",
  "18:00", "18:30",
  "19:00", "19:30",
];

export async function getAvailableSlots(date: string): Promise<string[]> {
  const booked = await prisma.appointment.findMany({
    where: { date, status: "booked" },
    select: { timeSlot: true },
  });

  const bookedSet = new Set(booked.map((a) => a.timeSlot));

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  return ALL_SLOTS.filter((slot) => {
    if (bookedSet.has(slot)) return false;
    // Filter out past slots if the date is today
    if (date === todayStr) {
      const [hours, minutes] = slot.split(":").map(Number);
      const slotTime = new Date(now);
      slotTime.setHours(hours, minutes, 0, 0);
      if (slotTime <= now) return false;
    }
    return true;
  });
}
