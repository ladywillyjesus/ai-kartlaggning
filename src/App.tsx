import KartlaggningForm from "@/components/KartlaggningForm";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
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

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:py-16">
        <section className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-dark">
            AI-kartläggning
          </p>
          <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Upptäck hur AI kan spara tid i ditt företag
          </h1>
          <p className="text-lg text-slate-600">
            Beskriv en arbetsuppgift som tar mycket tid varje vecka. På några sekunder får du ett
            förslag på vad som kan automatiseras, vilken typ av AI-lösning som passar och ungefär
            hur många timmar ni kan spara.
          </p>
        </section>

        <KartlaggningForm />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-6 text-sm text-slate-500">
          © {new Date().getFullYear()} Indefinit AI ·{" "}
          <a href="https://indefinit.ai" className="underline hover:text-brand-dark">
            indefinit.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
