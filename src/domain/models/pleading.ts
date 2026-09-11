/**
 * Sprawista Domain Models: Pismo Procesowe, Zarzuty, Analiza Przeciwna i Audyt Przed Podpisem
 */

import { CitationLink } from "./evidence";

export type ObjectionType =
  | "PRZEDAWNIENIE"
  | "POTRACENIE"
  | "NIENALEZYTE_WYKONANIE_UMOWY"
  | "BRAK_LEGITYMACJI"
  | "BRAK_WYMAGALNOSCI"
  | "PREKLUZJA_DOWODOWA";

export interface DefenseObjection {
  readonly id: string;
  readonly type: ObjectionType;
  readonly title: string;
  readonly legalBasis: string; // np. "art. 471 w zw. z art. 647 K.c."
  readonly summary: string;
  readonly evidenceCitations: readonly string[]; // chunk IDs
  readonly riskLevel: "NISKIE" | "SREDNIE" | "WYSOKIE";
}

export interface PleadingSection {
  readonly id: string;
  readonly orderIndex: number;
  readonly title: string;
  readonly contentMarkdown: string;
  readonly citations: readonly CitationLink[];
}

export interface ProceduralDraft {
  readonly id: string;
  readonly matterId: string;
  readonly versionNumber: number;
  readonly title: string; // np. "Odpowiedź na pozew o zapłatę"
  readonly courtHeader: {
    readonly city: string;
    readonly date: string;
    readonly courtName: string;
    readonly department: string;
    readonly caseNumber: string;
  };
  readonly claimantRepresentation: string;
  readonly defendantRepresentation: string;
  readonly valueOfDispute: string; // WPS słownie i cyfrowo
  readonly petitumPoints: readonly string[];
  readonly evidentiaryMotions: readonly string[];
  readonly sections: readonly PleadingSection[];
  readonly annexes: readonly string[];
  readonly lawyerSignedAt?: string;
  readonly lawyerSignerName?: string;
  readonly status:
    | "SZKIC"
    | "W_ANALIZIE"
    | "WYMAGA_UZUPELNIEN"
    | "SPRAWDZONY_AUTOMATYCZNIE"
    | "ZATWIERDZONY";
  readonly createdAt: string;
  readonly updatedAt: string;
}

export type AuditFindingSeverity =
  | "BLAD"                 // Krytyczna niespójność, błąd w kwocie lub brak adresu
  | "BRAK_DANYCH"          // Niewypełnione pole, brak daty
  | "RYZYKO"               // Słaby dowód, ryzyko riposty powoda
  | "SPORNE_ZAGADNIENIE"   // Rozbieżność interpretacyjna
  | "DECYZJA_STRATEGICZNA"; // Wybór podniesienia potrącenia vs zarzutu z rękojmi

export interface PreSignAuditFinding {
  readonly id: string;
  readonly severity: AuditFindingSeverity;
  readonly title: string;
  readonly location: string; // np. "Uzasadnienie, akapit 3"
  readonly description: string;
  readonly legalBasisOrSource?: string;
  readonly recommendedAction: string;
  readonly status: "OTWARTA" | "ZAAKCEPTOWANA" | "ODRZUCONA" | "ODROCZONA";
}

export interface AdversarialCounterArgument {
  readonly id: string;
  readonly objectionId: string;
  readonly objectionTitle: string;
  readonly simulatedClaimantRiposte: string;
  readonly claimantPossibleProofs: readonly string[];
  readonly defenseWeaknessScore: "NISKA" | "SREDNIA" | "KRYTYCZNA";
  readonly strategicRecommendation: string;
}
