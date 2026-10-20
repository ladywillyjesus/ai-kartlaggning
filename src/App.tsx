import { useEffect, useRef, useState } from "react";
import KartlaggningForm from "@/components/KartlaggningForm";
import ForslagKort, { type Forslag } from "@/components/ForslagKort";

// Tillfälliga exempeltexter tills kopplingen till Claude finns (steg 4).
const EXEMPEL: Forslag = {
  automatisera: "Här beskrivs vilka delar av uppgiften som kan automatiseras och vad som bör göras av en människa.",
  losning: "Här förklaras vilken typ av AI-lösning som passar, med enkla ord och utan teknisk jargong.",
  timmar: "Här visas en ungefärlig uppskattning av hur många timmar per vecka ni kan spara.",
};

export default function App() {
  const [forslag, setForslag] = useState<Forslag | null>(null);
  const resultatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (forslag) resultatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [forslag]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="relative z-10 border-b border-slate-200/70 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <a
            href="https://indefinit.ai"
            className="flex items-center gap-2.5 text-lg font-bold uppercase tracking-tight"
          >
            <img src="/logo-icon.png" alt="" width={36} height={36} className="size-9" />
            Indefinit AI
          </a>
          <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand-dark">
            Gratis och utan förpliktelser
          </span>
        </div>
      </header>

      <main className="flex-1">
        <div className="relative isolate overflow-hidden">
          <Bakgrund />

          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:py-16 lg:grid-cols-[1fr_1.25fr] lg:gap-14">
            <section className="lg:sticky lg:top-12 lg:self-start lg:pt-6">
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-dark">
                AI-kartläggning
              </p>
              <h1 className="mb-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
                Upptäck hur AI kan spara tid i ditt företag
              </h1>
              <p className="text-lg text-slate-600">
                Beskriv en arbetsuppgift som tar mycket tid varje vecka. På några sekunder får du
                ett förslag på vad som kan automatiseras, vilken typ av AI-lösning som passar och
                ungefär hur många timmar ni kan spara.
              </p>
            </section>

            <KartlaggningForm onSkicka={() => setForslag(EXEMPEL)} />
          </div>
        </div>

        {forslag && (
          <div ref={resultatRef} className="mx-auto max-w-6xl scroll-mt-6 px-4 pb-16">
            <ForslagKort forslag={forslag} />
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500">
          © {new Date().getFullYear()} Indefinit AI ·{" "}
          <a href="https://indefinit.ai" className="underline hover:text-brand-dark">
            indefinit.ai
          </a>
        </div>
      </footer>
    </div>
  );
}

/** Mjuka, svävande färgfläckar i varumärkets gröna toner. */
function Bakgrund() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute -left-32 -top-24 size-[28rem] rounded-full bg-brand/45 blur-3xl animate-svava motion-reduce:animate-none" />
      <div
        className="absolute -right-24 top-24 size-[22rem] rounded-full bg-yellow-200/60 blur-3xl animate-svava motion-reduce:animate-none"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="absolute bottom-0 left-1/3 size-[20rem] rounded-full bg-emerald-300/35 blur-3xl animate-svava motion-reduce:animate-none"
        style={{ animationDelay: "-12s" }}
      />
    </div>
  );
}
