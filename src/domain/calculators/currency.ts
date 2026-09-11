/**
 * @file currency.ts
 * @description Deterministyczny kalkulator przeliczeń walutowych (art. 358 K.c.)
 * oraz zryczałtowanej rekompensaty za koszty odzyskiwania należności
 * (art. 10 ustawy z dnia 8 marca 2013 r. o przeciwdziałaniu nadmiernym opóźnieniom w transakcjach handlowych).
 */

import { CommercialRecoveryCompensation, NbpExchangeRate } from "../models/knowledge-sources";
import { formatGroszeToPLN } from "./interest";

/**
 * Ustala próg kwotowy rekompensaty w EUR w zależności od wartości świadczenia pieniężnego w groszach:
 * - 40 EUR — gdy wartość świadczenia nie przekracza 5 000 zł;
 * - 70 EUR — gdy wartość świadczenia jest wyższa niż 5 000 zł, ale niższa niż 50 000 zł;
 * - 100 EUR — gdy wartość świadczenia jest równa lub wyższa niż 50 000 zł.
 * (art. 10 ust. 1 ustawy o transakcjach handlowych)
 */
export function getCommercialRecoveryEuroTier(debtGrosze: number): 40 | 70 | 100 {
  const threshold5kGrosze = 5_000 * 100;
  const threshold50kGrosze = 50_000 * 100;

  if (debtGrosze <= threshold5kGrosze) {
    return 40;
  }
  if (debtGrosze < threshold50kGrosze) {
    return 70;
  }
  return 100;
}

/**
 * Oblicza równowartość kwoty rekompensaty w PLN w oparciu o kurs średni euro NBP.
 * Zgodnie z art. 10 ust. 1b ustawy, do przeliczenia stosuje się średni kurs euro
 * ogłoszony przez NBP ostatniego dnia roboczego miesiąca poprzedzającego miesiąc,
 * w którym świadczenie stało się wymagalne.
 */
export function calculateCommercialRecoveryCompensation(
  invoiceValueGrosze: number,
  nbpEuroRate: NbpExchangeRate
): CommercialRecoveryCompensation {
  const euroTier = getCommercialRecoveryEuroTier(invoiceValueGrosze);

  // Wyliczenie z zaokrągleniem do grosza (1 EUR * midRate * 100 groszy)
  const rateInGroszePerEuro = Math.round(nbpEuroRate.midRate * 100);
  const totalGrosze = euroTier * rateInGroszePerEuro;

  return {
    invoiceValueGrosze,
    statutoryEuroTier: euroTier,
    nbpRateUsed: nbpEuroRate,
    calculatedPlnGrosze: totalGrosze,
    formattedPln: formatGroszeToPLN(totalGrosze),
    legalBasis: `art. 10 ust. 1 pkt ${
      euroTier === 40 ? "1" : euroTier === 70 ? "2" : "3"
    } ustawy z dnia 8 marca 2013 r. o przeciwdziałaniu nadmiernym opóźnieniom w transakcjach handlowych`,
  };
}

/**
 * Przelicza kwotę walutową na PLN według wskazanego kursu średniego NBP (art. 358 § 2 K.c.)
 */
export function convertForeignCurrencyToPlnGrosze(
  amountInForeignCurrencyCents: number,
  exchangeRate: NbpExchangeRate
): {
  plnGrosze: number;
  formattedPln: string;
  legalBasis: string;
} {
  // amountInForeignCurrencyCents / 100 * midRate * 100 groszy = amountInForeignCurrencyCents * midRate
  const plnGrosze = Math.round(amountInForeignCurrencyCents * exchangeRate.midRate);

  return {
    plnGrosze,
    formattedPln: formatGroszeToPLN(plnGrosze),
    legalBasis: `art. 358 § 2 K.c. w zw. z tabelą kursów NBP nr ${exchangeRate.tableNumber} z dnia ${exchangeRate.effectiveDate}`,
  };
}
