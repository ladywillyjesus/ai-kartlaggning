import { useState, type FormEvent } from "react";

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
  "w-full rounded-lg border bg-white px-3 py-2.5 text-base outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30";

export default function KartlaggningForm() {
  const [data, setData] = useState<FormData>(TOMT);
  const [fel, setFel] = useState<Fel>({});
  const [skickat, setSkickat] = useState(false);

  function uppdatera(falt: keyof FormData, varde: string) {
    setData((d) => ({ ...d, [falt]: varde }));
    if (fel[falt]) setFel((f) => ({ ...f, [falt]: undefined }));
  }

  function skicka(e: FormEvent) {
    e.preventDefault();
    const nyaFel = validera(data);
    setFel(nyaFel);
    if (Object.keys(nyaFel).length > 0) return;
    // Steg 4: här anropas serverfunktionen som frågar Claude.
    setSkickat(true);
  }

  const kantfarg = (falt: keyof FormData) => (fel[falt] ? "border-red-400" : "border-slate-300");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <form onSubmit={skicka} noValidate className="space-y-6">
        <div>
          <label htmlFor="bransch" className="mb-1.5 block font-medium">
            Bransch
          </label>
          <select
            id="bransch"
            value={data.bransch}
            onChange={(e) => uppdatera("bransch", e.target.value)}
            aria-invalid={!!fel.bransch}
            aria-describedby={fel.bransch ? "bransch-fel" : undefined}
            className={`${faltKlass} ${kantfarg("bransch")}`}
          >
            <option value="">Välj bransch …</option>
            {BRANSCHER.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          {fel.bransch && (
            <p id="bransch-fel" className="mt-1.5 text-sm text-red-600">
              {fel.bransch}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="uppgift" className="mb-1.5 block font-medium">
            Vilken uppgift tar mycket tid?
          </label>
          <p id="uppgift-hjalp" className="mb-2 text-sm text-slate-500">
            Beskriv vad ni gör, hur ofta och vad som är tidskrävande. Exempel: ”Vi svarar på
            liknande kundfrågor via e-post varje dag och letar upp information i olika system.”
          </p>
          <textarea
            id="uppgift"
            rows={5}
            value={data.uppgift}
            onChange={(e) => uppdatera("uppgift", e.target.value)}
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
          <label htmlFor="timmar" className="mb-1.5 block font-medium">
            Hur många timmar i veckan läggs på uppgiften?
          </label>
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
            className={`${faltKlass} ${kantfarg("timmar")} max-w-40`}
          />
          {fel.timmar && (
            <p id="timmar-fel" className="mt-1.5 text-sm text-red-600">
              {fel.timmar}
            </p>
          )}
        </div>

        <fieldset className="rounded-xl bg-slate-50 p-4 sm:p-5">
          <legend className="sr-only">Kontaktuppgifter (frivilligt)</legend>
          <p className="mb-1 font-medium">Vill du att vi kontaktar dig? (frivilligt)</p>
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
                className={`${faltKlass} border-slate-300`}
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
          className="w-full rounded-lg bg-brand px-6 py-3 font-semibold text-slate-900 transition hover:bg-brand-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 sm:w-auto"
        >
          Få mitt AI-förslag
        </button>
      </form>

      {skickat && (
        <div
          role="status"
          className="mt-6 rounded-xl border border-brand/30 bg-brand-light p-4 text-sm text-brand-dark"
        >
          Tack! Formuläret fungerar. Här kommer ditt AI-förslag att visas när kopplingen till AI är
          på plats.
        </div>
      )}
    </div>
  );
}
