import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getCommercialRecoveryEuroTier,
  calculateCommercialRecoveryCompensation,
  convertForeignCurrencyToPlnGrosze,
} from "../../src/domain/calculators/currency.ts";

test("Progi kwotowe rekompensaty 40/70/100 EUR w transakcjach handlowych", () => {
  // Poniżej lub równe 5 000 zł (500 000 gr) -> 40 EUR
  assert.equal(getCommercialRecoveryEuroTier(100_000), 40); // 1 000 zł
  assert.equal(getCommercialRecoveryEuroTier(500_000), 40); // 5 000 zł

  // Od 5 000 zł do 50 000 zł -> 70 EUR
  assert.equal(getCommercialRecoveryEuroTier(500_001), 70);
  assert.equal(getCommercialRecoveryEuroTier(1_476_000), 70); // 14 760 zł
  assert.equal(getCommercialRecoveryEuroTier(4_999_999), 70);

  // Równe lub powyżej 50 000 zł (5 000 000 gr) -> 100 EUR
  assert.equal(getCommercialRecoveryEuroTier(5_000_000), 100); // 50 000 zł
  assert.equal(getCommercialRecoveryEuroTier(14_760_000), 100); // 147 600 zł
});

test("Wyliczenie rekompensaty w PLN wg kursu NBP dla sprawy XVI GC 1420/26", () => {
  const nbpRate = {
    currencyCode: "EUR",
    tableNumber: "168/A/NBP/2026",
    effectiveDate: "2026-08-31",
    midRate: 4.3068,
  };

  // Dla roszczenia 20 000 zł (próg 70 EUR)
  const comp70 = calculateCommercialRecoveryCompensation(2_000_000, nbpRate);
  assert.equal(comp70.statutoryEuroTier, 70);
  // 70 * 431 gr = 30170 gr lub 70 * 4.3068 * 100
  assert.ok(comp70.calculatedPlnGrosze > 30000 && comp70.calculatedPlnGrosze < 30500);
  assert.ok(comp70.legalBasis.includes("art. 10 ust. 1 pkt 2"));

  // Dla roszczenia 147 600 zł (próg 100 EUR)
  const comp100 = calculateCommercialRecoveryCompensation(14_760_000, nbpRate);
  assert.equal(comp100.statutoryEuroTier, 100);
  assert.ok(comp100.legalBasis.includes("art. 10 ust. 1 pkt 3"));
});

test("Przeliczenie roszczenia walutowego na PLN (art. 358 K.c.)", () => {
  const nbpRate = {
    currencyCode: "EUR",
    tableNumber: "168/A/NBP/2026",
    effectiveDate: "2026-08-31",
    midRate: 4.3068,
  };

  // 1 000 EUR (100 000 centów)
  const converted = convertForeignCurrencyToPlnGrosze(100_000, nbpRate);
  // 100 000 * 4.3068 = 430680 gr = 4 306,80 zł
  assert.equal(converted.plnGrosze, 430680);
  assert.ok(converted.legalBasis.includes("art. 358 § 2 K.c."));
});
