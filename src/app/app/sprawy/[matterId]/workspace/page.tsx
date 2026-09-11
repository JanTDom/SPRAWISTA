import { notFound } from "next/navigation";
import { defaultMatterRepository } from "@/domain/repositories/in-memory-matter-repository";
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

  try {
    const aggregate = await defaultMatterRepository.getMatterAggregate(
      matterId,
      userId,
      orgId
    );

    return <WorkspaceShell aggregate={aggregate} isDemo={false} />;
  } catch (error) {
    notFound();
  }
}
