import { test } from "node:test";
import assert from "node:assert/strict";
import {
  verifyDocumentSignatures,
  checkInsolvencyStatus,
} from "../../src/domain/services/entity-verification-service.ts";

const SAMPLE_KRS_ENTITY = {
  registryType: "KRS",
  registrationNumber: "0000889901",
  nip: "5252899012",
  regon: "142987654",
  legalForm: "Spółka z o.o.",
  companyName: "Budomex Sp. z o.o.",
  seatCity: "Warszawa",
  address: "ul. Przemysłowa 1",
  representationRule: "Współdziałanie dwóch członków zarządu albo jednego członka łącznie z prokurentem.",
  isActive: true,
  isInBankruptcy: false,
  isInRestructuring: false,
  representatives: [
    {
      fullName: "Jan Kowalski",
      peselOrIdMasked: "800101*****",
      role: "PREZES_ZARZADU",
      appointedDate: "2020-01-01",
    },
    {
      fullName: "Piotr Nowak",
      peselOrIdMasked: "820202*****",
      role: "WICEPREZES_ZARZADU",
      appointedDate: "2021-01-01",
    },
  ],
  verifiedAt: "2026-09-01T00:00:00Z",
};

test("Weryfikacja KRS: Prawidłowa reprezentacja łączna dwóch członków zarządu", () => {
  const doc = {
    documentId: "doc-1",
    documentTitle: "Umowa główna",
    signatureDate: "2025-05-10",
    signatoryNames: ["Jan Kowalski", "Piotr Nowak"],
    actingForParty: "POWOD",
  };

  const results = verifyDocumentSignatures(doc, SAMPLE_KRS_ENTITY);
  assert.equal(results.length, 2);
  assert.equal(results[0].findingSeverity, "ZGODNE");
  assert.equal(results[1].findingSeverity, "ZGODNE");
  assert.equal(results[0].isValidInRegistry, true);
  assert.equal(results[0].violatesJointRepresentation, false);
});

test("Weryfikacja KRS: Wykrycie rzekomego pełnomocnika (falsus procurator, art. 103 K.c.)", () => {
  const doc = {
    documentId: "doc-2",
    documentTitle: "Aneks rozszerzający",
    signatureDate: "2025-08-10",
    signatoryNames: ["Marek Nieznany"], // Brak w KRS
    actingForParty: "POWOD",
  };

  const results = verifyDocumentSignatures(doc, SAMPLE_KRS_ENTITY);
  assert.equal(results.length, 1);
  assert.equal(results[0].findingSeverity, "WADA_BEZWZGLEDNA");
  assert.equal(results[0].isValidInRegistry, false);
  assert.ok(results[0].legalBasis.includes("art. 103"));
  assert.ok(results[0].findingDescription.includes("nie figuruje w rejestrze KRS"));
});

test("Weryfikacja KRS: Wykrycie naruszenia reprezentacji łącznej (podpis jednoosobowy)", () => {
  const doc = {
    documentId: "doc-3",
    documentTitle: "Porozumienie stron",
    signatureDate: "2025-09-15",
    signatoryNames: ["Jan Kowalski"], // Tylko jeden z dwóch wymaganych
    actingForParty: "POWOD",
  };

  const results = verifyDocumentSignatures(doc, SAMPLE_KRS_ENTITY);
  assert.equal(results.length, 1);
  assert.equal(results[0].findingSeverity, "WADA_BEZWZGLEDNA");
  assert.equal(results[0].violatesJointRepresentation, true);
  assert.ok(results[0].legalBasis.includes("art. 205 § 1 K.s.h."));
});

test("Kontrola stanu upadłości podmiotu pod kątem art. 174 K.p.c.", () => {
  const entityInBankrupcy = {
    ...SAMPLE_KRS_ENTITY,
    isInBankruptcy: true,
  };

  const check = checkInsolvencyStatus(entityInBankrupcy);
  assert.equal(check.requiresSuspension, true);
  assert.equal(check.severity, "KRYTYCZNA");
  assert.ok(check.legalBasis.includes("art. 174 § 1 pkt 4 K.p.c."));
});
