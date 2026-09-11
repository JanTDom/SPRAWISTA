/**
 * Repozytorium Lokalne In-Memory z Wymuszoną Izolacją Kancelarii (Multitenancy)
 */

import {
  IMatterRepository,
  MatterFullAggregate,
  AuthorizationError,
} from "./matter-repository";
import { Matter, Organization, User } from "../models/matter";
import { ProceduralDraft } from "../models/pleading";
import {
  DEMO_ORGANIZATION,
  DEMO_USER,
  DEMO_AGGREGATE,
} from "../data/synthetic-case";

export class InMemoryMatterRepository implements IMatterRepository {
  private organizations: Map<string, Organization> = new Map([
    [DEMO_ORGANIZATION.id, DEMO_ORGANIZATION],
    // Fikcyjna inna organizacja do testów bezpieczeństwa cross-tenant
    [
      "org-obca-kancelaria",
      {
        id: "org-obca-kancelaria",
        name: "Inna Kancelaria Adwokacka sp.k.",
        planId: "PILOT",
        status: "ACTIVE",
        createdAt: "2026-02-01T10:00:00Z",
      },
    ],
  ]);

  private users: Map<string, User> = new Map([
    [DEMO_USER.id, DEMO_USER],
    // Fikcyjny użytkownik obcej kancelarii do testów odmowy dostępu
    [
      "user-obcy-adwokat",
      {
        id: "user-obcy-adwokat",
        email: "obcy@inna-kancelaria.pl",
        fullName: "adw. Tomasz Obcy",
        professionalTitle: "ADWOKAT",
        organizationId: "org-obca-kancelaria",
        role: "PARTNER",
      },
    ],
    // Fikcyjny asystent w tej samej kancelarii bez przypisania do sprawy (chiński mur)
    [
      "user-asystent-bez-dostepu",
      {
        id: "user-asystent-bez-dostepu",
        email: "asystent@nowicki-legal.pl",
        fullName: "Piotr Nowy",
        professionalTitle: "APLIKANT",
        organizationId: "org-kancelaria-demo",
        role: "ASSOCIATE",
      },
    ],
  ]);

  private matters: Map<string, MatterFullAggregate> = new Map([
    [DEMO_AGGREGATE.matter.id, DEMO_AGGREGATE],
  ]);

  async getOrganization(orgId: string): Promise<Organization | null> {
    return this.organizations.get(orgId) || null;
  }

  async getUser(userId: string): Promise<User | null> {
    return this.users.get(userId) || null;
  }

  async listMattersForUser(userId: string, orgId: string): Promise<readonly Matter[]> {
    const user = await this.getUser(userId);
    if (!user || user.organizationId !== orgId) {
      throw new AuthorizationError("Brak uprawnień do przeglądania spraw tej organizacji.");
    }

    const results: Matter[] = [];
    for (const agg of this.matters.values()) {
      // Filtracja 1: Sprawa należy do organizacji użytkownika
      if (agg.matter.organizationId === orgId) {
        // Filtracja 2: Użytkownik jest przypisany do sprawy (lub jest Partnerem/Właścicielem)
        if (
          user.role === "OWNER" ||
          user.role === "PARTNER" ||
          agg.matter.assignedUserIds.includes(userId)
        ) {
          results.push(agg.matter);
        }
      }
    }
    return results;
  }

  async getMatterAggregate(
    matterId: string,
    userId: string,
    orgId: string
  ): Promise<MatterFullAggregate> {
    const user = await this.getUser(userId);
    if (!user || user.organizationId !== orgId) {
      throw new AuthorizationError("Brak autoryzacji: Użytkownik nie należy do organizacji tenanta.");
    }

    const aggregate = this.matters.get(matterId);
    if (!aggregate) {
      throw new Error(`Nie znaleziono sprawy o identyfikatorze: ${matterId}`);
    }

    // Bezpieczeństwo Cross-tenant
    if (aggregate.matter.organizationId !== orgId) {
      throw new AuthorizationError("Odmowa dostępu: Sprawa należy do innej kancelarii.");
    }

    // Bezpieczeństwo Case-Level (chiński mur)
    const hasCaseAccess =
      user.role === "OWNER" ||
      user.role === "PARTNER" ||
      aggregate.matter.assignedUserIds.includes(userId);

    if (!hasCaseAccess) {
      throw new AuthorizationError("Odmowa dostępu: Brak przypisania do akt tej sprawy (ochrona tajemnicy zawodowej).");
    }

    return aggregate;
  }

  async saveDraft(
    matterId: string,
    updatedDraft: ProceduralDraft,
    userId: string,
    orgId: string
  ): Promise<ProceduralDraft> {
    const aggregate = await this.getMatterAggregate(matterId, userId, orgId);

    const newHistory = [...aggregate.draftHistory, updatedDraft];
    const updatedAggregate: MatterFullAggregate = {
      ...aggregate,
      draft: updatedDraft,
      draftHistory: newHistory,
      matter: {
        ...aggregate.matter,
        updatedAt: new Date().toISOString(),
      },
    };

    this.matters.set(matterId, updatedAggregate);
    return updatedDraft;
  }

  async createMatter(matter: Matter, userId: string): Promise<Matter> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new AuthorizationError("Użytkownik nie istnieje.");
    }

    const emptyAggregate: MatterFullAggregate = {
      matter,
      documents: [],
      timeline: [],
      issues: [],
      draft: {
        id: `draft-${matter.id}-v1`,
        matterId: matter.id,
        versionNumber: 1,
        title: "Odpowiedź na pozew o zapłatę",
        courtHeader: {
          city: "Warszawa",
          date: new Date().toLocaleDateString("pl-PL"),
          courtName: matter.courtName,
          department: matter.courtDepartment,
          caseNumber: matter.caseNumber,
        },
        claimantRepresentation: "",
        defendantRepresentation: "",
        valueOfDispute: `${(matter.claimAmountGrosze / 100).toFixed(2)} zł`,
        petitumPoints: ["Wnoszę o oddalenie powództwa w całości;"],
        evidentiaryMotions: [],
        sections: [],
        annexes: [],
        status: "SZKIC",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      draftHistory: [],
      auditFindings: [],
      counterArguments: [],
    };

    this.matters.set(matter.id, emptyAggregate);
    return matter;
  }

  async deleteMatter(matterId: string, userId: string, orgId: string): Promise<void> {
    await this.getMatterAggregate(matterId, userId, orgId);
    this.matters.delete(matterId);
  }
}

// Globalny singleton instancji lokalnej repozytorium
export const defaultMatterRepository = new InMemoryMatterRepository();
