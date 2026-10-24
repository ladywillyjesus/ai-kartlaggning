/**
 * ContactCards – kontaktrad med en knapp som kopierar e-postadressen och länkar
 * med egna kort som visas när man håller muspekaren över ikonen.
 *
 * Baserad på komponenten "ContactCards" från 21st.dev, anpassad till svenska och
 * indefinitai.com:s varumärke (GitHub-kortet och dess externa API är borttagna).
 */

import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";

export type ContactLink = {
  label: string;
  href: string;
  icon: ReactNode;
  /** Visas ovanför raden när länken hovras. Ge kortet en fast bredd. */
  card: ReactNode;
};

type Props = {
  email?: string;
  links?: ContactLink[];
  labels?: { copy?: string; copied?: string };
  className?: string;
};

const KEYFRAMES = `
@keyframes cc-in {
	from { opacity: 0; transform: translateX(calc(var(--cc-dir, 1) * 64px)) scale(0.97); filter: blur(6px); }
}
@keyframes cc-out {
	to { opacity: 0; transform: translateX(calc(var(--cc-dir, 1) * -64px)) scale(0.97); filter: blur(6px); }
}`;

export default function ContactCards({ email, links = [], labels, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  /** Kortet som byts ut, kvar tills utgångsanimationen är klar. */
  const [outgoing, setOutgoing] = useState<{ index: number; direction: number; key: number }>();
  const [entryKey, setEntryKey] = useState(0);
  const [box, setBox] = useState({ left: 0, width: 0, height: 0 });
  /** Första kortet visas på plats; bara senare kort glider från föregående storlek. */
  const [morphing, setMorphing] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useLayoutEffect(() => {
    const content = contentRef.current;
    const link = linkRefs.current[index];
    if (!open || !content || !link) return;
    setBox({
      left: link.offsetLeft + link.offsetWidth / 2,
      width: content.offsetWidth,
      height: content.offsetHeight,
    });
  }, [open, index]);

  // `animationend` körs inte när fliken är dold eller rörelse är reducerad,
  // så det utgående kortet tas också bort med en timer.
  useEffect(() => {
    if (!outgoing) return;
    const timeout = setTimeout(() => setOutgoing(undefined), 400);
    return () => clearTimeout(timeout);
  }, [outgoing]);

  function handleEnter(next: number) {
    if (open && next === index) return;
    if (open) {
      setOutgoing({ index, direction: Math.sign(next - index) || 1, key: entryKey });
      setDirection(Math.sign(next - index) || 1);
    }
    setMorphing(open);
    setIndex(next);
    setEntryKey((key) => key + 1);
    setOpen(true);
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <style>{KEYFRAMES}</style>

      {email && <CopyEmailButton email={email} labels={labels} />}

      <div
        className="relative flex"
        onMouseLeave={() => {
          setOpen(false);
          setOutgoing(undefined);
          setMorphing(false);
        }}
      >
        {links.map((item, itemIndex) => (
          <a
            key={item.label}
            ref={(node) => {
              linkRefs.current[itemIndex] = node;
            }}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            onMouseEnter={() => handleEnter(itemIndex)}
            onFocus={() => handleEnter(itemIndex)}
            onBlur={() => setOpen(false)}
            className="z-10 rounded-lg p-2 text-muted transition-colors hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {item.icon}
          </a>
        ))}

        <div
          aria-hidden={!open}
          // `contain: paint` håller de rundade hörnen intakta medan korten animeras med blur.
          style={{ left: box.left, width: box.width, height: box.height, contain: "paint" }}
          className={`absolute bottom-[calc(100%+0.5rem)] flex origin-bottom items-end overflow-hidden rounded-xl border border-line bg-white shadow-[0_16px_32px_-20px_rgb(20_36_59/0.35)]
            ${
              morphing
                ? "transition-[left,width,height,opacity,transform] duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]"
                : "transition-[opacity,transform] duration-200 ease-out"
            }
            ${
              open
                ? "-translate-x-1/2 scale-100 opacity-100"
                : "pointer-events-none -translate-x-1/2 translate-y-1 scale-[0.97] opacity-0"
            }`}
        >
          {outgoing && (
            <div
              key={`out-${outgoing.key}`}
              onAnimationEnd={(event) => {
                if (event.target === event.currentTarget) setOutgoing(undefined);
              }}
              style={
                {
                  "--cc-dir": outgoing.direction,
                  animation: "cc-out 0.35s cubic-bezier(0.32,0.72,0,1) forwards",
                } as React.CSSProperties
              }
              className="absolute"
            >
              {links[outgoing.index]?.card}
            </div>
          )}
          <div
            key={`in-${entryKey}`}
            ref={contentRef}
            style={
              {
                "--cc-dir": direction,
                animation: morphing ? "cc-in 0.4s cubic-bezier(0.32,0.72,0,1) backwards" : undefined,
              } as React.CSSProperties
            }
            className="absolute"
          >
            {links[index]?.card}
          </div>
        </div>

        {/* Brygga för pekaren, så att kortet förblir öppet på väg mot det. */}
        <div className="absolute inset-0 -top-2" />
      </div>
    </div>
  );
}

/**
 * Kopierar utan att lämna sidan: först det asynkrona urklippet, sedan den äldre
 * `execCommand`-vägen, och om båda misslyckas visar knappen adressen.
 */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    /* fortsätt */
  }
  try {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.cssText = "position:fixed;top:0;left:0;opacity:0";
    document.body.append(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    return copied;
  } catch {
    return false;
  }
}

export function CopyEmailButton({
  email,
  labels,
  className = "",
}: {
  email: string;
  labels?: { copy?: string; copied?: string };
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "manual">("idle");
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timeout.current), []);

  async function copy() {
    const copied = await copyText(email);
    setState(copied ? "copied" : "manual");
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setState("idle"), copied ? 3000 : 8000);
  }

  const label = labels?.copy ?? "Kopiera e-postadress";
  const copiedLabel = labels?.copied ?? "E-post kopierad!";

  return (
    <button
      type="button"
      onClick={copy}
      className={`relative flex cursor-pointer items-center justify-center rounded-xl border border-line bg-white px-6 py-3 font-medium text-ink transition-all hover:border-brand hover:text-brand-dark active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40 ${className}`}
    >
      <span className={`transition-all duration-500 ${state === "idle" ? "" : "opacity-0 blur-[2px]"}`}>
        {label}
      </span>
      <span
        aria-live="polite"
        className={`absolute transition-all duration-500 ${state === "idle" ? "opacity-0 blur-[2px]" : ""}`}
      >
        {state === "manual" ? email : state === "copied" ? copiedLabel : ""}
      </span>
    </button>
  );
}
