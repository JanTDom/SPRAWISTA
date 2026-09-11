/**
 * Deterministyczny Kalkulator Terminów Procesowych (K.p.c. i K.c.)
 * 
 * Zasady:
 * 1. Termin na odpowiedź na pozew wynosi 14 dni od daty doręczenia (art. 203[1] K.p.c.).
 * 2. art. 115 K.c.: Jeżeli koniec terminu przypada na dzień uznany ustawowo za wolny od pracy
 *    lub na sobotę, termin upływa następnego dnia, który nie jest dniem wolnym ani sobotą.
 * 3. art. 165 § 2 K.p.c.: Oddanie pisma procesowego w polskiej placówce pocztowej operatora
 *    wyznaczonego (Poczta Polska) jest równoznaczne z wniesieniem go do sądu.
 */

export interface PolishHoliday {
  readonly month: number; // 1-12
  readonly day: number;
  readonly name: string;
}

// Stałe święta państwowe w Polsce (Ustawa o dniach wolnych od pracy z dnia 18 stycznia 1951 r.)
export const FIXED_POLISH_HOLIDAYS: readonly PolishHoliday[] = [
  { month: 1, day: 1, name: "Nowy Rok" },
  { month: 1, day: 6, name: "Święto Trzech Króli" },
  { month: 5, day: 1, name: "Święto Państwowe (Święto Pracy)" },
  { month: 5, day: 3, name: "Święto Narodowe Trzeciego Maja" },
  { month: 8, day: 15, name: "Wniebowzięcie Najświętszej Maryi Panny" },
  { month: 11, day: 1, name: "Wszystkich Świętych" },
  { month: 11, day: 11, name: "Narodowe Święto Niepodległości" },
  { month: 12, day: 25, name: "Pierwszy dzień Bożego Narodzenia" },
  { month: 12, day: 26, name: "Drugi dzień Bożego Narodzenia" },
];

/**
 * Oblicza datę Wielkanocy dla danego roku (Algorytm Meeusa/Jonesa/Butchera)
 */
export function getEasterSunday(year: number): { month: number; day: number } {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return { month, day };
}

/**
 * Zwraca listę wszystkich świąt ustawowo wolnych od pracy dla danego roku
 */
export function getPolishHolidaysForYear(year: number): Set<string> {
  const holidaySet = new Set<string>();

  for (const h of FIXED_POLISH_HOLIDAYS) {
    const mm = String(h.month).padStart(2, "0");
    const dd = String(h.day).padStart(2, "0");
    holidaySet.add(`${year}-${mm}-${dd}`);
  }

  // Święta ruchome
  const easter = getEasterSunday(year);
  const easterDate = new Date(Date.UTC(year, easter.month - 1, easter.day));

  // Poniedziałek Wielkanocny (+1 dzień)
  const easterMonday = new Date(easterDate);
  easterMonday.setUTCDate(easterDate.getUTCDate() + 1);
  holidaySet.add(easterMonday.toISOString().slice(0, 10));

  // Boże Ciało (+60 dni od Wielkanocy)
  const corpusChristi = new Date(easterDate);
  corpusChristi.setUTCDate(easterDate.getUTCDate() + 60);
  holidaySet.add(corpusChristi.toISOString().slice(0, 10));

  return holidaySet;
}

/**
 * Sprawdza, czy dana data (YYYY-MM-DD) jest dniem wolnym w rozumieniu art. 115 K.c. (sobota, niedziela lub święto państwowe)
 */
export function isNonBusinessDay(dateStr: string): boolean {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const dayOfWeek = date.getUTCDay(); // 0 = Niedziela, 6 = Sobota

  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return true;
  }

  const holidays = getPolishHolidaysForYear(y);
  return holidays.has(dateStr);
}

/**
 * Oblicza ostateczny termin na wniesienie odpowiedzi na pozew (14 dni od daty doręczenia)
 * z uwzględnieniem reguły art. 115 K.c.
 */
export function calculateAnswerDeadline(dateDeliveredStr: string): {
  readonly raw14DaysDate: string;
  readonly finalDeadlineDate: string;
  readonly adjustedForWeekendOrHoliday: boolean;
  readonly note: string;
} {
  const [y, m, d] = dateDeliveredStr.split("-").map(Number);
  const deliveryDate = new Date(Date.UTC(y, m - 1, d));

  // Dodajemy 14 dni kalendarzowych
  const rawTargetDate = new Date(deliveryDate);
  rawTargetDate.setUTCDate(deliveryDate.getUTCDate() + 14);

  const raw14DaysDate = rawTargetDate.toISOString().slice(0, 10);
  let finalTargetDate = new Date(rawTargetDate);
  let adjusted = false;

  // Sprawdzamy czy termin przypada na sobotę, niedzielę lub święto
  while (isNonBusinessDay(finalTargetDate.toISOString().slice(0, 10))) {
    adjusted = true;
    finalTargetDate.setUTCDate(finalTargetDate.getUTCDate() + 1);
  }

  const finalDeadlineDate = finalTargetDate.toISOString().slice(0, 10);

  const note = adjusted
    ? `Termin 14 dni upływał w dniu ${raw14DaysDate} (dzień wolny/sobota). Zgodnie z art. 115 K.c. termin upływa w pierwszym kolejnym dniu roboczym: ${finalDeadlineDate}.`
    : `Termin 14 dni upływa w dniu roboczym: ${finalDeadlineDate}.`;

  return {
    raw14DaysDate,
    finalDeadlineDate,
    adjustedForWeekendOrHoliday: adjusted,
    note,
  };
}
