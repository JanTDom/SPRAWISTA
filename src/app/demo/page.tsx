import { createCleanMatterAggregate } from "@/infrastructure/persistence/matter-store";
import { WorkspaceShell } from "@/presentation/components/workspace/workspace-shell";

export const metadata = {
  title: "Warsztat Roboczy — Sprawista",
  description: "Czysty warsztat przygotowania odpowiedzi na pozew na realnych dokumentach sprawy.",
};

export default async function DemoPage() {
  // Przygotowanie czystego agregatu roboczego bez syntetycznych pism
  const cleanAggregate = createCleanMatterAggregate({
    caseNumber: "I C 101/26",
    courtName: "Sąd Rejonowy dla m.st. Warszawy",
    courtDepartment: "I Wydział Cywilny",
    title: "Nowa sprawa o zapłatę",
    procedure: "GOSPODARCZE",
    claimAmountPLN: 50000,
    claimantName: "Strona Powodowa",
    defendantName: "Strona Pozwana (Mocodawca)",
  });

  return <WorkspaceShell aggregate={cleanAggregate} isDemo={true} />;
}
