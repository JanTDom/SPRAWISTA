/**
 * @file entity-verification-service.ts
 * @description Usługa weryfikacji umocowania, reprezentacji i statusu prawnego podmiotów
 * w oparciu o dane rejestrowe KRS i CEIDG.
 */

import {
  RegistryEntityRecord,
  SignatureAuthorityCheck,
} from "../models/knowledge-sources";

export interface DocumentSignatureToVerify {
  documentId: string;
  documentTitle: string;
  signatureDate: string; // YYYY-MM-DD
  signatoryNames: string[];
  actingForParty: "POWOD" | "POZWANY";
}

/**
 * Weryfikuje prawidłowość podpisania dokumentu przez reprezentantów ujawnionych w KRS/CEIDG.
 */
export function verifyDocumentSignatures(
  document: DocumentSignatureToVerify,
  entityRecord: RegistryEntityRecord
): SignatureAuthorityCheck[] {
  const results: SignatureAuthorityCheck[] = [];

  for (const signatoryName of document.signatoryNames) {
    // 1. Sprawdzenie czy osoba widnieje w rejestrze
    const matchingRep = entityRecord.representatives.find((rep) =>
      rep.fullName.toLowerCase().trim() === signatoryName.toLowerCase().trim()
    );

    if (!matchingRep) {
      // Osoba całkowicie nieujawniona w KRS/CEIDG
      results.push({
        documentId: document.documentId,
        documentTitle: document.documentTitle,
        signatureDate: document.signatureDate,
        signatoryName,
        purportedRole: "Niewskazana w rejestrze",
        isValidInRegistry: false,
        violatesJointRepresentation: false,
        findingSeverity: "WADA_BEZWZGLEDNA",
        findingDescription: `Osoba podpisująca (${signatoryName}) nie figuruje w rejestrze KRS/CEIDG podmiotu ${entityRecord.companyName} jako członek zarządu ani prokurent. Brak w aktach pełnomocnictwa materialnego.`,
        legalBasis: "art. 103 § 1 i § 2 K.c. w zw. z art. 205 § 1 K.s.h.",
        proceduralRecommendation: `Podnieść zarzut braku umocowania (falsus procurator) oraz bezskuteczności zawieszonej czynności prawnej, chyba że druga strona przedłoży dokument pełnomocnictwa z datą pewną.`,
      });
      continue;
    }

    // 2. Sprawdzenie czy umocowanie było aktywne w dacie złożenia podpisu
    const sigDate = new Date(document.signatureDate).getTime();
    const appDate = new Date(matchingRep.appointedDate).getTime();
    const isAfterRevocation =
      matchingRep.revokedDate &&
      new Date(matchingRep.revokedDate).getTime() < sigDate;

    if (sigDate < appDate || isAfterRevocation) {
      results.push({
        documentId: document.documentId,
        documentTitle: document.documentTitle,
        signatureDate: document.signatureDate,
        signatoryName,
        purportedRole: matchingRep.role,
        isValidInRegistry: false,
        violatesJointRepresentation: false,
        findingSeverity: "WADA_BEZWZGLEDNA",
        findingDescription: `W dacie czynności (${document.signatureDate}) osoba ${signatoryName} nie posiadała uprawnień (powołano: ${matchingRep.appointedDate}${
          matchingRep.revokedDate ? `, odwołano: ${matchingRep.revokedDate}` : ""
        }).`,
        legalBasis: "art. 104 K.c. w zw. z art. 17 ust. 1 ustawy o KRS (zasada jawności materialnej wpisów)",
        proceduralRecommendation: `Zgłosić zarzut nieważności oświadczenia woli z uwagi na wygaśnięcie mandatu / brak wpisu w rejestrze w chwili złożenia oświadczenia.`,
      });
      continue;
    }

    // 3. Sprawdzenie reprezentacji łącznej
    const isJointReq =
      entityRecord.representationRule.toLowerCase().includes("dwóch członków") ||
      entityRecord.representationRule.toLowerCase().includes("łącznie");

    const singleSigner = document.signatoryNames.length === 1;

    if (isJointReq && singleSigner && matchingRep.role !== "PROKURENT_SAMODZIELNY") {
      results.push({
        documentId: document.documentId,
        documentTitle: document.documentTitle,
        signatureDate: document.signatureDate,
        signatoryName,
        purportedRole: matchingRep.role,
        isValidInRegistry: true, // osoba jest w KRS, ale reprezentacja jest wadliwa
        violatesJointRepresentation: true,
        findingSeverity: "WADA_BEZWZGLEDNA",
        findingDescription: `Naruszenie zasad reprezentacji łącznej: Zgodnie z KRS spółki wymagane jest współdziałanie dwóch członków zarządu lub członka z prokurentem. Dokument podpisany wyłącznie jednoosobowo przez: ${signatoryName}.`,
        legalBasis: "art. 205 § 1 K.s.h. w zw. z art. 39 § 1 K.c.",
        proceduralRecommendation: `Podnieść zarzut bezskuteczności oświadczenia woli z powodu uchybienia ustawowym i statutowym regułom reprezentacji łącznej.`,
      });
      continue;
    }

    // 4. Reprezentacja prawidłowa
    results.push({
      documentId: document.documentId,
      documentTitle: document.documentTitle,
      signatureDate: document.signatureDate,
      signatoryName,
      purportedRole: matchingRep.role,
      isValidInRegistry: true,
      violatesJointRepresentation: false,
      findingSeverity: "ZGODNE",
      findingDescription: `Umocowanie w pełni potwierdzone w KRS (${matchingRep.role}) na dzień ${document.signatureDate}.`,
      legalBasis: "art. 17 ust. 1 ustawy o Krajowym Rejestrze Sądowym",
      proceduralRecommendation: "Brak podstaw do zarzutu wadliwości reprezentacji dla tego dokumentu.",
    });
  }

  return results;
}

/**
 * Kontroluje stan upadłościowy lub restrukturyzacyjny podmiotu pod kątem art. 174 K.p.c.
 */
export function checkInsolvencyStatus(entityRecord: RegistryEntityRecord): {
  requiresSuspension: boolean;
  severity: "BRAK" | "OSTRZEZENIE" | "KRYTYCZNA";
  notice: string;
  legalBasis: string;
} {
  if (entityRecord.isInBankruptcy) {
    return {
      requiresSuspension: true,
      severity: "KRYTYCZNA",
      notice: `Wobec podmiotu ${entityRecord.companyName} otwarto postępowanie upadłościowe. Postępowanie cywilne podlega obligatoryjnemu zawieszeniu z urzędu z chwilą ogłoszenia upadłości.`,
      legalBasis: "art. 174 § 1 pkt 4 K.p.c. w zw. z art. 144 ust. 1 Prawa upadłościowego",
    };
  }

  if (entityRecord.isInRestructuring) {
    return {
      requiresSuspension: true,
      severity: "OSTRZEZENIE",
      notice: `Wobec podmiotu ${entityRecord.companyName} toczy się postępowanie restrukturyzacyjne (sanacyjne). Wierzytelności objęte układem nie mogą być dochodzone w trybie indywidualnym po otwarciu postępowania.`,
      legalBasis: "art. 257 w zw. z art. 310 ustawy — Prawo restrukturyzacyjne",
    };
  }

  return {
    requiresSuspension: false,
    severity: "BRAK",
    notice: "Podmiot aktywny gospodarczo. Brak wpisów o upadłości i restrukturyzacji.",
    legalBasis: "Stan rejestru KRS zgodny z art. 14 ustawy o KRS",
  };
}
