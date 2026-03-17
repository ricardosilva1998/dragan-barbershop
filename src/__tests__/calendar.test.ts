import { describe, it, expect } from "vitest";
import { generateICS, getGoogleCalendarUrl } from "@/lib/calendar";

describe("generateICS", () => {
  it("returns a valid ICS string for a given appointment", () => {
    const result = generateICS({
      customerName: "John Doe",
      customerEmail: "john@example.com",
      date: "2026-04-15",
      timeSlot: "14:00",
    });

    expect(result).not.toBeNull();
    expect(result).toContain("BEGIN:VCALENDAR");
    expect(result).toContain("BEGIN:VEVENT");
    expect(result).toContain("Barbershop Dragan");
    expect(result).toContain("John Doe");
    expect(result).toContain("END:VCALENDAR");
  });

  it("includes the correct duration of 30 minutes", () => {
    const result = generateICS({
      customerName: "Jane",
      customerEmail: "jane@example.com",
      date: "2026-05-01",
      timeSlot: "10:00",
    });

    expect(result).not.toBeNull();
    expect(result).toContain("DURATION:PT30M");
  });
});

describe("getGoogleCalendarUrl", () => {
  it("returns a valid Google Calendar URL", () => {
    const url = getGoogleCalendarUrl({
      customerName: "John Doe",
      customerEmail: "john@example.com",
      date: "2026-04-15",
      timeSlot: "14:00",
    });

    expect(url).toContain("https://calendar.google.com/calendar/render");
    expect(url).toContain("action=TEMPLATE");
    expect(url).toContain("Barbershop+Dragan");
    expect(url).toContain("John+Doe");
  });

  it("calculates a 30-minute end time", () => {
    const url = getGoogleCalendarUrl({
      customerName: "Test",
      customerEmail: "test@test.com",
      date: "2026-03-20",
      timeSlot: "10:00",
    });

    // Start and end should be in the dates param separated by /
    expect(url).toMatch(/dates=\d{8}T\d{6}Z%2F\d{8}T\d{6}Z/);
  });

  it("includes the location", () => {
    const url = getGoogleCalendarUrl({
      customerName: "Test",
      customerEmail: "test@test.com",
      date: "2026-03-20",
      timeSlot: "15:30",
    });

    expect(url).toContain("location=Barbershop+Dragan");
  });
});
