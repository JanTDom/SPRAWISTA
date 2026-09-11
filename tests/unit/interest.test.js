const test = require("node:test");
const assert = require("node:assert/strict");

const {
  calculateDelayInterest,
  formatGroszeToPLN,
} = require("../../src/domain/calculators/interest.ts");

test("Formatowanie groszy do PLN", () => {
  assert.equal(formatGroszeToPLN(14760000), "147 600,00 zł");
  assert.equal(formatGroszeToPLN(4920050), "49 200,50 zł");
  assert.equal(formatGroszeToPLN(0), "0,00 zł");
  assert.equal(formatGroszeToPLN(99), "0,99 zł");
});

test("Obliczanie odsetek w transakcjach handlowych (15.75% rocznie)", () => {
  // Kwota 100 000,00 zł (10 000 000 groszy)
  // Okres: 10 dni
  // Wzór: (100 000 * 0.1575 * 10) / 365 = 431,5068 zł -> 43 151 groszy
  const res = calculateDelayInterest(
    10000000,
    "2026-01-01",
    "2026-01-10",
    "COMMERCIAL_TRANSACTION"
  );

  assert.equal(res.principalGrosze, 10000000);
  assert.equal(res.daysCount, 10);
  assert.equal(res.ratePercentUsed, 15.75);
  assert.equal(res.interestGrosze, 43151);
  assert.equal(res.totalGrosze, 10043151);
  assert.ok(res.basis.includes("ustawy o przeciwdziałaniu nadmiernym opóźnieniom"));
});

test("Obliczanie odsetek ustawowych cywilnych (art. 481 § 2 K.c. - 11.25% rocznie)", () => {
  // Kwota 100 000,00 zł (10 000 000 groszy)
  // Okres: 10 dni
  // Wzór: (100 000 * 0.1125 * 10) / 365 = 308,219 zł -> 30 822 groszy
  const res = calculateDelayInterest(
    10000000,
    "2026-01-01",
    "2026-01-10",
    "CIVIL_CODE"
  );

  assert.equal(res.principalGrosze, 10000000);
  assert.equal(res.daysCount, 10);
  assert.equal(res.ratePercentUsed, 11.25);
  assert.equal(res.interestGrosze, 30822);
  assert.ok(res.basis.includes("art. 481 § 2 K.c."));
});
