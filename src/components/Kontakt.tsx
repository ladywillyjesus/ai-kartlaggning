import { Globe } from "lucide-react";
import ContactCards from "@/components/ui/contact-cards";

const EPOST = "info@indefinitai.com";
const LINKEDIN = "https://www.linkedin.com/in/idalmis-maria-figueredo-alarcon-685393361/";

/** Inbjudan att kontakta Indefinit AI, visas under förslaget. */
export default function Kontakt({ text }: { text: string }) {
  return (
    <section
      aria-labelledby="kontakt-rubrik"
      className="mt-16 rounded-xl border border-line bg-white px-6 py-12 text-center sm:px-12"
    >
      <p className="mb-5 text-xs font-medium uppercase tracking-[0.08em] text-brand-dark">
        Nästa steg
      </p>
      <h2
        id="kontakt-rubrik"
        className="mx-auto max-w-xl font-serif text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl"
      >
        Vill du ha en riktig analys av ert fall?
      </h2>
      <p className="mx-auto mt-5 max-w-[52ch] text-muted">{text}</p>

      <div className="mt-8 flex justify-center">
        <ContactCards
          email={EPOST}
          links={[
            {
              label: "LinkedIn",
              href: LINKEDIN,
              icon: <LinkedinIkon />,
              card: (
                <div className="flex w-64 flex-col gap-1 p-4 text-left">
                  <span className="font-medium">Idalmis Figueredo</span>
                  <span className="text-sm text-muted">Grundare av Indefinit AI · Timrå</span>
                </div>
              ),
            },
            {
              label: "indefinit.ai",
              href: "https://indefinit.ai",
              icon: <Globe className="size-6" aria-hidden="true" />,
              card: (
                <div className="flex w-64 flex-col gap-1 p-4 text-left">
                  <span className="font-medium">indefinit.ai</span>
                  <span className="text-sm text-muted">
                    AI-assistenter som byggs efter din verksamhet.
                  </span>
                </div>
              ),
            },
          ]}
        />
      </div>
      <p className="mt-4 text-sm text-muted">
        Eller skriv direkt till{" "}
        <a href={`mailto:${EPOST}`} className="text-brand-dark underline">
          {EPOST}
        </a>
      </p>
    </section>
  );
}

function LinkedinIkon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 fill-current" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.75-1.95 4 0 4.4 2.4 4.4 5.6V21h-4v-5.6c0-1.35-.03-3.1-1.9-3.1-1.9 0-2.2 1.45-2.2 2.99V21h-4V9Z" />
    </svg>
  );
}
