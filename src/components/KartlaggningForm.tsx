import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";

const BRANSCHER = [
  "Bygg och hantverk",
  "Butik och e-handel",
  "Restaurang och café",
  "Konsult och tjänster",
  "Redovisning och ekonomi",
  "Fastighet",
  "Hälsa, vård och skönhet",
  "Transport och logistik",
  "Tillverkning",
  "Annat",
];

const MIN_UPPGIFT = 20;
const MAX_TIMMAR = 60;

export type FormData = {
  bransch: string;
  uppgift: string;
  timmar: string;
  namn: string;
  epost: string;
};

type Fel = Partial<Record<keyof FormData, string>>;

const TOMT: FormData = { bransch: "", uppgift: "", timmar: "", namn: "", epost: "" };

function validera(data: FormData): Fel {
  const fel: Fel = {};
  if (!data.bransch) fel.bransch = "Välj en bransch.";
  if (data.uppgift.trim().length < MIN_UPPGIFT)
    fel.uppgift = `Beskriv uppgiften med minst ${MIN_UPPGIFT} tecken.`;
  const timmar = Number(data.timmar);
  if (!data.timmar || !Number.isFinite(timmar) || timmar <= 0 || timmar > MAX_TIMMAR)
    fel.timmar = `Ange ett antal timmar mellan 1 och ${MAX_TIMMAR}.`;
  if (data.epost && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.epost))
    fel.epost = "Ange en giltig e-postadress, eller lämna fältet tomt.";
  return fel;
}

const faltKlass =
  "w-full rounded-xl border bg-white/80 px-3.5 py-2.5 text-base outline-none transition placeholder:text-slate-400 focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/20";

// Design inspirerad av "Contact" (Ravi Katiyar) på 21st.dev.
export default function KartlaggningForm({ onSkicka }: { onSkicka: (data: FormData) => void }) {
  const [data, setData] = useState<FormData>(TOMT);
  const [fel, setFel] = useState<Fel>({});

  function uppdatera(falt: keyof FormData, varde: string) {
    setData((d) => ({ ...d, [falt]: varde }));
    if (fel[falt]) setFel((f) => ({ ...f, [falt]: undefined }));
  }

  function skicka(e: FormEvent) {
    e.preventDefault();
    const nyaFel = validera(data);
    setFel(nyaFel);
    if (Object.keys(nyaFel).length > 0) return;
    onSkicka(data);
  }

  const kantfarg = (falt: keyof FormData) => (fel[falt] ? "border-red-400" : "border-slate-200");

  return (
    <div className="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:p-8">
      <form onSubmit={skicka} noValidate className="space-y-7">
        <fieldset aria-describedby={fel.bransch ? "bransch-fel" : undefined}>
          <legend className="mb-3 font-semibold">Vilken bransch är ni i?</legend>
          <div className="flex flex-wrap gap-2">
            {BRANSCHER.map((b) => {
              const vald = data.bransch === b;
              return (
                <label
                  key={b}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand/30 ${
                    vald
                      ? "border-brand bg-brand text-slate-900 font-medium"
                      : "border-slate-200 bg-white/80 text-slate-700 hover:border-brand"
                  }`}
                >
                  <input
                    type="radio"
                    name="bransch"
                    value={b}
                    checked={vald}
                    onChange={() => uppdatera("bransch", b)}
                    className="sr-only"
                  />
                  {vald && <Check className="size-3.5" aria-hidden="true" />}
                  {b}
                </label>
              );
            })}
          </div>
          {fel.bransch && (
            <p id="bransch-fel" className="mt-2 text-sm text-red-600">
              {fel.bransch}
            </p>
          )}
        </fieldset>

        <div>
          <label htmlFor="uppgift" className="mb-1.5 block font-semibold">
            Vilken uppgift tar mycket tid?
          </label>
          <p id="uppgift-hjalp" className="mb-2.5 text-sm text-slate-500">
            Beskriv vad ni gör, hur ofta och vad som är tidskrävande.
          </p>
          <textarea
            id="uppgift"
            rows={5}
            value={data.uppgift}
            onChange={(e) => uppdatera("uppgift", e.target.value)}
            placeholder="Till exempel: Vi svarar på liknande kundfrågor via e-post varje dag och letar upp information i olika system."
            aria-invalid={!!fel.uppgift}
            aria-describedby={fel.uppgift ? "uppgift-hjalp uppgift-fel" : "uppgift-hjalp"}
            className={`${faltKlass} ${kantfarg("uppgift")} resize-y`}
          />
          {fel.uppgift && (
            <p id="uppgift-fel" className="mt-1.5 text-sm text-red-600">
              {fel.uppgift}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="timmar" className="mb-2.5 block font-semibold">
            Hur många timmar i veckan läggs på uppgiften?
          </label>
          <div className="flex items-center gap-3">
            <input
              id="timmar"
              type="number"
              inputMode="decimal"
              min={1}
              max={MAX_TIMMAR}
              step={0.5}
              value={data.timmar}
              onChange={(e) => uppdatera("timmar", e.target.value)}
              aria-invalid={!!fel.timmar}
              aria-describedby={fel.timmar ? "timmar-fel" : undefined}
              className={`${faltKlass} ${kantfarg("timmar")} max-w-28`}
            />
            <span className="text-slate-500">timmar/vecka</span>
          </div>
          {fel.timmar && (
            <p id="timmar-fel" className="mt-1.5 text-sm text-red-600">
              {fel.timmar}
            </p>
          )}
        </div>

        <fieldset className="rounded-2xl border border-slate-200/70 bg-white/60 p-4 sm:p-5">
          <legend className="sr-only">Kontaktuppgifter (frivilligt)</legend>
          <p className="mb-1 font-semibold">Vill du att vi kontaktar dig? (frivilligt)</p>
          <p className="mb-4 text-sm text-slate-500">
            Fyll bara i om du vill att Indefinit AI hör av sig om din förfrågan. Vi använder
            uppgifterna enbart för att kontakta dig och delar dem inte med någon annan. Du kan när
            som helst be oss radera dem.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="namn" className="mb-1.5 block text-sm font-medium">
                Namn
              </label>
              <input
                id="namn"
                type="text"
                autoComplete="name"
                value={data.namn}
                onChange={(e) => uppdatera("namn", e.target.value)}
                className={`${faltKlass} border-slate-200`}
              />
            </div>
            <div>
              <label htmlFor="epost" className="mb-1.5 block text-sm font-medium">
                E-post
              </label>
              <input
                id="epost"
                type="email"
                autoComplete="email"
                value={data.epost}
                onChange={(e) => uppdatera("epost", e.target.value)}
                aria-invalid={!!fel.epost}
                aria-describedby={fel.epost ? "epost-fel" : undefined}
                className={`${faltKlass} ${kantfarg("epost")}`}
              />
              {fel.epost && (
                <p id="epost-fel" className="mt-1.5 text-sm text-red-600">
                  {fel.epost}
                </p>
              )}
            </div>
          </div>
        </fieldset>

        <button
          type="submit"
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/40 sm:w-auto"
        >
          Få mitt AI-förslag
          <ArrowRight
            className="size-4 transition group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </button>
      </form>
    </div>
  );
}
