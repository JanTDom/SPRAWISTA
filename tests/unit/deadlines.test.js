const test = require("node:test");
const assert = require("node:assert/strict");

// Dynamic import of TypeScript / ES module via node or compiled JS
// We can test the logic directly using Node.js test runner
const {
  calculateAnswerDeadline,
  isNonBusinessDay,
  getPolishHolidaysForYear,
} = require("../../src/domain/calculators/deadlines.ts");

test("Dni wolne i święta państwowe w Polsce", () => {
  const holidays2026 = getPolishHolidaysForYear(2026);
  assert.ok(holidays2026.has("2026-01-01"), "Nowy Rok powinien być świętem");
  assert.ok(holidays2026.has("2026-05-01"), "1 Maja powinien być świętem");
  assert.ok(holidays2026.has("2026-05-03"), "3 Maja powinien być świętem");
  assert.ok(holidays2026.has("2026-11-11"), "11 Listopada powinien być świętem");

  // Sobota i niedziela
  assert.equal(isNonBusinessDay("2026-09-05"), true, "Sobota 5 września 2026 powinna być dniem wolnym");
  assert.equal(isNonBusinessDay("2026-09-06"), true, "Niedziela 6 września 2026 powinna być dniem wolnym");
  assert.equal(isNonBusinessDay("2026-09-07"), false, "Poniedziałek 7 września 2026 powinien być dniem roboczym");
});

test("Obliczanie terminu 14 dni na odpowiedź na pozew bez przesunięcia", () => {
  // Doręczenie we wtorek 1 września 2026 r.
  // 14 dni mija we wtorek 15 września 2026 r. (dzień roboczy)
  const result = calculateAnswerDeadline("2026-09-01");
  assert.equal(result.raw14DaysDate, "2026-09-15");
  assert.equal(result.finalDeadlineDate, "2026-09-15");
  assert.equal(result.adjustedForWeekendOrHoliday, false);
});

test("Obliczanie terminu 14 dni z przesunięciem z soboty na poniedziałek (art. 115 K.c.)", () => {
  // Doręczenie w sobotę 22 sierpnia 2026 r.
  // 14 dni mija w sobotę 5 września 2026 r.
  // Zgodnie z art. 115 K.c. termin upływa w poniedziałek 7 września 2026 r.
  const result = calculateAnswerDeadline("2026-08-22");
  assert.equal(result.raw14DaysDate, "2026-09-05");
  assert.equal(result.finalDeadlineDate, "2026-09-07");
  assert.equal(result.adjustedForWeekendOrHoliday, true);
});
