import { useEffect, useRef, useState } from "react";
import KartlaggningForm from "@/components/KartlaggningForm";
import ForslagKort, { type Forslag } from "@/components/ForslagKort";

// Tillfälliga exempeltexter tills kopplingen till Claude finns (steg 4).
const EXEMPEL: Forslag = {
  automatisera:
    "Här beskrivs vilka delar av uppgiften som kan automatiseras och vad som bör göras av en människa.",
  losning:
    "Här förklaras vilken typ av AI-lösning som passar, med enkla ord och utan teknisk jargong.",
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
      <header className="px-5 py-5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <a href="https://indefinit.ai" className="flex flex-col gap-1.5 no-underline">
            <span className="flex items-center gap-3.5">
              <img
                src="/logo-icon.png"
                alt=""
                width={56}
                height={56}
                className="size-12 sm:size-14"
              />
              <span className="font-serif text-2xl font-bold tracking-tight">Indefinit AI</span>
            </span>
            <span className="text-base font-medium italic text-muted">
              ”Din fantasi sätter gränsen”
            </span>
          </a>
          <a
            href="https://indefinit.ai"
            className="text-[15px] font-medium text-muted transition hover:text-brand-dark"
          >
            ← Till indefinit.ai
          </a>
        </div>
      </header>

      <main className="flex-1">
        <div className="relative isolate overflow-hidden bg-navy text-white">
          <Sken />

          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:py-20 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <section className="lg:sticky lg:top-12 lg:self-start lg:pt-8">
              <p className="mb-6 inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.06em] text-accent">
                <span className="size-[7px] shrink-0 rounded-full bg-brand animate-puls motion-reduce:animate-none" />
                AI-kartläggning
              </p>
              <h1 className="mb-7 font-serif text-[2.6rem] font-semibold leading-[1.1] tracking-tight sm:text-6xl">
                Upptäck hur AI kan spara tid{" "}
                <em className="font-medium italic text-brand">i ditt företag</em>
              </h1>
              <p className="max-w-[46ch] text-lg text-muted-light sm:text-xl">
                Beskriv en arbetsuppgift som tar mycket tid varje vecka. På några sekunder får du
                ett förslag på vad som kan automatiseras, vilken typ av AI-lösning som passar och
                ungefär hur många timmar ni kan spara.
              </p>
              <p className="mt-5 text-sm text-[#7e8ca0]">Gratis och utan förpliktelser.</p>
            </section>

            <KartlaggningForm onSkicka={() => setForslag(EXEMPEL)} />
          </div>
        </div>

        {forslag && (
          <div ref={resultatRef} className="mx-auto max-w-6xl scroll-mt-6 px-5 pb-24">
            <ForslagKort forslag={forslag} />
          </div>
        )}
      </main>

      <footer className="bg-navy py-12 text-muted-light">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 text-sm">
          <span>© {new Date().getFullYear()} Indefinit AI</span>
          <a href="https://indefinit.ai" className="transition hover:text-white">
            indefinit.ai
          </a>
        </div>
      </footer>
    </div>
  );
}

/** Mjukt smaragdgrönt sken i heron, samma effekt som på indefinit.ai. */
function Sken() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-[10%] -top-[20%] -z-10 size-[640px] rounded-full bg-[radial-gradient(circle,rgb(27_182_138/0.22)_0%,rgb(27_182_138/0)_70%)] animate-svava motion-reduce:animate-none"
    />
  );
}
