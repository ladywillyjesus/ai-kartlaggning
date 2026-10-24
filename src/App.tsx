import { useEffect, useRef, useState } from "react";
import KartlaggningForm, { type FormData } from "@/components/KartlaggningForm";
import ForslagKort from "@/components/ForslagKort";
import Kontakt from "@/components/Kontakt";
import type { Svar } from "@/types";

export default function App() {
  const [svar, setSvar] = useState<Svar | null>(null);
  const [laddar, setLaddar] = useState(false);
  const [felmeddelande, setFelmeddelande] = useState<string | null>(null);
  const resultatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (svar || felmeddelande)
      resultatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [svar, felmeddelande]);

  async function hamtaForslag(data: FormData) {
    setLaddar(true);
    setFelmeddelande(null);
    try {
      // Serverfunktionen sparar namn och e-post (om de angetts) men skickar dem aldrig till AI:n.
      const res = await fetch("/api/forslag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || !body) {
        setSvar(null);
        setFelmeddelande(body?.fel ?? "Något gick fel. Försök igen om en stund.");
        return;
      }
      setSvar(body as Svar);
    } catch {
      setSvar(null);
      setFelmeddelande("Kunde inte nå tjänsten. Kontrollera din internetanslutning och försök igen.");
    } finally {
      setLaddar(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-5 py-5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <a href="https://indefinitai.com" className="flex flex-col gap-1.5 no-underline">
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
            href="https://indefinitai.com"
            className="text-[15px] font-medium text-muted transition hover:text-brand-dark"
          >
            ← Till indefinitai.com
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

            <KartlaggningForm onSkicka={hamtaForslag} laddar={laddar} />
          </div>
        </div>

        <div ref={resultatRef} className="mx-auto max-w-6xl scroll-mt-6 px-5" aria-live="polite">
          {felmeddelande && (
            <p
              role="alert"
              className="mx-auto mt-12 max-w-2xl rounded-xl border border-red-200 bg-red-50 p-5 text-center text-red-700"
            >
              {felmeddelande}
            </p>
          )}
          {svar && (
            <div className="pb-24">
              <ForslagKort svar={svar} />
              <Kontakt text={svar.avslutning} />
            </div>
          )}
        </div>
      </main>

      <footer className="bg-navy py-12 text-muted-light">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 text-sm">
          <span>© {new Date().getFullYear()} Indefinit AI</span>
          <a href="https://indefinitai.com" className="transition hover:text-white">
            indefinitai.com
          </a>
        </div>
      </footer>
    </div>
  );
}

/** Mjukt smaragdgrönt sken i heron, samma effekt som på indefinitai.com. */
function Sken() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-[10%] -top-[20%] -z-10 size-[640px] rounded-full bg-[radial-gradient(circle,rgb(27_182_138/0.22)_0%,rgb(27_182_138/0)_70%)] animate-svava motion-reduce:animate-none"
    />
  );
}
