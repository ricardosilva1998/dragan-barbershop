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
                className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm transition-colors border border-zinc-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                </svg>
                Google Maps
              </a>
              <a
                href={`https://maps.apple.com/?q=${encodedAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm transition-colors border border-zinc-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-4 h-4 flex-shrink-0" fill="currentColor">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184 4 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                </svg>
                Apple Maps
              </a>
              <a
                href={`https://waze.com/ul?q=${encodedAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm transition-colors border border-zinc-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="currentColor">
                  <path d="M20.54 6.63c-1.27-3.16-4.38-5.3-7.78-5.56a9.1 9.1 0 0 0-9.57 7.2 8.93 8.93 0 0 0 .74 5.88 3.15 3.15 0 0 1 .31 1.58c-.05.79-.16 1.57-.23 2.36-.03.39.38.65.72.47 1.18-.63 2.35-1.28 3.54-1.88a1.88 1.88 0 0 1 1.2-.17A9.04 9.04 0 0 0 20.54 6.63zM9.5 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                </svg>
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
