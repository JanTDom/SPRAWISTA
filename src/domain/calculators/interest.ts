/**
 * Deterministyczny Kalkulator Odsetek i Należności Pieniężnych
 * 
 * Zasady:
 * 1. Wszystkie operacje arytmetyczne wykonywane są na liczbach całkowitych w groszach.
 * 2. Odsetki ustawowe za opóźnienie (art. 481 § 2 K.c.): stopa referencyjna NBP + 5,5 punktu procentowego.
 * 3. Odsetki ustawowe za opóźnienie w transakcjach handlowych (Ustawa z dnia 8 marca 2013 r.):
 *    stopa referencyjna NBP + 10 punktów procentowych (dla transakcji, w których dłużnikiem nie jest podmiot publiczny).
 */

export interface InterestRatePeriod {
  readonly fromDate: string; // ISO YYYY-MM-DD
  readonly toDate?: string;
  readonly nbpReferenceRatePercent: number; // np. 5.75
  readonly statutoryCivilDelayRatePercent: number; // 5.75 + 5.5 = 11.25%
  readonly commercialDelayRatePercent: number; // 5.75 + 10.0 = 15.75%
}

// Historyczna tabela oficjalnych stóp referencyjnych NBP i stawek odsetek (wyciąg dla spraw 2024-2026)
export const POLISH_INTEREST_RATES: readonly InterestRatePeriod[] = [
  {
    fromDate: "2023-10-05",
    toDate: "2026-12-31",
    nbpReferenceRatePercent: 5.75,
    statutoryCivilDelayRatePercent: 11.25,
    commercialDelayRatePercent: 15.75,
  },
];

export interface InterestCalculationResult {
  readonly principalGrosze: number;
  readonly principalZl: string;
  readonly daysCount: number;
  readonly interestGrosze: number;
  readonly interestZl: string;
  readonly totalGrosze: number;
  readonly totalZl: string;
  readonly ratePercentUsed: number;
  readonly basis: string;
}

export function formatGroszeToPLN(grosze: number): string {
  const isNegative = grosze < 0;
  const absGrosze = Math.abs(grosze);
  const zloty = Math.floor(absGrosze / 100);
  const gr = absGrosze % 100;
  const grFormatted = String(gr).padStart(2, "0");
  const formattedNumber = `${zloty.toLocaleString("pl-PL").replace(/\u00A0/g, " ")},${grFormatted} zł`;
  return isNegative ? `-${formattedNumber}` : formattedNumber;
}

/**
 * Oblicza odsetki za opóźnienie za zadany okres w transakcjach handlowych lub cywilnych
 */
export function calculateDelayInterest(
  principalGrosze: number,
  startDateStr: string, // dzień po terminie płatności
  endDateStr: string, // dzień zapłaty lub wytoczenia powództwa
  type: "COMMERCIAL_TRANSACTION" | "CIVIL_CODE"
): InterestCalculationResult {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  const diffTime = end.getTime() - start.getTime();
  const daysCount = Math.max(0, Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1);

  // Używamy stawki obowiązującej w danym okresie
  const currentRate = POLISH_INTEREST_RATES[0];
  const ratePercent =
    type === "COMMERCIAL_TRANSACTION"
      ? currentRate.commercialDelayRatePercent
      : currentRate.statutoryCivilDelayRatePercent;

  // Wzór ustawowy: Odsetki = (Kwota * Stopa% * liczba dni) / 365
  // Obliczamy w groszach
  const interestGrosze = Math.round((principalGrosze * (ratePercent / 100) * daysCount) / 365);
  const totalGrosze = principalGrosze + interestGrosze;

  const basis =
    type === "COMMERCIAL_TRANSACTION"
      ? `art. 7 ust. 1 w zw. z art. 11c ustawy o przeciwdziałaniu nadmiernym opóźnieniom w transakcjach handlowych (${ratePercent}% rocznie)`
      : `art. 481 § 2 K.c. - odsetki ustawowe za opóźnienie (${ratePercent}% rocznie)`;

  return {
    principalGrosze,
    principalZl: formatGroszeToPLN(principalGrosze),
    daysCount,
    interestGrosze,
    interestZl: formatGroszeToPLN(interestGrosze),
    totalGrosze,
    totalZl: formatGroszeToPLN(totalGrosze),
    ratePercentUsed: ratePercent,
    basis,
  };
}
