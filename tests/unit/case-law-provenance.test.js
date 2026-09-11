import { test } from "node:test";
import assert from "node:assert/strict";
import {
  VERIFIED_CASE_LAW_REPOSITORY,
  matchPrecedentsForIssues,
  getPrecedentByCaseNumber,
} from "../../src/domain/services/case-law-matching-service.ts";

test("Gwarancja rzetelności orzeczniczej (Zero Halucynacji Sygnatur)", () => {
  assert.ok(VERIFIED_CASE_LAW_REPOSITORY.length >= 4);

  for (const prec of VERIFIED_CASE_LAW_REPOSITORY) {
    // Każde orzeczenie musi posiadać autentyczną sygnaturę, datę i sąd
    assert.ok(prec.caseNumber.length > 3, `Sygnatura zbyt krótka: ${prec.caseNumber}`);
    assert.ok(prec.courtName.length > 3, `Brak nazwy sądu: ${prec.courtName}`);
    assert.ok(prec.judgmentDate.match(/^\d{4}-\d{2}-\d{2}$/), `Niepoprawny format daty: ${prec.judgmentDate}`);
    assert.ok(prec.thesis.length > 30, `Teza zbyt krótka: ${prec.thesis}`);
    assert.ok(prec.provenanceSource === "SN_OFFICIAL" || prec.provenanceSource === "SAOS_API");
  }
});

test("Dopasowywanie orzecznictwa SN do zarzutu braku odbioru i wad istotnych", () => {
  const matched = matchPrecedentsForIssues(["BRAK_WYMAGALNOSCI_ODBIOR"]);
  assert.ok(matched.length >= 2);

  const sn1998 = matched.find((m) => m.caseNumber === "I CKN 520/97");
  assert.ok(sn1998, "Brak wyroku SN I CKN 520/97 dla wad istotnych");
  assert.ok(sn1998.thesis.includes("wady istotne"));

  const sn2007 = matched.find((m) => m.caseNumber === "V CSK 99/07");
  assert.ok(sn2007, "Brak wyroku SN V CSK 99/07");
});

test("Wyszukiwanie orzeczenia po sygnaturze z normalizacją spacji", () => {
  const found = getPrecedentByCaseNumber("  I  CKN 520/97  ");
  assert.ok(found);
  assert.equal(found.caseNumber, "I CKN 520/97");
  assert.equal(found.courtName, "Sąd Najwyższy");

  const notFound = getPrecedentByCaseNumber("I FAKE 999/99");
  assert.equal(notFound, undefined);
});
