/**
 * Repozytorium Spraw i Danych z Wymuszoną Izolacją Wielodostępową (Multitenancy)
 */

import { Matter, Organization, User } from "../models/matter";
import { CaseDocument, TimelineEvent, CaseIssue } from "../models/evidence";
import { ProceduralDraft, PreSignAuditFinding, AdversarialCounterArgument } from "../models/pleading";

import {
  SignatureAuthorityCheck,
  CaseLawPrecedent,
  CommercialRecoveryCompensation,
  VatStatusCheck,
} from "../models/knowledge-sources";

export interface MatterFullAggregate {
  readonly matter: Matter;
  readonly documents: readonly CaseDocument[];
  readonly timeline: readonly TimelineEvent[];
  readonly issues: readonly CaseIssue[];
  readonly draft: ProceduralDraft;
  readonly draftHistory: readonly ProceduralDraft[];
  readonly auditFindings: readonly PreSignAuditFinding[];
  readonly counterArguments: readonly AdversarialCounterArgument[];
  readonly signatureChecks?: readonly SignatureAuthorityCheck[];
  readonly caseLawPrecedents?: readonly CaseLawPrecedent[];
  readonly recoveryCompensation?: CommercialRecoveryCompensation;
  readonly vatCheck?: VatStatusCheck;
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

export interface IMatterRepository {
  getOrganization(orgId: string): Promise<Organization | null>;
  getUser(userId: string): Promise<User | null>;
  listMattersForUser(userId: string, orgId: string): Promise<readonly Matter[]>;
  getMatterAggregate(matterId: string, userId: string, orgId: string): Promise<MatterFullAggregate>;
  saveDraft(
    matterId: string,
    updatedDraft: ProceduralDraft,
    userId: string,
    orgId: string
  ): Promise<ProceduralDraft>;
  createMatter(matter: Matter, userId: string): Promise<Matter>;
  deleteMatter(matterId: string, userId: string, orgId: string): Promise<void>;
}
