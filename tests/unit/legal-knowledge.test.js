/**
 * Testy jednostkowe warstwy wiedzy prawnej — czyste JS (bez TypeScript składni).
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import { STATUTE_CATALOG, findInCatalog, getByLegalArea } from "../../src/domain/data/statutes/statute-catalog.ts";
import { EU_LAW_CATALOG, CJEU_JUDGMENT_CATALOG } from "../../src/domain/data/statutes/eu-law-catalog.ts";
import { cacheGet, cacheSet, cacheInvalidate } from "../../src/infrastructure/cache/legal-knowledge-cache.ts";
import { buildIsapPageUrl, buildIsapPdfUrl } from "../../src/infrastructure/external/isap-client.ts";

// ── Katalog aktów polskich ────────────────────────────────────────────────

test("Katalog zawiera co najmniej 20 aktów prawnych", () => {
  assert.ok(STATUTE_CATALOG.length >= 20, `Znaleziono tylko ${STATUTE_CATALOG.length} aktów`);
});

test("Każdy wpis katalogu ma ELI w formacie DU/RRRR/NR", () => {
  for (const entry of STATUTE_CATALOG) {
    const parts = entry.eli.split("/");
    assert.equal(parts.length, 3, `Nieprawidłowy format ELI: ${entry.eli}`);
    assert.ok(["DU", "MP"].includes(parts[0]), `Nieprawidłowy publisher: ${parts[0]}`);
    assert.ok(entry.shortName.length > 0, `Brak shortName dla ${entry.eli}`);
    assert.ok(entry.legalAreas.length > 0, `Brak legalAreas dla ${entry.eli}`);
  }
});

test("findInCatalog('KC') zwraca Kodeks cywilny", () => {
  const kc = findInCatalog("KC");
  assert.ok(kc, "Nie znaleziono KC");
  assert.equal(kc.eli, "DU/1964/93");
});

test("findInCatalog('KP') zwraca Kodeks pracy", () => {
  const kp = findInCatalog("KP");
  assert.ok(kp, "Nie znaleziono KP");
  assert.equal(kp.eli, "DU/1974/141");
});

test("findInCatalog('UTH') zwraca ustawę o transakcjach handlowych", () => {
  const uth = findInCatalog("UTH");
  assert.ok(uth, "Nie znaleziono UTH");
  assert.ok(uth.eli.includes("2013"), "UTH powinien być z 2013");
});

test("findInCatalog('KSH') zwraca Kodeks spółek handlowych", () => {
  const ksh = findInCatalog("KSH");
  assert.ok(ksh, "Nie znaleziono KSH");
  assert.ok(ksh.eli.includes("2000"), "KSH powinien być z 2000");
});

test("getByLegalArea('PRAWO_PRACY') zawiera Kodeks pracy", () => {
  const acts = getByLegalArea("PRAWO_PRACY");
  assert.ok(acts.length >= 2, "Powinny być co najmniej 2 akty z prawa pracy");
  assert.ok(acts.some((a) => a.shortName === "KP"), "Brak KP w prawie pracy");
});

test("getByLegalArea('PRAWO_PODATKOWE') zawiera VAT, CIT i Ordynację", () => {
  const acts = getByLegalArea("PRAWO_PODATKOWE");
  const shortNames = acts.map((a) => a.shortName);
  assert.ok(shortNames.includes("VATU"), `Brak VATU, znaleziono: ${shortNames.join(", ")}`);
  assert.ok(shortNames.includes("CIT"), "Brak CIT");
  assert.ok(shortNames.includes("OrdPod"), "Brak Ordynacji podatkowej");
});

test("getByLegalArea('PRAWO_UPADLOSCIOWE') zawiera PU i PR", () => {
  const acts = getByLegalArea("PRAWO_UPADLOSCIOWE");
  const shortNames = acts.map((a) => a.shortName);
  assert.ok(shortNames.includes("PU"), "Brak Prawa upadłościowego");
  assert.ok(shortNames.includes("PR"), "Brak Prawa restrukturyzacyjnego");
});

test("getByLegalArea('PRAWO_ZAMOWIEN') zawiera PZP", () => {
  const acts = getByLegalArea("PRAWO_ZAMOWIEN");
  assert.ok(acts.some((a) => a.shortName === "PZP"), "Brak PZP");
});

// ── Katalog prawa UE ──────────────────────────────────────────────────────

test("Katalog UE zawiera co najmniej 15 aktów", () => {
  assert.ok(EU_LAW_CATALOG.length >= 15, `Tylko ${EU_LAW_CATALOG.length} aktów UE`);
});

test("Dyrektywa 2011/7/UE jest w katalogu i obowiązuje", () => {
  const d = EU_LAW_CATALOG.find((a) => a.celexId === "32011L0007");
  assert.ok(d, "Brak dyrektywy 2011/7/UE");
  assert.equal(d.isInForce, true);
  assert.equal(d.implementingPolishEli, "DU/2013/403");
});

test("RODO (32016R0679) jest w katalogu z polskim aktem implementującym", () => {
  const rodo = EU_LAW_CATALOG.find((a) => a.celexId === "32016R0679");
  assert.ok(rodo, "Brak RODO");
  assert.equal(rodo.implementingPolishEli, "DU/2018/1000");
});

test("Bruksela I bis (32012R1215) jest w katalogu jako Rozporządzenie", () => {
  const brussels = EU_LAW_CATALOG.find((a) => a.celexId === "32012R1215");
  assert.ok(brussels, "Brak Brukseli I bis");
  assert.equal(brussels.type, "Rozporządzenie");
});

test("Rzym I (32008R0593) i Rzym II (32007R0864) są w katalogu", () => {
  assert.ok(EU_LAW_CATALOG.some((a) => a.celexId === "32008R0593"), "Brak Rzym I");
  assert.ok(EU_LAW_CATALOG.some((a) => a.celexId === "32007R0864"), "Brak Rzym II");
});

test("Dyrektywa o czasie pracy (32003L0088) jest w katalogu", () => {
  assert.ok(EU_LAW_CATALOG.some((a) => a.celexId === "32003L0088"), "Brak dyrektywy o czasie pracy");
});

// ── Wyroki TSUE ───────────────────────────────────────────────────────────

test("Baza TSUE zawiera co najmniej 10 wyroków", () => {
  assert.ok(CJEU_JUDGMENT_CATALOG.length >= 10, `Tylko ${CJEU_JUDGMENT_CATALOG.length} wyroków TSUE`);
});

test("Każdy wyrok TSUE ma poprawne pola i tezę >= 100 znaków", () => {
  for (const j of CJEU_JUDGMENT_CATALOG) {
    assert.ok(j.celexId.length > 5, `Zbyt krótki celexId: ${j.celexId}`);
    assert.ok(j.caseNumber.startsWith("C-"), `Nieprawidłowy numer sprawy: ${j.caseNumber}`);
    assert.ok(j.thesis.length >= 100, `Zbyt krótka teza dla ${j.caseNumber} (${j.thesis.length} znaków)`);
    assert.ok(j.curiaUrl.includes("curia.europa.eu"), `Nieprawidłowy URL CURIA dla ${j.caseNumber}`);
  }
});

test("Wyrok C-555/14 jest powiązany z dyrektywą o opóźnieniach", () => {
  const j = CJEU_JUDGMENT_CATALOG.find((x) => x.caseNumber === "C-555/14");
  assert.ok(j, "Brak wyroku C-555/14");
  assert.ok(j.relatedDirectives.includes("32011L0007"), "Powinien być powiązany z 32011L0007");
});

test("Wyrok C-306/06 (definicja transakcji handlowej) jest w bazie", () => {
  assert.ok(CJEU_JUDGMENT_CATALOG.some((x) => x.caseNumber === "C-306/06"), "Brak wyroku C-306/06");
});

// ── Cache ─────────────────────────────────────────────────────────────────

test("Cache: set/get zwraca przechowane dane przed upłynięciem TTL", () => {
  const key = `test_cache_${Date.now()}`;
  const payload = { value: 42, label: "test-legal" };
  cacheSet(key, payload, 1);
  const result = cacheGet(key);
  assert.ok(result, "Cache miss — dane powinny być dostępne");
  assert.equal(result.value, 42);
  assert.equal(result.label, "test-legal");
  cacheInvalidate(key);
});

test("Cache: get po invalidacji zwraca null", () => {
  const key = `test_invalidate_${Date.now()}`;
  cacheSet(key, { x: 1 }, 1);
  cacheInvalidate(key);
  assert.equal(cacheGet(key), null);
});

test("Cache: get dla nieistniejącego klucza zwraca null (bez wyjątku)", () => {
  assert.equal(cacheGet("klucz_xyz_nieistnieje_999"), null);
});

// ── URL Builders ──────────────────────────────────────────────────────────

test("buildIsapPageUrl('DU/1964/93') zawiera isap.sejm.gov.pl", () => {
  const url = buildIsapPageUrl("DU/1964/93");
  assert.ok(url.includes("isap.sejm.gov.pl"), `URL: ${url}`);
});

test("buildIsapPdfUrl('DU/2013/403') zawiera isap.sejm.gov.pl", () => {
  const url = buildIsapPdfUrl("DU/2013/403");
  assert.ok(url.includes("isap.sejm.gov.pl"), `URL: ${url}`);
});
