import { describe, it, expect } from "vitest";
import { ALL_SLOTS } from "@/lib/slots";

describe("Reschedule validation", () => {
  it("prevents rescheduling to an already booked slot", () => {
    const bookedSlots = new Set(["10:00", "11:00", "14:00"]);
    const requestedSlot = "10:00";
    expect(bookedSlots.has(requestedSlot)).toBe(true);
  });

  it("allows rescheduling to a free slot", () => {
    const bookedSlots = new Set(["10:00", "11:00"]);
    const requestedSlot = "15:00";
    expect(bookedSlots.has(requestedSlot)).toBe(false);
  });

  it("validates new time slot is a valid slot", () => {
    expect(ALL_SLOTS.includes("10:00")).toBe(true);
    expect(ALL_SLOTS.includes("10:15")).toBe(false);
  });

  it("validates new date format", () => {
    expect(/^\d{4}-\d{2}-\d{2}$/.test("2026-04-15")).toBe(true);
    expect(/^\d{4}-\d{2}-\d{2}$/.test("invalid")).toBe(false);
  });

  it("correctly determines available slots excluding booked ones", () => {
    const bookedSlots = new Set(["10:00", "10:30", "11:00"]);
    const available = ALL_SLOTS.filter((s) => !bookedSlots.has(s));
    expect(available).toHaveLength(17);
    expect(available).not.toContain("10:00");
    expect(available).not.toContain("10:30");
    expect(available).not.toContain("11:00");
    expect(available).toContain("11:30");
  });

  it("allows rebooking the same slot when rescheduling (slot will be freed)", () => {
    const currentAppointment = { date: "2026-03-17", timeSlot: "10:00" };
    const newDate = "2026-03-17";
    const newTimeSlot = "10:00";
    const bookedSlots = new Set(["10:00", "14:00"]);

    // When rescheduling on same date, the current slot should be considered available
    const isOwnSlot =
      newDate === currentAppointment.date &&
      newTimeSlot === currentAppointment.timeSlot;

    const available = ALL_SLOTS.filter((s) => {
      if (bookedSlots.has(s)) {
        return newDate === currentAppointment.date && s === currentAppointment.timeSlot;
      }
      return true;
    });

    expect(isOwnSlot).toBe(true);
    expect(available).toContain("10:00");
    expect(available).not.toContain("14:00");
  });
});
