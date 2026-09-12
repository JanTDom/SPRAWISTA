/**
 * Zarządzanie sprawami i trwałym stanem dokumentów (Client & Server Persistence)
 * Umożliwia pracę na czystych, realnych dokumentach, bez fikcyjnych mocków.
 */

import { Matter, MatterProcedure } from "../../domain/models/matter";
import { CaseDocument } from "../../domain/models/evidence";
import { ProceduralDraft, PleadingSection } from "../../domain/models/pleading";
import { MatterFullAggregate } from "../../domain/repositories/matter-repository";

export interface NewMatterParams {
  caseNumber: string;
  courtName: string;
  courtDepartment: string;
  title: string;
  procedure: MatterProcedure;
  claimAmountPLN: number;
  claimantName: string;
  defendantName: string;
  dateDelivered?: string;
}

/**
 * Tworzy całkowicie czysty, nowy agregat sprawy procesowej przygotowany do pracy
 * na realnych dokumentach kancelarii.
 */
export function createCleanMatterAggregate(params: NewMatterParams): MatterFullAggregate {
  const matterId = `matter-${Date.now()}`;
  const now = new Date().toISOString();

  const matter: Matter = {
    id: matterId,
    organizationId: "org-kancelaria-user",
    caseNumber: params.caseNumber.trim() || "Do uzupełnienia",
    courtName: params.courtName.trim() || "Sąd Rejonowy",
    courtDepartment: params.courtDepartment.trim() || "Wydział Cywilny",
    title: params.title.trim() || `Sprawa ${params.caseNumber}`,
    procedure: params.procedure,
    claimAmountGrosze: Math.round(params.claimAmountPLN * 100),
    currency: "PLN",
    dateDelivered: params.dateDelivered,
    status: "NOWA",
    clientPartyId: "party-client",
    adversaryPartyId: "party-adversary",
    assignedUserIds: ["user-current"],
    createdAt: now,
    updatedAt: now,
  };

  const initialSections: PleadingSection[] = [
    {
      id: `sec-${matterId}-1`,
      orderIndex: 1,
      title: "I. Stanowisko procesowe i zarzuty wstępne",
      contentMarkdown:
        "W imieniu pozwanego niniejszym wnoszę o oddalenie powództwa w całości jako bezzasadnego i nieudowodnionego co do zasady jak i co do wysokości.",
      citations: [],
    },
    {
      id: `sec-${matterId}-2`,
      orderIndex: 2,
      title: "II. Uzasadnienie faktyczne i dowodowe",
      contentMarkdown:
        "Wgraj dokumenty sprawy do panelu akt po prawej stronie. Zaznacz dowolny fragment umowy, protokołu lub pisma, aby natychmiast wyciągnąć z niego zarzut procesowy, fakt do osi czasu lub powołać dowód.",
      citations: [],
    },
  ];

  const initialDraft: ProceduralDraft = {
    id: `draft-${matterId}-v1`,
    matterId,
    versionNumber: 1,
    title: "Odpowiedź na pozew o zapłatę",
    courtHeader: {
      city: "Warszawa",
      date: new Date().toLocaleDateString("pl-PL"),
      courtName: matter.courtName,
      department: matter.courtDepartment,
      caseNumber: matter.caseNumber,
    },
    claimantRepresentation: params.claimantName.trim() || "Powód (do uzupełnienia)",
    defendantRepresentation: params.defendantName.trim() || "Pozwany (do uzupełnienia)",
    valueOfDispute: `${params.claimAmountPLN.toLocaleString("pl-PL", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} zł`,
    petitumPoints: [
      "Wnoszę o oddalenie powództwa w całości;",
      "Wnoszę o zasądzenie od powoda na rzecz pozwanego kosztów procesu, w tym kosztów zastępstwa procesowego według norm przepisanych;",
      "Wnoszę o dopuszczenie i przeprowadzenie dowodów z dokumentów załączonych do niniejszej odpowiedzi na pozew na fakty wskazane w uzasadnieniu.",
    ],
    evidentiaryMotions: [],
    sections: initialSections,
    annexes: ["Odpis odpowiedzi na pozew wraz z załącznikami dla strony powodowej"],
    status: "SZKIC",
    createdAt: now,
    updatedAt: now,
  };

  return {
    matter,
    documents: [],
    timeline: [],
    issues: [],
    draft: initialDraft,
    draftHistory: [initialDraft],
    auditFindings: [],
    counterArguments: [],
    signatureChecks: [],
    caseLawPrecedents: [],
  };
}

const STORAGE_KEY = "sprawista_user_matters_v2";

/**
 * Zapisuje listę spraw użytkownika w przeglądarce (localStorage)
 */
export function saveUserMattersToStorage(matters: MatterFullAggregate[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matters));
  } catch (err) {
    console.error("Błąd zapisu spraw do localStorage:", err);
  }
}

/**
 * Odczytuje listę spraw użytkownika z przeglądarki
 */
export function getUserMattersFromStorage(): MatterFullAggregate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error("Błąd odczytu spraw z localStorage:", err);
    return [];
  }
}
