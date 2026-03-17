"use client";

import { useState, useEffect, useCallback } from "react";

interface BookingSuccess {
  customerName: string;
  date: string;
  timeSlot: string;
  googleCalendarUrl: string;
}

export default function BookingForm() {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<BookingSuccess | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const fetchSlots = useCallback(async (date: string) => {
    setSlotsLoading(true);
    setSelectedSlot("");
    try {
      const res = await fetch(`/api/appointments/available?date=${date}`);
      const data = await res.json();
      setAvailableSlots(data.slots || []);
    } catch {
      setAvailableSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchSlots(selectedDate);
    }
  }, [selectedDate, fetchSlots]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot || !name || !email || !phone) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          date: selectedDate,
          timeSlot: selectedSlot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setError("This time slot has just been booked by someone else. Please select another slot.");
          fetchSlots(selectedDate);
        } else {
          setError(data.error || "Failed to book appointment");
        }
        return;
      }

      setSuccess({
        customerName: name,
        date: selectedDate,
        timeSlot: selectedSlot,
        googleCalendarUrl: data.googleCalendarUrl,
      });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Calendar helpers
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const canGoBack = () => {
    const now = new Date();
    return currentMonth.year > now.getFullYear() ||
      (currentMonth.year === now.getFullYear() && currentMonth.month > now.getMonth());
  };

  const maxMonth = new Date();
  maxMonth.setMonth(maxMonth.getMonth() + 1);
  const canGoForward = () => {
    return currentMonth.year < maxMonth.getFullYear() ||
      (currentMonth.year === maxMonth.getFullYear() && currentMonth.month < maxMonth.getMonth());
  };

  const isDateSelectable = (day: number) => {
    const date = new Date(currentMonth.year, currentMonth.month, day);
    date.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const formatDateStr = (day: number) => {
    const m = String(currentMonth.month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${currentMonth.year}-${m}-${d}`;
  };

  const monthName = new Date(currentMonth.year, currentMonth.month).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  if (success) {
    const formattedDate = new Date(success.date + "T00:00:00").toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-white mb-2">Appointment Booked!</h2>
        <p className="text-zinc-400 mb-6">
          Thank you, <span className="text-amber-500 font-semibold">{success.customerName}</span>
        </p>
        <div className="bg-zinc-800 rounded-lg p-6 mb-6 inline-block text-left">
          <p className="text-zinc-300 mb-2">
            <span className="text-zinc-500">Date:</span> {formattedDate}
          </p>
          <p className="text-zinc-300 mb-2">
            <span className="text-zinc-500">Time:</span> {success.timeSlot}
          </p>
          <p className="text-zinc-300">
            <span className="text-zinc-500">Duration:</span> 30 minutes
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={success.googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Add to Google Calendar
          </a>
          <button
            onClick={() => {
              setSuccess(null);
              setSelectedDate("");
              setSelectedSlot("");
              setName("");
              setEmail("");
              setPhone("");
            }}
            className="border border-zinc-600 hover:border-zinc-400 text-zinc-300 hover:text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Book Another
          </button>
        </div>
      </div>
    );
  }

  const daysInMonth = getDaysInMonth(currentMonth.year, currentMonth.month);
  const firstDay = getFirstDayOfMonth(currentMonth.year, currentMonth.month);
  // Adjust so Monday=0
  const startOffset = (firstDay + 6) % 7;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Calendar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => {
              if (canGoBack()) {
                setCurrentMonth((prev) => {
                  const m = prev.month - 1;
                  return m < 0
                    ? { year: prev.year - 1, month: 11 }
                    : { year: prev.year, month: m };
                });
              }
            }}
            disabled={!canGoBack()}
            className="text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed p-2 transition-colors"
          >
            ◀
          </button>
          <h3 className="text-lg font-semibold text-white">{monthName}</h3>
          <button
            type="button"
            onClick={() => {
              if (canGoForward()) {
                setCurrentMonth((prev) => {
                  const m = prev.month + 1;
                  return m > 11
                    ? { year: prev.year + 1, month: 0 }
                    : { year: prev.year, month: m };
                });
              }
            }}
            disabled={!canGoForward()}
            className="text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed p-2 transition-colors"
          >
            ▶
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="text-zinc-500 text-xs font-medium py-2">
              {d}
            </div>
          ))}

          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = formatDateStr(day);
            const selectable = isDateSelectable(day);
            const isSelected = dateStr === selectedDate;

            return (
              <button
                key={day}
                type="button"
                disabled={!selectable}
                onClick={() => setSelectedDate(dateStr)}
                className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-amber-600 text-white"
                    : selectable
                    ? "text-zinc-300 hover:bg-zinc-800"
                    : "text-zinc-700 cursor-not-allowed"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Available Times for{" "}
            {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </h3>
          {slotsLoading ? (
            <p className="text-zinc-400">Loading available slots...</p>
          ) : availableSlots.length === 0 ? (
            <p className="text-zinc-400">No available slots for this date. Please try another day.</p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    selectedSlot === slot
                      ? "bg-amber-600 text-white"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Customer Form */}
      {selectedSlot && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Your Details</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm text-zinc-400 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm text-zinc-400 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm text-zinc-400 mb-1">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="+351 912 345 678"
              />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 text-red-300">
          {error}
        </div>
      )}

      {selectedSlot && (
        <button
          type="submit"
          disabled={loading || !name || !email || !phone}
          className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold text-lg transition-colors"
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      )}
    </form>
  );
}
