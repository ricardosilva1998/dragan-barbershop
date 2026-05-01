# Barbershop Dragan

Appointment booking web app for a barbershop in Oeiras, Portugal.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (inline config via `@theme`)
- **Database**: SQLite via Prisma ORM (better-sqlite3 adapter)
- **Auth**: NextAuth v5 (credentials provider, JWT sessions)
- **Email**: Resend SDK
- **Runtime**: Bun

## Commands

- `bun run dev` — start dev server
- `bun run build` — run migrations + build for production
- `bun run test` — run all tests (vitest)
- `bun run test:watch` — run tests in watch mode
- `bun run lint` — run ESLint

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage (hero, services, Instagram gallery)
│   ├── about/page.tsx      # About page with Instagram embed
│   ├── booking/page.tsx    # Booking page (wraps BookingForm)
│   ├── contact/page.tsx    # Contact info, map links, opening hours
│   ├── admin/
│   │   ├── page.tsx        # Protected admin dashboard
│   │   ├── layout.tsx      # Admin layout (auth wrapper)
│   │   └── login/page.tsx  # Admin login page
│   ├── api/appointments/
│   │   ├── route.ts        # GET (admin, all appointments) / POST (create booking)
│   │   ├── available/route.ts  # GET available slots for a date
│   │   └── [id]/route.ts   # PATCH (cancel or reschedule)
│   └── layout.tsx          # Root layout (fonts, navbar, footer)
├── components/
│   ├── Navbar.tsx           # Responsive nav with mobile hamburger menu
│   ├── Footer.tsx           # Footer with admin link
│   ├── BookingForm.tsx      # Calendar + slot picker + booking form
│   └── AdminDashboard.tsx   # Daily/weekly views, cancel/reschedule modal
├── lib/
│   ├── prisma.ts            # Prisma client singleton
│   ├── slots.ts             # ALL_SLOTS constant + getAvailableSlots()
│   ├── calendar.ts          # ICS generation + Google Calendar URL
│   └── email.ts             # Confirmation, cancellation, reschedule emails
├── __tests__/               # Vitest test suites
│   ├── setup.ts             # Test setup (jest-dom matchers)
│   ├── calendar.test.ts     # ICS + Google Calendar URL tests
│   ├── slots.test.ts        # Slot definitions tests
│   ├── api-validation.test.ts   # Booking validation rules
│   ├── admin-dashboard.test.ts  # Week calculation + filtering
│   └── reschedule.test.ts   # Reschedule availability logic
└── generated/prisma/        # Auto-generated Prisma client (do not edit)

prisma/
├── schema.prisma           # Appointment model (date+timeSlot unique)
└── migrations/             # Database migrations

auth.ts                     # NextAuth config (credentials provider)
vitest.config.ts            # Test configuration
```

## Key Patterns

- **Server vs Client components**: Pages under `app/` are server components by default. Components with interactivity (`BookingForm`, `AdminDashboard`, `Navbar`, login page) use `"use client"`.
- **Auth**: Admin routes check `auth()` server-side and redirect to `/admin/login`. API routes also validate session.
- **Appointments**: 30-minute slots from 10:00–19:30 (20 slots/day). Unique constraint on `date + timeSlot` prevents double-booking.
- **Responsive design**: All pages use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`). Navbar collapses to hamburger on mobile. Grids stack on small screens.
- **Print support**: Admin dashboard has print-friendly styles (white background, hidden controls).

## Database

Single model `Appointment` with fields: `id`, `customerName`, `customerEmail`, `customerPhone`, `date` (YYYY-MM-DD string), `timeSlot` (HH:MM string), `status` ("booked"/"cancelled"), `createdAt`.

## Testing

Tests use Vitest with jsdom environment. Tests cover pure logic (validation rules, date calculations, calendar generation) without requiring a running server or database. Run `bun run test` before pushing.

## Environment Variables

Required in `.env` / `.env.local`:
- `DATABASE_URL` — SQLite database path
- `AUTH_SECRET` — NextAuth secret
- `RESEND_API_KEY` — Resend email API key
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` — Admin credentials (fallback: hardcoded in auth.ts)


## Team Activity Log

This section is the shared coordination surface for the dev team (team-leader + frontend-dev + backend-dev + team-security + team-qa + team-ux + team-deployment). Every team member reads the last few entries before working and appends one entry after.

Format per entry:

```
### YYYY-MM-DD HH:MM — <role>
**Task:** <one line>
**Files:** <comma-separated paths or "none">
**Decisions:** <2-4 bullets the next teammate needs to know>
**Open:** <followups, or "none">
```

(No entries yet — the next `/dev-team` round will append here.)
