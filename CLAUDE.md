# AI-kartläggning – instruktioner för Claude Code

Webbverktyg för små svenska företag: företaget beskriver en återkommande arbetsuppgift och får direkt ett förslag på hur den kan lösas med AI, med en ungefärlig uppskattning av sparad tid. Byggt av Idalmis Figueredo för Indefinit AI.

## Språk
- All text på webbplatsen, alla AI-svar och alla commit-meddelanden skrivs på **svenska**.

## Teknik
- React + Tailwind CSS (komponenter från 21st.dev läggs till efterhand).
- Varumärkesfärg: limegrön `#64D64F` från logotypen (som yta, med mörk text ovanpå). Mörkare grön `#2F7D22` för grön text på vit bakgrund. Typsnitt: Inter.
- Logotypen ligger i `public/logo-icon.png`.
- Anropet till Claude API görs i en serverfunktion (Cloudflare Pages Functions), aldrig från webbläsaren.
- Förfrågningar sparas i Supabase.
- Publiceras på Cloudflare Pages: kartlaggning.indefinit.ai.
- Ska fungera bra på mobil.

## Säkerhet
- Inga API-nycklar eller lösenord i koden eller i repot. Lokalt ligger de i `.dev.vars` / `.env` (ignoreras av git), i produktion som miljövariabler i Cloudflare.
- Konfigurationen för 21st.dev Magic MCP sparas på användarnivå, aldrig i projektet.
- Kontrollera alltid `git status` och innehållet innan commit så att inga hemligheter följer med.
- E-post sparas bara om användaren själv anger den, med en kort GDPR-text om hur den används.

## Arbetssätt
- Ett steg i taget enligt arbetsordningen nedan, en commit per steg, därefter push till GitHub.
- Förklara varje kommando på spanska för Idalmis innan det körs, och vänta på hennes bekräftelse innan nästa steg.

## Arbetsordning
1. Skapa repot på GitHub och koppla det till Claude Code.
2. Startsida med introduktion och formulär, utan kopplingar.
3. Design med komponenter från 21st.dev.
4. Koppling till Claude API.
5. Koppling till Supabase.
6. Publicering på Cloudflare Pages.
7. Knapp på indefinit.ai som leder till verktyget.
8. README.

## Utanför denna version
Adminpanel, betalningar, användarkonton och flera språk.
