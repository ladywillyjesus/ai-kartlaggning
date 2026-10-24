import { Clock, Info, Lightbulb, ListChecks, type LucideIcon } from "lucide-react";
import type { Svar } from "@/types";

type Kort = { rubrik: string; text: string; ikon: LucideIcon; markering?: string };

const timFormat = new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 1 });

// Layout inspirerad av "Feature Problem Cards" (Mohammad Shehadeh) på 21st.dev,
// i indefinitai.com:s varumärke.
export default function ForslagKort({ svar }: { svar: Svar }) {
  if (svar.typ !== "forslag") return <Meddelande svar={svar} />;

  const intervall =
    svar.timmar_max > 0
      ? `${timFormat.format(svar.timmar_min)}–${timFormat.format(svar.timmar_max)} h/vecka`
      : undefined;

  const kort: Kort[] = [
    { rubrik: "Det här kan automatiseras", text: svar.automatisera, ikon: ListChecks },
    { rubrik: "Typ av AI-lösning", text: svar.losning, ikon: Lightbulb },
    {
      rubrik: "Uppskattad tidsbesparing",
      text: svar.tidsbesparing,
      ikon: Clock,
      markering: intervall,
    },
  ];

  return (
    <section aria-labelledby="forslag-rubrik" className="pt-20">
      <div className="mb-12 text-center">
        <p className="mb-5 text-xs font-medium uppercase tracking-[0.08em] text-brand-dark">
          Ditt förslag
        </p>
        <h2
          id="forslag-rubrik"
          className="mx-auto max-w-2xl font-serif text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl"
        >
          Så kan AI hjälpa er{" "}
          <em className="font-medium italic text-brand-dark">med den här uppgiften</em>
        </h2>
      </div>

      <ul className="grid gap-5 md:grid-cols-3">
        {kort.map(({ rubrik, text, ikon: Ikon, markering }, i) => (
          <li
            key={rubrik}
            style={{ animationDelay: `${i * 150}ms` }}
            className="flex flex-col items-center rounded-xl border border-line bg-white p-7 text-center transition duration-300 animate-tona-upp hover:-translate-y-1.5 hover:border-brand hover:shadow-[0_16px_32px_-20px_rgb(20_36_59/0.35)] motion-reduce:animate-none motion-reduce:transform-none"
          >
            <Orb ikon={Ikon} />
            <h3 className="mt-5 text-lg font-medium">{rubrik}</h3>
            {markering && (
              <p className="mt-2 font-serif text-3xl font-semibold text-brand-dark">{markering}</p>
            )}
            <p className="mt-2 text-muted">{text}</p>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-center text-sm text-muted">
        Uppskattningen är ungefärlig och bygger enbart på din beskrivning.
      </p>
    </section>
  );
}

/** Visas när beskrivningen är för vag eller när AI inte passar uppgiften. */
function Meddelande({ svar }: { svar: Svar }) {
  const rubrik =
    svar.typ === "mer_information" ? "Vi behöver veta lite mer" : "AI är kanske inte rätt väg här";

  return (
    <section aria-labelledby="forslag-rubrik" className="pt-20">
      <div className="mx-auto max-w-2xl rounded-xl border border-line bg-white p-8 text-center animate-tona-upp motion-reduce:animate-none">
        <div className="flex justify-center">
          <Orb ikon={Info} />
        </div>
        <h2 id="forslag-rubrik" className="mt-5 font-serif text-3xl font-bold tracking-tight">
          {rubrik}
        </h2>
        <p className="mt-4 text-muted">{svar.meddelande}</p>
        {svar.typ === "mer_information" && (
          <p className="mt-4 text-sm text-muted">
            Komplettera beskrivningen i formuläret ovan och skicka igen.
          </p>
        )}
      </div>
    </section>
  );
}

/** Ikon i koncentriska ringar med ett mjukt smaragdgrönt sken. */
function Orb({ ikon: Ikon }: { ikon: LucideIcon }) {
  return (
    <div className="relative grid size-24 place-items-center" aria-hidden="true">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgb(27_182_138/0.22)_0%,transparent_70%)]" />
      <div className="absolute inset-0 rounded-full border border-dashed border-line" />
      <div className="absolute inset-3 rounded-full border border-line" />
      <div className="relative grid size-12 place-items-center rounded-full border border-line bg-white">
        <Ikon className="size-5 text-brand-dark" strokeWidth={2} />
      </div>
    </div>
  );
}
