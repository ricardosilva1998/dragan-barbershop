import BookingForm from "@/components/BookingForm";

export const metadata = {
  title: "Book Appointment | Barbershop Dragan",
};

export default function BookingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Book Your <span className="text-amber-500">Appointment</span>
      </h1>
      <p className="text-zinc-400 text-center mb-12 max-w-xl mx-auto">
        Select a date and time that works for you. Each appointment is 30 minutes.
      </p>
      <BookingForm />
    </div>
  );
}
