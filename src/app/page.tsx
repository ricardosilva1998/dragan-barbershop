import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-amber-500">Premium</span> Barbershop
            <br />
            in Oeiras
          </h1>
          <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Experience the art of grooming at Barbershop Dragan. Precision cuts,
            classic shaves, and a relaxing atmosphere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Book Your Appointment
            </Link>
            <Link
              href="/about"
              className="border border-zinc-600 hover:border-zinc-400 text-zinc-300 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our <span className="text-amber-500">Services</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Haircut",
                desc: "Precision cuts tailored to your style. From classic to modern looks.",
                icon: "✂️",
              },
              {
                title: "Beard Trim",
                desc: "Expert beard shaping and grooming for a clean, polished look.",
                icon: "🪒",
              },
              {
                title: "Full Service",
                desc: "Complete grooming experience: haircut, beard trim, and styling.",
                icon: "💈",
              },
            ].map((service) => (
              <div
                key={service.title}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center hover:border-amber-600/50 transition-colors"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                <p className="text-zinc-400">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our <span className="text-amber-500">Work</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700"
              >
                <span className="text-zinc-500 text-sm">Gallery Photo {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="py-16 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Follow Us on Instagram</h2>
          <a
            href="https://www.instagram.com/dragan.barbershop21"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 text-lg font-semibold transition-colors"
          >
            @dragan.barbershop21
          </a>
        </div>
      </section>
    </div>
  );
}
