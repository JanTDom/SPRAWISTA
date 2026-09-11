/**
 * @file knowledge-sources.ts
 * @description Modele danych dla zewnętrznych i wewnętrznych źródeł wiedzy prawnej:
 * rejestry publiczne (KRS, CEIDG), NBP, orzecznictwo (SAOS, SN), akty prawne (ISAP/ELI)
 * oraz prywatna pamięć argumentacyjna kancelarii.
 */

/**
 * Rola osoby w strukturze podmiotu gospodarczego
 */
export type CorporateRole =
  | "CZLONEK_ZARZADU"
  | "PREZES_ZARZADU"
  | "WICEPREZES_ZARZADU"
  | "PROKURENT_SAMODZIELNY"
  | "PROKURENT_LACZNY"
  | "PELNOMOCNIK_HANDLOWY"
  | "BRAK_WPISU_W_REJESTRZE";

/**
 * Osoba uprawniona do reprezentacji ujawniona w KRS/CEIDG
 */
export interface RegisteredRepresentative {
  fullName: string;
  peselOrIdMasked: string;
  role: CorporateRole;
  appointedDate: string; // YYYY-MM-DD
  revokedDate?: string;  // YYYY-MM-DD jeśli odwołany
}

/**
 * Wpis w rejestrze przedsiębiorców (KRS lub CEIDG)
 */
export interface RegistryEntityRecord {
  registryType: "KRS" | "CEIDG";
  registrationNumber: string; // KRS (10 cyfr) lub NIP w CEIDG
  nip: string;
  regon: string;
  legalForm: string; // np. "Spółka z o.o.", "Spółka Akcyjna", "Jednoosobowa działalność gospodarcza"
  companyName: string;
  seatCity: string;
  address: string;
  representationRule: string; // np. "Do składania oświadczeń w imieniu spółki wymagane jest współdziałanie dwóch członków zarządu albo jednego członka zarządu łącznie z prokurentem."
  isActive: boolean;
  isInBankruptcy: boolean;
  isInRestructuring: boolean;
  representatives: RegisteredRepresentative[];
  verifiedAt: string; // Data weryfikacji odpisu
}

/**
 * Wynik weryfikacji umocowania podpisu na dokumencie
 */
export interface SignatureAuthorityCheck {
  documentId: string;
  documentTitle: string;
  signatureDate: string;
  signatoryName: string;
  purportedRole: string;
  isValidInRegistry: boolean;
  violatesJointRepresentation: boolean;
  findingSeverity: "ZGODNE" | "OSTRZEZENIE" | "WADA_BEZWZGLEDNA";
  findingDescription: string;
  legalBasis: string; // np. "art. 103 § 1 K.c. w zw. z art. 205 § 1 K.s.h."
  proceduralRecommendation: string;
}

/**
 * Tabela kursów średnich NBP (Tabela A)
 */
export interface NbpExchangeRate {
  currencyCode: "EUR" | "USD" | "GBP" | "CHF";
  tableNumber: string; // np. "042/A/NBP/2026"
  effectiveDate: string; // YYYY-MM-DD
  midRate: number; // np. 4.3068
}

/**
 * Wyliczenie rekompensaty za koszty odzyskiwania należności (art. 10 ustawy o transakcjach handlowych)
 */
export interface CommercialRecoveryCompensation {
  invoiceValueGrosze: number;
  statutoryEuroTier: 40 | 70 | 100;
  nbpRateUsed: NbpExchangeRate;
  calculatedPlnGrosze: number;
  formattedPln: string;
  legalBasis: string;
}

/**
 * Weryfikacja na Białej Liście Podatników VAT (KAS)
 */
export interface VatStatusCheck {
  nip: string;
  companyName: string;
  isVatActive: boolean;
  bankAccountChecked: string;
  isAccountOnWhitelist: boolean;
  checkDate: string;
  requestId: string;
  riskNote?: string;
}

/**
 * Autentyczne orzeczenie Sądu Najwyższego lub Sądu Apelacyjnego
 */
export interface CaseLawPrecedent {
  id: string;
  courtName: "Sąd Najwyższy" | "Sąd Apelacyjny w Warszawie" | "Sąd Apelacyjny w Katowicach" | "Sąd Apelacyjny w Poznaniu";
  division: string; // np. "Izba Cywilna"
  caseNumber: string; // np. "I CKN 520/97", "III CZP 111/13"
  judgmentDate: string; // YYYY-MM-DD
  judgmentType: "Wyrok" | "Uchwała" | "Postanowienie";
  thesis: string;
  associatedIssues: string[]; // Identyfikatory zarzutów, do których pasuje
  provenanceSource: "SN_OFFICIAL" | "SAOS_API" | "FIRM_ARCHIVE";
  directLink?: string;
}

/**
 * Autentyczna wersja artykułu ustawy (ISAP / ELI API)
 */
export interface StatuteArticleVersion {
  actEliIdentifier: string; // np. "DU/1964/16/93" (Kodeks cywilny)
  actTitle: string;
  articleNumber: string;
  paragraph?: string;
  inForceSince: string;
  inForceUntil?: string;
  exactText: string;
  intertemporalComment?: string;
}

/**
 * Szablon argumentacyjny z prywatnej bazy wiedzy kancelarii (Tenant Knowledge Base)
 */
export interface FirmKnowledgeTemplate {
  id: string;
  organizationId: string;
  title: string;
  category: "BUDOWLANE" | "DOSTAWA" | "USLUGI_B2B" | "KARY_UMOWNE";
  defenseIssueKey: string;
  preferredArguments: string[];
  winningPrecedents: string[];
  approvedByLawyer: string;
  updatedAt: string;
}
