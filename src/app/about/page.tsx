export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-12 text-center">
        About <span className="text-amber-500">Dragan</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Instagram photo embed */}
        <div className="flex justify-center">
          <blockquote
            className="instagram-media"
            data-instgrm-captioned
            data-instgrm-permalink="https://www.instagram.com/p/DG17J1cNaA5/"
            style={{
              maxWidth: "540px",
              width: "100%",
              background: "#1c1917",
              border: "1px solid #3f3f46",
              borderRadius: "12px",
              margin: 0,
            }}
          />
        </div>

        {/* Bio */}
        <div>
          <h2 className="text-2xl font-bold text-amber-500 mb-6">The Barber</h2>
          <div className="space-y-4 text-zinc-300 leading-relaxed">
            <p>
              Welcome to Barbershop Dragan, your premium barbershop in Oeiras, Portugal.
              With years of experience and a passion for the craft, Dragan delivers
              precision cuts and grooming services that make every client feel their best.
            </p>
            <p>
              Specializing in both classic and modern styles, every appointment is a
              personalized experience. From traditional fades to contemporary designs,
              Dragan brings expertise and attention to detail to every cut.
            </p>
            <p>
              The shop offers a relaxed, welcoming atmosphere where you can sit back and
              enjoy a quality grooming experience. Whether you&apos;re looking for a quick
              trim or a complete style transformation, you&apos;re in good hands.
            </p>
          </div>

          <div className="mt-8 p-6 bg-zinc-900 rounded-xl border border-zinc-800">
            <h3 className="text-lg font-semibold text-white mb-4">Opening Hours</h3>
            <div className="space-y-2 text-sm">
              {[
                { day: "Monday - Friday", hours: "10:00 - 20:00" },
                { day: "Saturday", hours: "10:00 - 18:00" },
                { day: "Sunday", hours: "Closed" },
              ].map((item) => (
                <div key={item.day} className="flex justify-between">
                  <span className="text-zinc-400">{item.day}</span>
                  <span className="text-amber-500 font-medium">{item.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
