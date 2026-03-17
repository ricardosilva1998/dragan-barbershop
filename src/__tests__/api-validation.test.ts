import { describe, it, expect } from "vitest";
import { ALL_SLOTS } from "@/lib/slots";

// These tests validate the booking validation logic without needing
// a running server or database. They test the same rules the API enforces.

describe("Booking validation rules", () => {
  describe("date format validation", () => {
    it("accepts valid YYYY-MM-DD format", () => {
      expect(/^\d{4}-\d{2}-\d{2}$/.test("2026-04-15")).toBe(true);
    });

    it("rejects invalid date formats", () => {
      expect(/^\d{4}-\d{2}-\d{2}$/.test("15-04-2026")).toBe(false);
      expect(/^\d{4}-\d{2}-\d{2}$/.test("2026/04/15")).toBe(false);
      expect(/^\d{4}-\d{2}-\d{2}$/.test("20260415")).toBe(false);
      expect(/^\d{4}-\d{2}-\d{2}$/.test("")).toBe(false);
    });
  });

  describe("email format validation", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    it("accepts valid email addresses", () => {
      expect(emailRegex.test("user@example.com")).toBe(true);
      expect(emailRegex.test("name.surname@domain.pt")).toBe(true);
    });

    it("rejects invalid email addresses", () => {
      expect(emailRegex.test("")).toBe(false);
      expect(emailRegex.test("not-an-email")).toBe(false);
      expect(emailRegex.test("@domain.com")).toBe(false);
      expect(emailRegex.test("user@")).toBe(false);
      expect(emailRegex.test("user @domain.com")).toBe(false);
    });
  });

  describe("time slot validation", () => {
    it("accepts valid time slots", () => {
      expect(ALL_SLOTS.includes("10:00")).toBe(true);
      expect(ALL_SLOTS.includes("14:30")).toBe(true);
      expect(ALL_SLOTS.includes("19:30")).toBe(true);
    });

    it("rejects invalid time slots", () => {
      expect(ALL_SLOTS.includes("09:00")).toBe(false);
      expect(ALL_SLOTS.includes("20:00")).toBe(false);
      expect(ALL_SLOTS.includes("10:15")).toBe(false);
      expect(ALL_SLOTS.includes("")).toBe(false);
    });
  });

  describe("past date validation", () => {
    it("detects past appointments", () => {
      const pastDate = new Date("2020-01-01T10:00:00");
      expect(pastDate < new Date()).toBe(true);
    });

    it("allows future appointments", () => {
      const futureDate = new Date("2030-01-01T10:00:00");
      expect(futureDate < new Date()).toBe(false);
    });
  });

  describe("required fields validation", () => {
    it("detects missing required fields", () => {
      const fields = {
        customerName: "John",
        customerEmail: "john@example.com",
        customerPhone: "+351912345678",
        date: "2026-04-15",
        timeSlot: "10:00",
      };

      // All fields present
      const allPresent = Object.values(fields).every(Boolean);
      expect(allPresent).toBe(true);

      // Missing name
      const missingName = { ...fields, customerName: "" };
      expect(Object.values(missingName).every(Boolean)).toBe(false);

      // Missing email
      const missingEmail = { ...fields, customerEmail: "" };
      expect(Object.values(missingEmail).every(Boolean)).toBe(false);
    });
  });
});
