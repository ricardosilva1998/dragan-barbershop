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

export default function AdminDashboard() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/appointments?date=${selectedDate}`);
      if (res.ok) {
        const data = await res.json();
        // Filter appointments for the selected date
        const filtered = data.appointments.filter(
          (a: Appointment) => a.date === selectedDate
        );
        setAppointments(filtered);
      }
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    setCancelling(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
      });
      if (res.ok) {
        fetchAppointments();
      }
    } catch (err) {
      console.error("Failed to cancel appointment:", err);
    } finally {
      setCancelling(null);
    }
  };

  const formattedDate = new Date(selectedDate + "T00:00:00").toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const bookedCount = appointments.filter((a) => a.status === "booked").length;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <label htmlFor="date" className="text-zinc-400 text-sm">
            Date:
          </label>
          <input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors"
          />
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

      {/* Date header for print */}
      <div className="hidden print:block text-center mb-4">
        <h2 className="text-xl font-bold">{formattedDate}</h2>
        <p>{bookedCount} appointment(s)</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 print:hidden">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-400 text-sm">Date</p>
          <p className="text-white font-semibold">{formattedDate}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-400 text-sm">Booked</p>
          <p className="text-amber-500 font-semibold text-2xl">{bookedCount}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-400 text-sm">Total Slots</p>
          <p className="text-white font-semibold text-2xl">20</p>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden print:border print:border-gray-300 print:bg-white">
        {loading ? (
          <div className="p-8 text-center text-zinc-400">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="p-8 text-center text-zinc-400">
            No appointments for this date.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800 print:border-gray-300">
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
                          onClick={() => handleCancel(apt.id)}
                          disabled={cancelling === apt.id}
                          className="text-red-400 hover:text-red-300 text-sm font-medium disabled:opacity-50 transition-colors"
                        >
                          {cancelling === apt.id ? "Cancelling..." : "Cancel"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
