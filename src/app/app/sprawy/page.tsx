import Link from "next/link";
import { AppHeader } from "@/presentation/components/navigation/app-header";
import { defaultMatterRepository } from "@/domain/repositories/in-memory-matter-repository";
import { formatGroszeToPLN } from "@/domain/calculators/interest";

export const metadata = {
  title: "Sprawy Kancelarii — Sprawista",
  description: "Zarządzaj sprawami procesowymi i weryfikacją odpowiedzi na pozew.",
};

export default async function MattersListPage() {
  const userId = "user-radca-adam";
  const orgId = "org-kancelaria-demo";

  const matters = await defaultMatterRepository.listMattersForUser(userId, orgId);

  return (
    <div className="min-h-screen bg-[#F6F5F1] flex flex-col">
      <AppHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#172338]">
              Sprawy w toku
            </h1>
            <p className="text-sm text-[#5F6774] mt-1 font-sans">
              Zarządzanie odpowiedziami na pozew i materiałem dowodowym kancelarii.
            </p>
          </div>

          <Link
            href="/demo"
            className="inline-flex items-center gap-2 bg-[#172338] hover:bg-[#355CFF] text-[#FFFFFF] text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm self-start sm:self-auto"
          >
            <span>+ Nowa sprawa</span>
            <span className="text-[10px] font-mono bg-[#FFFFFF]/20 px-1 rounded">Demo</span>
          </Link>
        </div>

        {/* Zadania Wymagające Twojej Uwagi */}
        <div className="bg-[#FFFFFF] border border-[#E1E3E7] rounded-xl p-5 mb-8 shadow-paper">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B06000]"></span>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#172338]">
              Wymaga Twojej Decyzji (1 sprawa)
            </h2>
          </div>
          <div className="bg-[#FEF7E0] border border-[#F5E0A0] p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono font-bold text-[#B06000]">
                Termin 14 dni upływa za 4 dni (15.09.2026 r.)
              </p>
              <p className="text-sm font-serif font-semibold text-[#172338] mt-0.5">
                XVI GC 1420/26 • ABC Budownictwo vs XYZ Developer
              </p>
              <p className="text-xs text-[#5F6774] mt-1">
                Zidentyfikowano rozbieżność rachunkową z fakturą korygującą oraz ryzyko riposty powoda.
              </p>
            </div>
            <Link
              href="/app/sprawy/matter-abc-vs-xyz/workspace"
              className="bg-[#172338] hover:bg-[#355CFF] text-[#FFFFFF] text-xs font-semibold px-4 py-2 rounded shrink-0 transition-colors text-center"
            >
              Otwórz warsztat sprawy →
            </Link>
          </div>
        </div>

        {/* Lista Spraw */}
        <div className="bg-[#FFFFFF] border border-[#E1E3E7] rounded-xl shadow-paper overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E1E3E7] flex items-center justify-between bg-[#FAF9F6]">
            <span className="text-xs font-mono text-[#5F6774] font-bold uppercase">
              Lista aktywnych spraw ({matters.length})
            </span>
            <span className="text-xs font-mono text-[#5F6774]">
              Izolacja tenanta: Kancelaria Nowicki i Wspólnicy sp.p.
            </span>
          </div>

          <div className="divide-y divide-[#E1E3E7]">
            {matters.map((matter) => (
              <div
                key={matter.id}
                className="p-6 hover:bg-[#FAF9F6]/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-sm text-[#172338]">
                      {matter.caseNumber}
                    </span>
                    <span className="text-[11px] font-sans px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#E1E3E7] text-[#5F6774]">
                      {matter.courtDepartment}
                    </span>
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-[#EEF2FF] text-[#355CFF]">
                      Status: {matter.status}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-[#172338]">
                    {matter.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#5F6774] font-mono">
                    <span>W.P.S.: <strong className="text-[#172338]">{formatGroszeToPLN(matter.claimAmountGrosze)}</strong></span>
                    <span>•</span>
                    <span>Sąd: {matter.courtName}</span>
                    <span>•</span>
                    <span>Termin odpowiedzi: <strong className="text-[#B06000]">{matter.deadlineAnswer}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/app/sprawy/${matter.id}/workspace`}
                    className="bg-[#172338] hover:bg-[#355CFF] text-[#FFFFFF] text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#355CFF]"
                  >
                    Przejdź do akt i pisma →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
