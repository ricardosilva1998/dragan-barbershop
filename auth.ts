import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const adminUsername = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;

// Credentials must be set via env vars — never rely on defaults in production.
if (process.env.NODE_ENV === "production" && (!adminUsername || !adminPassword)) {
  throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be set in production");
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const expectedUsername = adminUsername;
        const expectedPassword = adminPassword;

        if (
          expectedUsername &&
          expectedPassword &&
          credentials?.username === expectedUsername &&
          credentials?.password === expectedPassword
        ) {
          return { id: "1", name: "Admin", email: "admin@barbershop.com" };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
});
