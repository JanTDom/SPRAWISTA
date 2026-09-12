"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Matter, MatterProcedure } from "@/domain/models/matter";
import { formatGroszeToPLN } from "@/domain/calculators/interest";
import {
  createCleanMatterAggregate,
  getUserMattersFromStorage,
  saveUserMattersToStorage,
} from "@/infrastructure/persistence/matter-store";
import { MatterFullAggregate } from "@/domain/repositories/matter-repository";

export function MattersDashboard() {
  const router = useRouter();
  const [matters, setMatters] = useState<MatterFullAggregate[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Formularz nowej sprawy
  const [caseNumber, setCaseNumber] = useState("");
  const [title, setTitle] = useState("");
  const [courtName, setCourtName] = useState("Sąd Rejonowy dla m.st. Warszawy");
  const [courtDepartment, setCourtDepartment] = useState("I Wydział Cywilny");
  const [procedure, setProcedure] = useState<MatterProcedure>("CYWILNE_ZWYKLE");
  const [claimAmountPLN, setClaimAmountPLN] = useState<number>(25000);
  const [claimantName, setClaimantName] = useState("");
  const [defendantName, setDefendantName] = useState("");

  // Wczytanie spraw z localStorage (lub czysta lista)
  useEffect(() => {
    const saved = getUserMattersFromStorage();
    setMatters(saved);
    setIsLoaded(true);
  }, []);

  const handleCreateMatter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseNumber.trim() && !title.trim()) {
      alert("Podaj sygnaturę akt lub tytuł sprawy.");
      return;
    }

    const newAgg = createCleanMatterAggregate({
      caseNumber: caseNumber.trim() || `SPRAW-${Date.now().toString().slice(-4)}`,
      title: title.trim() || `Sprawa ${caseNumber || "nowa"}`,
      courtName: courtName.trim() || "Sąd Rejonowy",
      courtDepartment: courtDepartment.trim() || "Wydział Cywilny",
      procedure,
      claimAmountPLN: Number(claimAmountPLN) || 0,
      claimantName: claimantName.trim() || "Powód",
      defendantName: defendantName.trim() || "Pozwany",
    });

    const updated = [newAgg, ...matters];
    setMatters(updated);
    saveUserMattersToStorage(updated);
    setIsCreateModalOpen(false);

    // Przekierowanie do nowej sprawy
    router.push(`/app/sprawy/${newAgg.matter.id}/workspace`);
  };

  const handleDeleteMatter = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (confirm("Czy na pewno chcesz usunąć tę sprawę z pulpitu?")) {
      const updated = matters.filter((m) => m.matter.id !== id);
      setMatters(updated);
      saveUserMattersToStorage(updated);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-12 text-[#5F6774] font-mono text-xs">
        Wczytywanie pulpitu kancelarii...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Pasek nagłówka */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#172338]">
            Sprawy w toku
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6774] mt-1 font-sans">
            Zarządzanie odpowiedziami na pozew i materiałem dowodowym na realnych dokumentach.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-[#172338] hover:bg-[#355CFF] text-[#FFFFFF] text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <span>+ Nowa sprawa procesowa</span>
        </button>
      </div>

      {/* Lista Spraw lub Elegancki Empty State */}
      {matters.length === 0 ? (
        <div className="bg-[#FFFFFF] border border-[#E1E3E7] rounded-xl p-8 sm:p-12 text-center shadow-paper space-y-6">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#EEF2FF] text-[#355CFF] flex items-center justify-center text-2xl">
            ⚖️
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-xl font-serif font-bold text-[#172338]">
              Czysty pulpit roboczy
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6774] leading-relaxed">
              W systemie nie ma żadnych sztucznych ani przykładowych dokumentów.
              Możesz natychmiast założyć sprawę i rozpocząć pracę na realnych aktach klienta.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full sm:w-auto bg-[#172338] hover:bg-[#355CFF] text-[#FFFFFF] text-xs sm:text-sm font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm"
            >
              + Załóż sprawę i wgraj dokumenty
            </button>
            <Link
              href="/demo"
              className="w-full sm:w-auto text-xs sm:text-sm font-medium text-[#172338] hover:text-[#355CFF] bg-[#FAF9F6] border border-[#E1E3E7] px-5 py-3 rounded-lg transition-colors text-center"
            >
              Otwórz czysty warsztat roboczy →
            </Link>
          </div>

          <div className="pt-6 border-t border-[#E1E3E7] max-w-xl mx-auto flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono text-[#5F6774]">
            <span>🔒 Tajemnica radcowska i adwokacka</span>
            <span>•</span>
            <span>📄 Bezpośredni import PDF / Word</span>
            <span>•</span>
            <span>⚖️ Eksport DOCX zgodny z KPC</span>
          </div>
        </div>
      ) : (
        <div className="bg-[#FFFFFF] border border-[#E1E3E7] rounded-xl shadow-paper overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-[#E1E3E7] flex items-center justify-between bg-[#FAF9F6]">
            <span className="text-xs font-mono text-[#5F6774] font-bold uppercase">
              Lista Twoich spraw ({matters.length})
            </span>
            <span className="text-xs font-mono text-[#137333] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#137333]"></span>
              Gotowy do pracy na aktach
            </span>
          </div>

          <div className="divide-y divide-[#E1E3E7]">
            {matters.map((agg) => {
              const m = agg.matter;
              return (
                <div
                  key={m.id}
                  className="p-4 sm:p-6 hover:bg-[#FAF9F6]/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#172338]">
                        {m.caseNumber}
                      </span>
                      <span className="text-[11px] font-sans px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#E1E3E7] text-[#5F6774]">
                        {m.courtDepartment}
                      </span>
                      <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-[#EEF2FF] text-[#355CFF]">
                        {m.procedure}
                      </span>
                      <span className="text-[11px] font-mono text-[#5F6774]">
                        Dokumenty w aktach: {agg.documents?.length || 0}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-[#172338] truncate">
                      {m.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-[#5F6774] font-mono">
                      <span>W.P.S.: <strong className="text-[#172338]">{formatGroszeToPLN(m.claimAmountGrosze)}</strong></span>
                      <span>•</span>
                      <span className="truncate max-w-[200px] sm:max-w-none">{m.courtName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-end md:self-auto">
                    <button
                      onClick={(e) => handleDeleteMatter(m.id, e)}
                      title="Usuń sprawę"
                      className="text-xs text-[#8C93A0] hover:text-[#C5221F] p-2 transition-colors rounded hover:bg-[#FCE8E6]"
                    >
                      Usuń
                    </button>

                    <Link
                      href={`/app/sprawy/${m.id}/workspace`}
                      className="bg-[#172338] hover:bg-[#355CFF] text-[#FFFFFF] text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm text-center"
                    >
                      Otwórz warsztat →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Tworzenia Nowej Sprawy */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172338]/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FFFFFF] border border-[#E1E3E7] rounded-xl max-w-lg w-full p-6 shadow-paper-elevated space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E3E7]">
              <h3 className="font-serif font-bold text-lg text-[#172338]">
                Nowa sprawa procesowa
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-[#8C93A0] hover:text-[#172338] text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMatter} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-semibold text-[#172338] mb-1">
                  Sygnatura akt (np. I C 452/26, VII GC 120/26)
                </label>
                <input
                  type="text"
                  value={caseNumber}
                  onChange={(e) => setCaseNumber(e.target.value)}
                  placeholder="np. I C 120/26"
                  required
                  className="w-full border border-[#E1E3E7] rounded-lg p-2.5 text-xs focus:border-[#355CFF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#172338] mb-1">
                  Tytuł / Przedmiot sprawy
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="np. Powództwo o zapłatę kary umownej / wykonanie umowy"
                  required
                  className="w-full border border-[#E1E3E7] rounded-lg p-2.5 text-xs focus:border-[#355CFF] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#172338] mb-1">
                    Powód (oznaczenie strony)
                  </label>
                  <input
                    type="text"
                    value={claimantName}
                    onChange={(e) => setClaimantName(e.target.value)}
                    placeholder="np. Jan Kowalski / Spółka XYZ"
                    className="w-full border border-[#E1E3E7] rounded-lg p-2 text-xs focus:border-[#355CFF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#172338] mb-1">
                    Pozwany (Twój mocodawca)
                  </label>
                  <input
                    type="text"
                    value={defendantName}
                    onChange={(e) => setDefendantName(e.target.value)}
                    placeholder="np. Pozwana Sp. z o.o."
                    className="w-full border border-[#E1E3E7] rounded-lg p-2 text-xs focus:border-[#355CFF] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#172338] mb-1">
                    Sąd
                  </label>
                  <input
                    type="text"
                    value={courtName}
                    onChange={(e) => setCourtName(e.target.value)}
                    placeholder="np. Sąd Okręgowy w Warszawie"
                    className="w-full border border-[#E1E3E7] rounded-lg p-2 text-xs focus:border-[#355CFF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#172338] mb-1">
                    Wydział
                  </label>
                  <input
                    type="text"
                    value={courtDepartment}
                    onChange={(e) => setCourtDepartment(e.target.value)}
                    placeholder="np. XVI Wydział Gospodarczy"
                    className="w-full border border-[#E1E3E7] rounded-lg p-2 text-xs focus:border-[#355CFF] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#172338] mb-1">
                    Wartość przedmiotu sporu (zł)
                  </label>
                  <input
                    type="number"
                    value={claimAmountPLN}
                    onChange={(e) => setClaimAmountPLN(Number(e.target.value))}
                    min="0"
                    step="100"
                    className="w-full border border-[#E1E3E7] rounded-lg p-2 text-xs focus:border-[#355CFF] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#172338] mb-1">
                    Tryb postępowania
                  </label>
                  <select
                    value={procedure}
                    onChange={(e) => setProcedure(e.target.value as MatterProcedure)}
                    className="w-full border border-[#E1E3E7] rounded-lg p-2 text-xs focus:border-[#355CFF] focus:outline-none bg-white"
                  >
                    <option value="CYWILNE_ZWYKLE">Zwykłe (proces cywilny)</option>
                    <option value="GOSPODARCZE">Gospodarcze (Dział IVa K.p.c.)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E1E3E7]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-[#E1E3E7] rounded-lg text-[#5F6774] hover:bg-[#FAF9F6]"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#172338] hover:bg-[#355CFF] text-[#FFFFFF] font-semibold rounded-lg shadow-sm transition-colors"
                >
                  Utwórz sprawę i otwórz warsztat →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
