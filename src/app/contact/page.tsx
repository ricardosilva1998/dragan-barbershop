export default function ContactPage() {
  const address = "Rua Placeholder, 123, 2780-001 Oeiras, Portugal";
  const encodedAddress = encodeURIComponent(address);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-12 text-center">
        Get in <span className="text-amber-500">Touch</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-500">📞</span>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Phone</p>
                  <a href="tel:+351000000000" className="text-white hover:text-amber-500 transition-colors">
                    +351 000 000 000
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-500">✉️</span>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Email</p>
                  <a href="mailto:contact@placeholder.com" className="text-white hover:text-amber-500 transition-colors">
                    contact@placeholder.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-500">📍</span>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Address</p>
                  <p className="text-white">
                    Rua Placeholder, 123<br />
                    2780-001 Oeiras<br />
                    Portugal
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-500">📸</span>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Instagram</p>
                  <a
                    href="https://www.instagram.com/dragan.barbershop21"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-500 hover:text-amber-400 transition-colors"
                  >
                    @dragan.barbershop21
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Map Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Get Directions</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm transition-colors border border-zinc-700"
              >
                Google Maps
              </a>
              <a
                href={`https://maps.apple.com/?q=${encodedAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm transition-colors border border-zinc-700"
              >
                Apple Maps
              </a>
              <a
                href={`https://waze.com/ul?q=${encodedAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm transition-colors border border-zinc-700"
              >
                Waze
              </a>
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Opening Hours</h2>
          <div className="space-y-4">
            {[
              { day: "Monday", hours: "10:00 - 20:00" },
              { day: "Tuesday", hours: "10:00 - 20:00" },
              { day: "Wednesday", hours: "10:00 - 20:00" },
              { day: "Thursday", hours: "10:00 - 20:00" },
              { day: "Friday", hours: "10:00 - 20:00" },
              { day: "Saturday", hours: "10:00 - 18:00" },
              { day: "Sunday", hours: "Closed" },
            ].map((item) => (
              <div key={item.day} className="flex justify-between py-2 border-b border-zinc-800 last:border-0">
                <span className="text-zinc-400">{item.day}</span>
                <span className={`font-medium ${item.hours === "Closed" ? "text-red-400" : "text-amber-500"}`}>
                  {item.hours}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
