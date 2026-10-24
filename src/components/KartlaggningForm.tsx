import { useState, type FormEvent } from "react";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";

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
  "w-full rounded-xl border bg-white px-3.5 py-2.5 text-base leading-normal text-ink outline-none transition placeholder:text-muted/60 focus:border-brand focus:ring-4 focus:ring-brand/15";

// Layout inspirerad av "Contact" (Ravi Katiyar) på 21st.dev, i indefinitai.com:s varumärke.
export default function KartlaggningForm({
  onSkicka,
  laddar,
}: {
  onSkicka: (data: FormData) => void;
  laddar: boolean;
}) {
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
    if (Object.keys(nyaFel).length > 0 || laddar) return;
    onSkicka(data);
  }

  const kantfarg = (falt: keyof FormData) => (fel[falt] ? "border-red-400" : "border-line");

  return (
    <div className="rounded-xl border border-line bg-white p-5 text-ink shadow-[0_24px_48px_-24px_rgb(0_0_0/0.45)] sm:p-8">
      <form onSubmit={skicka} noValidate className="space-y-7">
        <fieldset aria-describedby={fel.bransch ? "bransch-fel" : undefined}>
          <legend className="mb-3 font-medium">Vilken bransch är ni i?</legend>
          <div className="flex flex-wrap gap-2">
            {BRANSCHER.map((b) => {
              const vald = data.bransch === b;
              return (
                <label
                  key={b}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm leading-normal transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand/30 ${
                    vald
                      ? "border-brand bg-brand font-medium text-white"
                      : "border-line bg-white text-ink hover:border-brand hover:text-brand-dark"
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
          <label htmlFor="uppgift" className="mb-1.5 block font-medium">
            Vilken uppgift tar mycket tid?
          </label>
          <p id="uppgift-hjalp" className="mb-2.5 text-sm text-muted">
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
          <label htmlFor="timmar" className="mb-2.5 block font-medium">
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
            <span className="text-muted">timmar/vecka</span>
          </div>
          {fel.timmar && (
            <p id="timmar-fel" className="mt-1.5 text-sm text-red-600">
              {fel.timmar}
            </p>
          )}
        </div>

        <fieldset className="rounded-xl border border-line bg-cloud p-4 sm:p-5">
          <legend className="sr-only">Kontaktuppgifter (frivilligt)</legend>
          <p className="mb-1 font-medium">Vill du att vi kontaktar dig? (frivilligt)</p>
          <p className="mb-4 text-sm text-muted">
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
                className={`${faltKlass} border-line`}
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
          disabled={laddar}
          aria-busy={laddar}
          className="group flex disabled:cursor-wait disabled:opacity-80 disabled:hover:translate-y-0 disabled:hover:scale-100 w-full items-center justify-center gap-2 rounded-xl bg-brand px-8 py-4 text-[17px] font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-brand-dark hover:shadow-[0_12px_24px_-10px_rgb(27_182_138/0.5)] active:translate-y-0 active:scale-[0.99] focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/40 motion-reduce:transform-none sm:w-auto"
        >
          {laddar ? (
            <>
              Analyserar …
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            </>
          ) : (
            <>
              Få mitt AI-förslag
              <ArrowRight
                className="size-4 transition group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
