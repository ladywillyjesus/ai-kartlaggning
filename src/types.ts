/** Svaret från serverfunktionen /api/forslag (samma struktur som Claude returnerar). */
export type Svar = {
  typ: "forslag" | "mer_information" | "ej_lamplig";
  automatisera: string;
  losning: string;
  tidsbesparing: string;
  timmar_min: number;
  timmar_max: number;
  meddelande: string;
  avslutning: string;
};
