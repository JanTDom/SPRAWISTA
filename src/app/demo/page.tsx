import { defaultMatterRepository } from "@/domain/repositories/in-memory-matter-repository";
import { WorkspaceShell } from "@/presentation/components/workspace/workspace-shell";

export const metadata = {
  title: "Interaktywne Demo — Sprawista",
  description: "Przetestuj pełny proces od akt do gotowego pisma procesowego na syntetycznej sprawie budowlanej.",
};

export default async function DemoPage() {
  // Pobranie syntetycznej sprawy demonstracyjnej
  const aggregate = await defaultMatterRepository.getMatterAggregate(
    "matter-abc-vs-xyz",
    "user-radca-adam",
    "org-kancelaria-demo"
  );

  return <WorkspaceShell aggregate={aggregate} isDemo={true} />;
}
