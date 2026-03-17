import { describe, it, expect } from "vitest";
import { ALL_SLOTS } from "@/lib/slots";

describe("ALL_SLOTS", () => {
  it("contains 20 time slots", () => {
    expect(ALL_SLOTS).toHaveLength(20);
  });

  it("starts at 10:00", () => {
    expect(ALL_SLOTS[0]).toBe("10:00");
  });

  it("ends at 19:30", () => {
    expect(ALL_SLOTS[ALL_SLOTS.length - 1]).toBe("19:30");
  });

  it("has 30-minute intervals", () => {
    for (let i = 1; i < ALL_SLOTS.length; i++) {
      const [prevH, prevM] = ALL_SLOTS[i - 1].split(":").map(Number);
      const [currH, currM] = ALL_SLOTS[i].split(":").map(Number);
      const prevMinutes = prevH * 60 + prevM;
      const currMinutes = currH * 60 + currM;
      expect(currMinutes - prevMinutes).toBe(30);
    }
  });

  it("all slots match HH:MM format", () => {
    for (const slot of ALL_SLOTS) {
      expect(slot).toMatch(/^\d{2}:\d{2}$/);
    }
  });
});
