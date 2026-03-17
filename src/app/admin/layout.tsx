import { auth } from "../../../auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Allow the login page to render without auth
  // The layout wraps all /admin/* routes including /admin/login
  // We only redirect if not on the login page
  if (!session) {
    // We can't check the URL in a layout easily, so we'll handle this differently
    // The login page is a public page, admin/page.tsx will be protected
  }

  return <>{children}</>;
}
