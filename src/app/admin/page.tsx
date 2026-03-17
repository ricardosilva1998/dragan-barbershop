import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import AdminPageContent from "./AdminPageContent";

export const metadata = {
  title: "Admin Dashboard | Barbershop Dragan",
};

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  return <AdminPageContent />;
}
