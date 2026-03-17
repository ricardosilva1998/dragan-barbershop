"use client";

import { useState, useEffect, useCallback } from "react";
import { signOut } from "next-auth/react";

interface Appointment {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  timeSlot: string;
  status: string;
  createdAt: string;
}

type ViewMode = "daily" | "weekly";

const ALL_SLOTS = [
  "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30",
];

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

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatShortDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function AdminDashboard() {
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [viewMode, setViewMode] = useState<ViewMode>("daily");
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [modalAppointment, setModalAppointment] = useState<Appointment | null>(null);

  const weekDates = getWeekDates(selectedDate);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/appointments");
      if (res.ok) {
        const data = await res.json();
        setAllAppointments(data.appointments);
      }
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCancel = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });
      if (res.ok) {
        setModalAppointment(null);
        fetchAppointments();
      }
    } catch (err) {
      console.error("Failed to cancel appointment:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReschedule = async (id: string, newDate: string, newTimeSlot: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reschedule", newDate, newTimeSlot }),
      });
      if (res.ok) {
        setModalAppointment(null);
        fetchAppointments();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to reschedule");
      }
    } catch (err) {
      console.error("Failed to reschedule appointment:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const getAppointmentsForDate = (date: string) =>
    allAppointments.filter((a) => a.date === date && a.status === "booked");

  const getBookedSlotsForDate = (date: string) =>
    new Set(allAppointments.filter((a) => a.date === date && a.status === "booked").map((a) => a.timeSlot));

  const dailyAppointments = getAppointmentsForDate(selectedDate);
  const weeklyTotal = weekDates.reduce(
    (sum, d) => sum + getAppointmentsForDate(d).length,
    0
  );

  const navigateDay = (offset: number) => {
    const d = new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() + offset);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const navigateWeek = (offset: number) => {
    const d = new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() + offset * 7);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("daily")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === "daily"
                  ? "bg-amber-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setViewMode("weekly")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === "weekly"
                  ? "bg-amber-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Weekly
            </button>
          </div>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors"
          />

          <div className="flex gap-1">
            <button
              onClick={() =>
                viewMode === "daily" ? navigateDay(-1) : navigateWeek(-1)
              }
              className="bg-zinc-800 hover:bg-zinc-700 text-white w-9 h-9 rounded-lg text-sm border border-zinc-700 flex items-center justify-center"
            >
              &larr;
            </button>
            <button
              onClick={() => setSelectedDate(new Date().toISOString().split("T")[0])}
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 h-9 rounded-lg text-sm border border-zinc-700"
            >
              Today
            </button>
            <button
              onClick={() =>
                viewMode === "daily" ? navigateDay(1) : navigateWeek(1)
              }
              className="bg-zinc-800 hover:bg-zinc-700 text-white w-9 h-9 rounded-lg text-sm border border-zinc-700 flex items-center justify-center"
            >
              &rarr;
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm transition-colors border border-zinc-700"
          >
            Print Schedule
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="bg-red-900/50 hover:bg-red-900 text-red-300 px-4 py-2 rounded-lg text-sm transition-colors border border-red-800"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Print header */}
      <div className="hidden print:block text-center mb-4">
        <h2 className="text-xl font-bold">
          {viewMode === "daily"
            ? formatDate(selectedDate)
            : `Week: ${formatShortDate(weekDates[0])} – ${formatShortDate(weekDates[6])}`}
        </h2>
        <p>
          {viewMode === "daily"
            ? `${dailyAppointments.length} appointment(s)`
            : `${weeklyTotal} appointment(s)`}
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-zinc-400">
          Loading appointments...
        </div>
      ) : viewMode === "daily" ? (
        <DailyView
          date={selectedDate}
          appointments={dailyAppointments}
          onManage={setModalAppointment}
          actionLoading={actionLoading}
        />
      ) : (
        <WeeklyView
          weekDates={weekDates}
          selectedDate={selectedDate}
          getAppointments={getAppointmentsForDate}
          onManage={setModalAppointment}
          actionLoading={actionLoading}
          weeklyTotal={weeklyTotal}
        />
      )}

      {/* Cancel/Reschedule Modal */}
      {modalAppointment && (
        <AppointmentModal
          appointment={modalAppointment}
          bookedSlots={getBookedSlotsForDate}
          onClose={() => setModalAppointment(null)}
          onCancel={handleCancel}
          onReschedule={handleReschedule}
          actionLoading={actionLoading}
        />
      )}
    </div>
  );
}

/* ── Modal ── */

function AppointmentModal({
  appointment,
  bookedSlots,
  onClose,
  onCancel,
  onReschedule,
  actionLoading,
}: {
  appointment: Appointment;
  bookedSlots: (date: string) => Set<string>;
  onClose: () => void;
  onCancel: (id: string) => void;
  onReschedule: (id: string, newDate: string, newTimeSlot: string) => void;
  actionLoading: string | null;
}) {
  const [mode, setMode] = useState<"choose" | "reschedule">("choose");
  const [newDate, setNewDate] = useState(appointment.date);
  const [newTimeSlot, setNewTimeSlot] = useState("");

  const booked = bookedSlots(newDate);
  const availableSlots = ALL_SLOTS.filter((s) => {
    if (booked.has(s)) {
      // Allow the current slot if same date (it'll be freed)
      if (newDate === appointment.date && s === appointment.timeSlot) return true;
      return false;
    }
    return true;
  });

  const isLoading = actionLoading === appointment.id;
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Manage Appointment</h3>
            <p className="text-zinc-400 text-sm mt-1">
              {appointment.customerName} &middot; {formatDate(appointment.date)} at {appointment.timeSlot}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {mode === "choose" ? (
          <div className="space-y-3">
            <p className="text-zinc-300 text-sm">
              What would you like to do with this appointment?
            </p>
            <button
              onClick={() => setMode("reschedule")}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Reschedule to Another Day
            </button>
            <button
              onClick={() => onCancel(appointment.id)}
              disabled={isLoading}
              className="w-full bg-red-900/50 hover:bg-red-900 text-red-300 py-3 rounded-lg font-semibold transition-colors border border-red-800 disabled:opacity-50"
            >
              {isLoading ? "Cancelling..." : "Cancel Appointment"}
            </button>
            <p className="text-zinc-500 text-xs text-center">
              The customer will be notified by email.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => { setMode("choose"); setNewTimeSlot(""); }}
              className="text-zinc-400 hover:text-white text-sm flex items-center gap-1 transition-colors"
            >
              &larr; Back
            </button>

            {/* Date picker */}
            <div>
              <label className="text-zinc-400 text-sm block mb-1">New Date</label>
              <input
                type="date"
                value={newDate}
                min={today}
                onChange={(e) => { setNewDate(e.target.value); setNewTimeSlot(""); }}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Time slots */}
            <div>
              <label className="text-zinc-400 text-sm block mb-2">
                Available Time Slots
              </label>
              {availableSlots.length === 0 ? (
                <p className="text-zinc-500 text-sm">No available slots for this date.</p>
              ) : (
                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setNewTimeSlot(slot)}
                      className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                        newTimeSlot === slot
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

            {/* Confirm reschedule */}
            <button
              onClick={() => onReschedule(appointment.id, newDate, newTimeSlot)}
              disabled={!newTimeSlot || isLoading}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Rescheduling..." : `Reschedule to ${newDate} at ${newTimeSlot || "..."}`}
            </button>
            <p className="text-zinc-500 text-xs text-center">
              The customer will be notified by email with the new date.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Views ── */

function DailyView({
  date,
  appointments,
  onManage,
  actionLoading,
}: {
  date: string;
  appointments: Appointment[];
  onManage: (apt: Appointment) => void;
  actionLoading: string | null;
}) {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 print:hidden">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-400 text-sm">Date</p>
          <p className="text-white font-semibold">{formatDate(date)}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-400 text-sm">Booked</p>
          <p className="text-amber-500 font-semibold text-2xl">
            {appointments.length}
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-400 text-sm">Total Slots</p>
          <p className="text-white font-semibold text-2xl">20</p>
        </div>
      </div>

      <AppointmentTable
        appointments={appointments}
        onManage={onManage}
        actionLoading={actionLoading}
        showDate={false}
      />
    </>
  );
}

function WeeklyView({
  weekDates,
  selectedDate,
  getAppointments,
  onManage,
  actionLoading,
  weeklyTotal,
}: {
  weekDates: string[];
  selectedDate: string;
  getAppointments: (date: string) => Appointment[];
  onManage: (apt: Appointment) => void;
  actionLoading: string | null;
  weeklyTotal: number;
}) {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 print:hidden">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-400 text-sm">Week</p>
          <p className="text-white font-semibold text-sm">
            {formatShortDate(weekDates[0])} – {formatShortDate(weekDates[6])}
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-400 text-sm">Total Booked</p>
          <p className="text-amber-500 font-semibold text-2xl">{weeklyTotal}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-400 text-sm">Total Slots</p>
          <p className="text-white font-semibold text-2xl">{20 * 7}</p>
        </div>
      </div>

      <div className="space-y-4">
        {weekDates.map((date) => {
          const dayAppts = getAppointments(date);
          const isToday = date === new Date().toISOString().split("T")[0];
          const isSelected = date === selectedDate;

          return (
            <div
              key={date}
              className={`bg-zinc-900 border rounded-xl overflow-hidden print:border-gray-300 print:bg-white ${
                isToday
                  ? "border-amber-600/50"
                  : isSelected
                  ? "border-zinc-600"
                  : "border-zinc-800"
              }`}
            >
              <div
                className={`px-4 py-3 flex items-center justify-between ${
                  isToday ? "bg-amber-600/10" : "bg-zinc-800/50"
                } print:bg-gray-100`}
              >
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-white print:text-black">
                    {formatDate(date)}
                  </h3>
                  {isToday && (
                    <span className="bg-amber-600 text-white text-xs px-2 py-0.5 rounded-full font-medium print:hidden">
                      Today
                    </span>
                  )}
                </div>
                <span className="text-zinc-400 print:text-black text-sm">
                  {dayAppts.length} appointment{dayAppts.length !== 1 ? "s" : ""}
                </span>
              </div>

              {dayAppts.length > 0 ? (
                <AppointmentTable
                  appointments={dayAppts}
                  onManage={onManage}
                  actionLoading={actionLoading}
                  showDate={false}
                />
              ) : (
                <div className="px-4 py-3 text-zinc-500 print:text-gray-400 text-sm">
                  No appointments
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ── Table ── */

function AppointmentTable({
  appointments,
  onManage,
  actionLoading,
  showDate,
}: {
  appointments: Appointment[];
  onManage: (apt: Appointment) => void;
  actionLoading: string | null;
  showDate: boolean;
}) {
  if (appointments.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-zinc-400 print:border-gray-300 print:bg-white print:text-gray-500">
        No appointments.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-800 print:border-gray-300">
            {showDate && (
              <th className="text-left px-4 py-3 text-zinc-400 print:text-black text-sm font-medium">
                Date
              </th>
            )}
            <th className="text-left px-4 py-3 text-zinc-400 print:text-black text-sm font-medium">
              Time
            </th>
            <th className="text-left px-4 py-3 text-zinc-400 print:text-black text-sm font-medium">
              Name
            </th>
            <th className="text-left px-4 py-3 text-zinc-400 print:text-black text-sm font-medium hidden sm:table-cell">
              Phone
            </th>
            <th className="text-left px-4 py-3 text-zinc-400 print:text-black text-sm font-medium hidden md:table-cell">
              Email
            </th>
            <th className="text-left px-4 py-3 text-zinc-400 print:text-black text-sm font-medium">
              Status
            </th>
            <th className="text-left px-4 py-3 text-zinc-400 text-sm font-medium print:hidden">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((apt) => (
            <tr
              key={apt.id}
              className="border-b border-zinc-800/50 print:border-gray-200 last:border-0"
            >
              {showDate && (
                <td className="px-4 py-3 text-zinc-300 print:text-black text-sm">
                  {formatShortDate(apt.date)}
                </td>
              )}
              <td className="px-4 py-3 text-white print:text-black font-medium">
                {apt.timeSlot}
              </td>
              <td className="px-4 py-3 text-zinc-300 print:text-black">
                {apt.customerName}
              </td>
              <td className="px-4 py-3 text-zinc-300 print:text-black hidden sm:table-cell">
                {apt.customerPhone}
              </td>
              <td className="px-4 py-3 text-zinc-300 print:text-black hidden md:table-cell">
                {apt.customerEmail}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    apt.status === "booked"
                      ? "bg-green-900/50 text-green-300 print:text-green-700"
                      : "bg-red-900/50 text-red-300 print:text-red-700"
                  }`}
                >
                  {apt.status}
                </span>
              </td>
              <td className="px-4 py-3 print:hidden">
                {apt.status === "booked" && (
                  <button
                    onClick={() => onManage(apt)}
                    disabled={actionLoading === apt.id}
                    className="text-amber-400 hover:text-amber-300 text-sm font-medium disabled:opacity-50 transition-colors"
                  >
                    Manage
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
