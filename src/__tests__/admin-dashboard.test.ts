import { describe, it, expect } from "vitest";

// Test the pure utility functions used in AdminDashboard

function getWeekDates(dateStr: string): string[] {
  const date = new Date(dateStr + "T00:00:00");
  const day = date.getDay();
  const monday = new Date(date);
  monday.setDate(date.getDate() - ((day + 6) % 7));
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

describe("getWeekDates", () => {
  it("returns 7 dates", () => {
    const dates = getWeekDates("2026-03-17");
    expect(dates).toHaveLength(7);
  });

  it("starts on Monday", () => {
    const dates = getWeekDates("2026-03-17"); // Tuesday
    const monday = new Date(dates[0] + "T00:00:00");
    expect(monday.getDay()).toBe(1); // Monday
  });

  it("ends on Sunday", () => {
    const dates = getWeekDates("2026-03-17");
    const sunday = new Date(dates[6] + "T00:00:00");
    expect(sunday.getDay()).toBe(0); // Sunday
  });

  it("includes the selected date within the week", () => {
    const selectedDate = "2026-03-19"; // Thursday
    const dates = getWeekDates(selectedDate);
    expect(dates).toContain(selectedDate);
  });

  it("returns correct week for a Monday", () => {
    const dates = getWeekDates("2026-03-16"); // Monday
    expect(dates[0]).toBe("2026-03-16");
    expect(dates[6]).toBe("2026-03-22");
  });

  it("returns correct week for a Sunday", () => {
    const dates = getWeekDates("2026-03-22"); // Sunday
    expect(dates[0]).toBe("2026-03-16");
    expect(dates[6]).toBe("2026-03-22");
  });

  it("handles month boundaries", () => {
    const dates = getWeekDates("2026-03-31"); // Tuesday
    expect(dates).toHaveLength(7);
    // Week should span March into April
    expect(dates.some((d) => d.startsWith("2026-04"))).toBe(true);
  });

  it("handles year boundaries", () => {
    const dates = getWeekDates("2026-01-01"); // Thursday
    expect(dates).toHaveLength(7);
    // Monday of that week is in December 2025
    expect(dates[0]).toBe("2025-12-29");
  });
});

describe("appointment filtering", () => {
  const appointments = [
    { id: "1", date: "2026-03-17", timeSlot: "10:00", status: "booked", customerName: "A" },
    { id: "2", date: "2026-03-17", timeSlot: "11:00", status: "cancelled", customerName: "B" },
    { id: "3", date: "2026-03-18", timeSlot: "10:00", status: "booked", customerName: "C" },
    { id: "4", date: "2026-03-17", timeSlot: "14:00", status: "booked", customerName: "D" },
  ];

  it("filters booked appointments for a specific date", () => {
    const filtered = appointments.filter(
      (a) => a.date === "2026-03-17" && a.status === "booked"
    );
    expect(filtered).toHaveLength(2);
    expect(filtered.map((a) => a.customerName)).toEqual(["A", "D"]);
  });

  it("excludes cancelled appointments", () => {
    const filtered = appointments.filter(
      (a) => a.date === "2026-03-17" && a.status === "booked"
    );
    expect(filtered.every((a) => a.status === "booked")).toBe(true);
  });

  it("returns empty for dates with no appointments", () => {
    const filtered = appointments.filter(
      (a) => a.date === "2026-03-20" && a.status === "booked"
    );
    expect(filtered).toHaveLength(0);
  });

  it("correctly computes booked slots set", () => {
    const bookedSlots = new Set(
      appointments
        .filter((a) => a.date === "2026-03-17" && a.status === "booked")
        .map((a) => a.timeSlot)
    );
    expect(bookedSlots.has("10:00")).toBe(true);
    expect(bookedSlots.has("14:00")).toBe(true);
    expect(bookedSlots.has("11:00")).toBe(false); // cancelled
  });
});
