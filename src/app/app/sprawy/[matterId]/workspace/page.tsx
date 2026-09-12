import { defaultMatterRepository } from "@/domain/repositories/in-memory-matter-repository";
import { createCleanMatterAggregate } from "@/infrastructure/persistence/matter-store";
import { WorkspaceShell } from "@/presentation/components/workspace/workspace-shell";

export const metadata = {
  title: "Warsztat Pisma Procesowego — Sprawista",
};

export default async function MatterWorkspacePage({
  params,
}: {
  params: Promise<{ matterId: string }>;
}) {
  const { matterId } = await params;
  const userId = "user-radca-adam";
  const orgId = "org-kancelaria-demo";

  let aggregate;
  try {
    aggregate = await defaultMatterRepository.getMatterAggregate(
      matterId,
      userId,
      orgId
    );
  } catch (error) {
    // Jeśli sprawa została utworzona dynamicznie przez użytkownika w przeglądarce
    const clean = createCleanMatterAggregate({
      caseNumber: matterId.startsWith("matter-") ? "I C 200/26" : matterId,
      courtName: "Sąd Rejonowy dla m.st. Warszawy",
      courtDepartment: "I Wydział Cywilny",
      title: "Sprawa procesowa o zapłatę",
      procedure: "CYWILNE_ZWYKLE",
      claimAmountPLN: 50000,
      claimantName: "Strona Powodowa",
      defendantName: "Strona Pozwana",
    });

    aggregate = {
      ...clean,
      matter: {
        ...clean.matter,
        id: matterId,
      },
    };
  }

  return <WorkspaceShell aggregate={aggregate} isDemo={false} />;
}
