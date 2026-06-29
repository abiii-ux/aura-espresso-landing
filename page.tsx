import CoffeeSequence from "@/components/CoffeeSequence";

export default function Home() {
  return (
    <main className="bg-[#050505] min-h-screen">
      <CoffeeSequence />

      {/* Post-scroll section */}
      <section className="relative bg-[#050505] py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto mb-10 opacity-40" />
          <h2 className="font-playfair text-white/90 text-2xl md:text-4xl font-semibold tracking-tight mb-6">
            Crafted for Those Who Demand Perfection
          </h2>
          <p className="font-inter text-white/40 text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-12">
            Every AURA Espresso machine is engineered with obsessive precision—
            from the 58mm portafilter to the PID-controlled thermoblock.
            This is not just coffee. This is ceremony.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-16">
            {[
              {
                stat: "9",
                unit: "bar",
                desc: "Optimal extraction pressure",
              },
              {
                stat: "93°",
                unit: "C",
                desc: "Precision temperature control",
              },
              {
                stat: "25",
                unit: "sec",
                desc: "Perfect shot pull time",
              },
            ].map((item, i) => (
              <div key={i} className="group">
                <div className="flex items-baseline justify-center gap-1 mb-3">
                  <span className="font-playfair text-[#D4AF37] text-4xl md:text-5xl font-bold">
                    {item.stat}
                  </span>
                  <span className="font-inter text-[#D4AF37]/60 text-sm tracking-wider uppercase">
                    {item.unit}
                  </span>
                </div>
                <p className="font-inter text-white/30 text-xs tracking-[0.2em] uppercase">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20">
            <a
              href="#order"
              className="inline-block px-10 py-4
                         border border-[#D4AF37]/40 text-[#D4AF37]
                         font-inter text-xs tracking-[0.3em] uppercase
                         hover:bg-[#D4AF37] hover:text-[#050505] hover:border-[#D4AF37]
                         transition-all duration-500 ease-out"
            >
              Discover AURA
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-32 border-t border-white/5 pt-12 pb-8">
          <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-playfair text-white/20 text-sm tracking-wider">
              AURA<span className="text-[#D4AF37]/40">®</span>
            </p>
            <p className="font-inter text-white/10 text-[10px] tracking-[0.2em] uppercase">
              The Art of Espresso
            </p>
          </div>
        </footer>
      </section>
    </main>
  );
}
