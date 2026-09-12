import { AppHeader } from "@/presentation/components/navigation/app-header";
import { MattersDashboard } from "@/presentation/components/matters/matters-dashboard";

export const metadata = {
  title: "Pulpit Kancelarii — Sprawista",
  description: "Zarządzanie sprawami procesowymi i odpowiedziami na pozew na realnych dokumentach.",
};

export default function MattersListPage() {
  return (
    <div className="min-h-screen bg-[#F6F5F1] flex flex-col">
      <AppHeader />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <MattersDashboard />
      </main>
    </div>
  );
}
