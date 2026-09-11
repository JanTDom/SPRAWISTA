/**
 * Sprawista Domain Models: Sprawa, Strony, Organizacja i Dostęp
 */

export type OrganizationRole = "OWNER" | "PARTNER" | "ASSOCIATE" | "PARALEGAL" | "BILLING_ADMIN";

export interface Organization {
  readonly id: string;
  readonly name: string;
  readonly nip?: string;
  readonly planId: "PILOT" | "KANCELARIA_PRO";
  readonly status: "ACTIVE" | "TRIAL" | "PAST_DUE";
  readonly createdAt: string;
}

export interface User {
  readonly id: string;
  readonly email: string;
  readonly fullName: string;
  readonly professionalTitle: "ADWOKAT" | "RADCA_PRAWNY" | "APLIKANT" | "PRAWNIK";
  readonly barNumber?: string; // nr wpisu na listę ORA / OIRP
  readonly organizationId: string;
  readonly role: OrganizationRole;
}

export type PartyType = "POWOD" | "POZWANY" | "INTERWENIENT";

export interface Party {
  readonly id: string;
  readonly name: string;
  readonly type: PartyType;
  readonly address: string;
  readonly identifierType: "NIP" | "PESEL" | "KRS";
  readonly identifierValue: string;
  readonly representative?: string; // np. r.pr. Jan Kowalski
}

export type MatterProcedure = "GOSPODARCZE" | "CYWILNE_ZWYKLE";

export interface Matter {
  readonly id: string;
  readonly organizationId: string;
  readonly caseNumber: string; // Sygnatura, np. "XVI GC 1420/26"
  readonly courtName: string; // np. "Sąd Rejonowy dla m.st. Warszawy w Warszawie"
  readonly courtDepartment: string; // np. "XVI Wydział Gospodarczy"
  readonly title: string; // Krótka nazwa robocza sprawy
  readonly procedure: MatterProcedure;
  readonly claimAmountGrosze: number; // WPS w groszach (np. 14760000 = 147 600,00 zł)
  readonly currency: "PLN";
  readonly dateDelivered?: string; // Data doręczenia pozwu (ISO YYYY-MM-DD)
  readonly deadlineAnswer?: string; // Obliczony termin 14 dni
  readonly status: "NOWA" | "PRZETWARZANIE_AKT" | "MAPA_SPORU" | "SZKIC_PISMA" | "KONTROLA_ZRODEL" | "ZATWIERDZONA";
  readonly clientPartyId: string;
  readonly adversaryPartyId: string;
  readonly assignedUserIds: readonly string[]; // Ścisła lista osób uprawnionych do sprawy (chiński mur)
  readonly createdAt: string;
  readonly updatedAt: string;
}
