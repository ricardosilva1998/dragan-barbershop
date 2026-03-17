import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/AdminDashboard";

export const metadata = {
  title: "Admin Dashboard | Barbershop Dragan",
};

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:px-0">
      <div className="flex items-center justify-between mb-8 print:mb-4">
        <div>
          <h1 className="text-3xl font-bold text-white print:text-black">
            Admin <span className="text-amber-500 print:text-black">Dashboard</span>
          </h1>
          <p className="text-zinc-400 print:text-gray-600">Manage appointments</p>
        </div>
        <div className="flex gap-3 print:hidden">
          <button
            onClick={() => {}}
            className="hidden"
            id="print-trigger"
          >
            Print
          </button>
        </div>
      </div>
      <AdminDashboard />
    </div>
  );
}
