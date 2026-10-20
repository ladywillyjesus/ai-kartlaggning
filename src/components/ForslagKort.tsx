import { Bot, Clock, Wand2, type LucideIcon } from "lucide-react";

export type Forslag = {
  automatisera: string;
  losning: string;
  timmar: string;
};

type Kort = { rubrik: string; text: string; ikon: LucideIcon };

// Design inspirerad av "Feature Problem Cards" (Mohammad Shehadeh) på 21st.dev.
export default function ForslagKort({ forslag }: { forslag: Forslag }) {
  const kort: Kort[] = [
    { rubrik: "Det här kan automatiseras", text: forslag.automatisera, ikon: Wand2 },
    { rubrik: "Typ av AI-lösning", text: forslag.losning, ikon: Bot },
    { rubrik: "Uppskattad tidsbesparing", text: forslag.timmar, ikon: Clock },
  ];

  return (
    <section aria-labelledby="forslag-rubrik" className="mt-14">
      <div className="mb-8 text-center">
        <span className="inline-block rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Ditt förslag
        </span>
        <h2
          id="forslag-rubrik"
          className="mx-auto mt-4 max-w-xl text-2xl font-bold tracking-tight sm:text-3xl"
        >
          Så kan AI hjälpa er <span className="text-slate-400">med den här uppgiften</span>
        </h2>
      </div>

      <ul className="grid gap-4 md:grid-cols-3">
        {kort.map(({ rubrik, text, ikon: Ikon }, i) => (
          <li
            key={rubrik}
            style={{ animationDelay: `${i * 150}ms` }}
            className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm animate-tona-upp motion-reduce:animate-none"
          >
            <Orb ikon={Ikon} />
            <h3 className="mt-5 font-semibold">{rubrik}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Ikon i koncentriska ringar med ett mjukt grönt sken. */
function Orb({ ikon: Ikon }: { ikon: LucideIcon }) {
  return (
    <div className="relative grid size-24 place-items-center" aria-hidden="true">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,var(--color-brand)_0%,transparent_70%)] opacity-25" />
      <div className="absolute inset-0 rounded-full border border-dashed border-slate-200" />
      <div className="absolute inset-3 rounded-full border border-slate-200" />
      <div className="relative grid size-12 place-items-center rounded-full border border-slate-200 bg-white shadow-sm">
        <Ikon className="size-5 text-brand-dark" strokeWidth={2} />
      </div>
    </div>
  );
}
