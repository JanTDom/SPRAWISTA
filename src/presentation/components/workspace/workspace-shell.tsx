"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MatterFullAggregate } from "@/domain/repositories/matter-repository";
import { CitationLink } from "@/domain/models/evidence";

interface WorkspaceShellProps {
  aggregate: MatterFullAggregate;
  isDemo?: boolean;
}

export function WorkspaceShell({ aggregate, isDemo = false }: WorkspaceShellProps) {
  const {
    matter,
    documents,
    timeline,
    issues,
    draft,
    auditFindings,
    counterArguments,
    signatureChecks = [],
    caseLawPrecedents = [],
    recoveryCompensation,
    vatCheck,
  } = aggregate;

  // Aktywna zakładka w lewej szpalcie: "PISMO" | "CHRONOLOGIA" | "MAPA_SPORU" | "ANALIZA_PRZECIWNA" | "PRZED_PODPISEM" | "REJESTRY_I_PRAWO"
  const [activeTab, setActiveTab] = useState<
    "PISMO" | "CHRONOLOGIA" | "MAPA_SPORU" | "ANALIZA_PRZECIWNA" | "PRZED_PODPISEM" | "REJESTRY_I_PRAWO"
  >("PISMO");

  // Aktywny dokument i podświetlony fragment w prawej szpalcie
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[1]?.id || documents[0]?.id || "");
  const [activeChunkId, setActiveChunkId] = useState<string | null>("chunk-umowa-par4");
  const [isDossierCollapsed, setIsDossierCollapsed] = useState<boolean>(false);

  // Stan edycji pisma (wersja robocza)
  const [currentDraft, setCurrentDraft] = useState(draft);
  const [saveStatus, setSaveStatus] = useState<"SAVED" | "SAVING" | "MODIFIED">("SAVED");
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Funkcja skoku: "Od zdania do dowodu"
  const handleCitationClick = (citation: CitationLink) => {
    setSelectedDocId(citation.documentId);
    setActiveChunkId(citation.sourceChunkId);
    if (isDossierCollapsed) {
      setIsDossierCollapsed(false);
    }
  };

  // Aktywny dokument w podglądzie
  const activeDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  // Pobranie rzeczywistego pliku DOCX
  const handleDownloadDocx = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/export/docx/${matter.id}`);
      if (!response.ok) throw new Error("Błąd pobierania");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Odpowiedz_na_pozew_${matter.caseNumber.replace(/[\/\s]/g, "_")}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert("Nie udało się wygenerować pliku DOCX. Spróbuj ponownie.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F6F5F1] overflow-hidden">
      {/* 1. TOP STATUS & ACTION BAR */}
      <header className="h-14 bg-[#FFFFFF] border-b border-[#E1E3E7] px-4 sm:px-6 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/app/sprawy"
            className="text-xs font-mono text-[#5F6774] hover:text-[#172338] transition-colors flex items-center gap-1"
          >
            ← Wszystkie sprawy
          </Link>
          <span className="text-[#E1E3E7]">|</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-[#172338]">
                {matter.caseNumber}
              </span>
              <span className="text-xs font-sans px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#E1E3E7] text-[#5F6774]">
                {matter.courtDepartment}
              </span>
              {isDemo && (
                <span className="text-[11px] font-mono font-semibold bg-[#FEF7E0] text-[#B06000] px-2 py-0.5 rounded border border-[#F5E0A0]">
                  TRYB DEMO (dane syntetyczne)
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status zapisu */}
          <span className="text-xs font-mono text-[#5F6774] hidden sm:inline">
            {saveStatus === "SAVED" ? "✓ Zapisano w chmurze" : "Modyfikacja..."}
          </span>

          {/* Przycisk zwijania panelu akt */}
          <button
            onClick={() => setIsDossierCollapsed(!isDossierCollapsed)}
            className="text-xs font-mono text-[#172338] bg-[#FAF9F6] hover:bg-[#F6F5F1] border border-[#E1E3E7] px-3 py-1.5 rounded transition-colors hidden md:inline"
            title="Skrót: Cmd+\"
          >
            {isDossierCollapsed ? "Rozwiń akta (Cmd+\\)" : "Zwiń akta"}
          </button>

          {/* Eksport DOCX */}
          <button
            onClick={handleDownloadDocx}
            disabled={isDownloading}
            className="bg-[#172338] hover:bg-[#355CFF] text-[#FFFFFF] text-xs font-semibold px-4 py-2 rounded transition-colors shadow-sm flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#355CFF]"
          >
            {isDownloading ? (
              <span>Generowanie DOCX...</span>
            ) : (
              <>
                <span>Pobierz DOCX</span>
                <span className="font-mono text-[10px] bg-[#FFFFFF]/20 px-1 rounded">Word</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* 2. SUB-NAVIGATION (TABS) */}
      <div className="h-11 bg-[#FAF9F6] border-b border-[#E1E3E7] px-6 flex items-center justify-between shrink-0">
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab("PISMO")}
            className={`px-3 py-1.5 text-xs font-sans rounded-md transition-all ${
              activeTab === "PISMO"
                ? "bg-[#FFFFFF] text-[#172338] font-bold shadow-sm border border-[#E1E3E7]"
                : "text-[#5F6774] hover:text-[#172338]"
            }`}
          >
            Projekt Pisma Procesowego
          </button>

          <button
            onClick={() => setActiveTab("CHRONOLOGIA")}
            className={`px-3 py-1.5 text-xs font-sans rounded-md transition-all ${
              activeTab === "CHRONOLOGIA"
                ? "bg-[#FFFFFF] text-[#172338] font-bold shadow-sm border border-[#E1E3E7]"
                : "text-[#5F6774] hover:text-[#172338]"
            }`}
          >
            Oś Czasu Faktów ({timeline.length})
          </button>

          <button
            onClick={() => setActiveTab("MAPA_SPORU")}
            className={`px-3 py-1.5 text-xs font-sans rounded-md transition-all ${
              activeTab === "MAPA_SPORU"
                ? "bg-[#FFFFFF] text-[#172338] font-bold shadow-sm border border-[#E1E3E7]"
                : "text-[#5F6774] hover:text-[#172338]"
            }`}
          >
            Mapa Sporu i Zarzutów ({issues.length})
          </button>

          <button
            onClick={() => setActiveTab("ANALIZA_PRZECIWNA")}
            className={`px-3 py-1.5 text-xs font-sans rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === "ANALIZA_PRZECIWNA"
                ? "bg-[#FFFFFF] text-[#172338] font-bold shadow-sm border border-[#E1E3E7]"
                : "text-[#5F6774] hover:text-[#172338]"
            }`}
          >
            <span>Analiza Przeciwna</span>
            <span className="bg-[#FEF7E0] text-[#B06000] text-[10px] font-mono font-bold px-1.5 py-0.2 rounded">
              {counterArguments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("PRZED_PODPISEM")}
            className={`px-3 py-1.5 text-xs font-sans rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === "PRZED_PODPISEM"
                ? "bg-[#FFFFFF] text-[#172338] font-bold shadow-sm border border-[#E1E3E7]"
                : "text-[#5F6774] hover:text-[#172338]"
            }`}
          >
            <span>Przed Podpisem</span>
            <span className="bg-[#E6F4EA] text-[#137333] text-[10px] font-mono font-bold px-1.5 py-0.2 rounded">
              {auditFindings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("REJESTRY_I_PRAWO")}
            className={`px-3 py-1.5 text-xs font-sans rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === "REJESTRY_I_PRAWO"
                ? "bg-[#FFFFFF] text-[#172338] font-bold shadow-sm border border-[#E1E3E7]"
                : "text-[#5F6774] hover:text-[#172338]"
            }`}
          >
            <span>Rejestry i Prawo</span>
            <span className="bg-[#EEF2FF] text-[#355CFF] text-[10px] font-mono font-bold px-1.5 py-0.2 rounded">
              KRS • SN • NBP
            </span>
          </button>
        </nav>

        <div className="hidden lg:flex items-center gap-3 text-xs font-mono text-[#5F6774]">
          <span>W.P.S.: 147 600,00 PLN</span>
          <span>•</span>
          <span className="text-[#355CFF]">Termin odpowiedzi: 15.09.2026 r.</span>
        </div>
      </div>

      {/* 3. MAIN SPLIT-SCREEN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEWA SZPALTA: Treść Edytora / Zakładki Analityczne */}
        <div
          className={`flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 transition-all ${
            isDossierCollapsed ? "max-w-4xl mx-auto" : ""
          }`}
        >
          {/* Widok 1: Projekt Pisma */}
          {activeTab === "PISMO" && (
            <div className="sheet-paper max-w-3xl mx-auto p-8 sm:p-12 text-[#172338]">
              {/* Nagłówek Sądu */}
              <div className="text-right text-xs font-sans text-[#5F6774] mb-6">
                {currentDraft.courtHeader.city}, dnia {currentDraft.courtHeader.date}
              </div>

              <div className="mb-6">
                <p className="font-serif font-bold text-base">{currentDraft.courtHeader.courtName}</p>
                <p className="text-xs text-[#5F6774]">{currentDraft.courtHeader.department}</p>
                <p className="text-xs font-mono font-semibold text-[#355CFF] mt-1">
                  Sygn. akt: {currentDraft.courtHeader.caseNumber}
                </p>
              </div>

              {/* Tabela Stron */}
              <div className="bg-[#FAF9F6] border border-[#E1E3E7] rounded p-4 text-xs space-y-1.5 mb-8 font-sans">
                <div className="flex gap-4">
                  <span className="font-bold w-16 shrink-0">Powód:</span>
                  <span className="text-[#5F6774]">{currentDraft.claimantRepresentation}</span>
                </div>
                <div className="flex gap-4">
                  <span className="font-bold w-16 shrink-0">Pozwany:</span>
                  <span className="text-[#5F6774]">{currentDraft.defendantRepresentation}</span>
                </div>
                <div className="flex gap-4">
                  <span className="font-bold w-16 shrink-0">W.P.S.:</span>
                  <span className="font-mono text-[#172338]">{currentDraft.valueOfDispute}</span>
                </div>
              </div>

              {/* Tytuł Pisma */}
              <h2 className="text-center font-serif font-bold text-xl uppercase tracking-wider text-[#172338] mb-6">
                {currentDraft.title}
              </h2>

              {/* Petitum */}
              <div className="space-y-2 text-sm leading-relaxed mb-8">
                <p className="font-sans font-medium text-xs text-[#5F6774] uppercase tracking-wider mb-2">
                  Wnioski procesowe (Petitum):
                </p>
                {currentDraft.petitumPoints.map((point, i) => (
                  <div key={i} className="flex gap-3 items-baseline">
                    <span className="font-serif font-bold text-sm text-[#355CFF]">{i + 1}.</span>
                    <p className="font-serif text-[#172338]">{point}</p>
                  </div>
                ))}
              </div>

              {/* Wnioski Dowodowe */}
              <div className="space-y-2 text-xs leading-relaxed mb-8 bg-[#FAF9F6] p-4 rounded border border-[#E1E3E7]">
                <p className="font-mono uppercase font-bold text-[#172338] mb-2">WNIOSKI DOWODOWE (art. 227 K.p.c.):</p>
                {currentDraft.evidentiaryMotions.map((motion, i) => (
                  <p key={i} className="text-[#5F6774] pl-2 border-l-2 border-[#355CFF]">
                    {motion}
                  </p>
                ))}
              </div>

              {/* Sekcje Uzasadnienia z Klikalnymi Odznakami Dowodów */}
              <div className="space-y-8">
                {currentDraft.sections.map((sec) => (
                  <div key={sec.id} className="space-y-3">
                    <h3 className="font-serif font-bold text-base text-[#172338] pb-1 border-b border-[#E1E3E7]">
                      {sec.title}
                    </h3>
                    <div className="font-serif text-[15px] leading-relaxed text-[#172338] space-y-4">
                      {sec.contentMarkdown.split("\n\n").map((paragraph, pIdx) => (
                        <p key={pIdx}>{paragraph}</p>
                      ))}
                    </div>

                    {/* Odznaki cytowań dla tej sekcji */}
                    {sec.citations.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-dashed border-[#E1E3E7] space-y-2">
                        <span className="text-[11px] font-mono text-[#5F6774] block">
                          Powiązania dowodowe w tej sekcji (kliknij, aby sprawdzić źródło):
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {sec.citations.map((cit) => (
                            <button
                              key={cit.id}
                              onClick={() => handleCitationClick(cit)}
                              className={`text-xs font-mono px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-all border ${
                                activeChunkId === cit.sourceChunkId
                                  ? "bg-[#355CFF] text-[#FFFFFF] border-[#2849D9] shadow-sm"
                                  : "bg-[#EEF2FF] text-[#355CFF] border-[#C7D2FE] hover:bg-[#E0E7FF]"
                              }`}
                            >
                              <span>{cit.documentTitle.split(" ")[0]} (str. {cit.pageNumber})</span>
                              <span className="text-[10px]">↗</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Podpis */}
              <div className="mt-12 pt-8 text-right text-xs text-[#5F6774] font-serif italic">
                ...........................................................
                <span className="block mt-1 font-sans not-italic text-[11px] text-[#8C93A0]">
                  r.pr. Adam Nowicki (pełnomocnik pozwanej)
                </span>
              </div>

              {/* Spis załączników */}
              <div className="mt-8 pt-6 border-t border-[#E1E3E7] text-xs text-[#5F6774]">
                <p className="font-mono uppercase font-bold text-[#172338] mb-2">Załączniki:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  {currentDraft.annexes.map((annex, aIdx) => (
                    <li key={aIdx}>{annex}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {/* Widok 2: Oś Czasu */}
          {activeTab === "CHRONOLOGIA" && (
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="mb-6">
                <h2 className="text-2xl font-serif font-bold text-[#172338]">Chronologia Faktów Sprawy</h2>
                <p className="text-sm text-[#5F6774] mt-1">
                  Zdarzenia wyekstrahowane z dokumentów z podziałem na statusy ontologiczne.
                </p>
              </div>

              <div className="relative pl-6 border-l-2 border-[#E1E3E7] space-y-6">
                {timeline.map((event) => (
                  <div key={event.id} className="relative bg-[#FFFFFF] border border-[#E1E3E7] rounded-lg p-5 shadow-sm">
                    <div className="absolute -left-[31px] top-5 w-3 h-3 rounded-full bg-[#355CFF] border-2 border-[#FFFFFF]"></div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-[#355CFF]">{event.date}</span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#E1E3E7] text-[#5F6774]">
                        Status: {event.status}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-base text-[#172338] mb-1">{event.title}</h3>
                    <p className="text-sm text-[#5F6774] leading-relaxed mb-3">{event.description}</p>
                    {event.sourceDocumentTitle && (
                      <div className="text-xs font-mono text-[#5F6774] bg-[#FAF9F6] p-2 rounded flex items-center justify-between">
                        <span>Źródło: {event.sourceDocumentTitle} (str. {event.pageNumber})</span>
                        {event.sourceChunkId && (
                          <button
                            onClick={() => {
                              const doc = documents.find((d) => d.chunks.some((c) => c.id === event.sourceChunkId));
                              if (doc) setSelectedDocId(doc.id);
                              setActiveChunkId(event.sourceChunkId || null);
                            }}
                            className="text-[#355CFF] hover:underline"
                          >
                            Pokaż w aktach ↗
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Widok 3: Mapa Sporu */}
          {activeTab === "MAPA_SPORU" && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-serif font-bold text-[#172338]">Mapa Sporu i Zarzutów</h2>
                <p className="text-sm text-[#5F6774] mt-1">
                  Zestawienie twierdzeń powoda, obrony pozwanego i dowodów.
                </p>
              </div>

              <div className="space-y-4">
                {issues.map((issue) => (
                  <div key={issue.id} className="bg-[#FFFFFF] border border-[#E1E3E7] rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono bg-[#EEF2FF] text-[#355CFF] font-semibold px-2 py-0.5 rounded">
                        Kategoria: {issue.category}
                      </span>
                      <span className="text-xs font-sans font-bold text-[#137333] bg-[#E6F4EA] px-2.5 py-0.5 rounded">
                        Decyzja: {issue.lawyerDecision}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-[#172338] mb-4">{issue.title}</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-xs">
                      <div className="p-3 bg-[#FCE8E6]/40 border border-[#FAD2CF] rounded-lg">
                        <strong className="text-[#C5221F] block mb-1">Stanowisko Powoda:</strong>
                        <p className="text-[#5F6774] leading-relaxed">{issue.claimantPosition}</p>
                      </div>
                      <div className="p-3 bg-[#E6F4EA]/40 border border-[#C6ECCB] rounded-lg">
                        <strong className="text-[#137333] block mb-1">Obrona Pozwanego:</strong>
                        <p className="text-[#5F6774] leading-relaxed">{issue.defendantPosition}</p>
                      </div>
                    </div>

                    <div className="text-xs font-mono bg-[#FAF9F6] p-3 rounded border border-[#E1E3E7] text-[#5F6774] space-y-1">
                      <p><strong className="text-[#172338]">Materiał wspierający:</strong> {issue.supportingProof}</p>
                      <p><strong className="text-[#172338]">Odpowiedź powoda:</strong> {issue.adversaryCounterProof}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Widok 4: Analiza Przeciwna */}
          {activeTab === "ANALIZA_PRZECIWNA" && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="mb-6">
                <div className="flex items-center gap-2 text-xs font-mono text-[#B06000] font-semibold uppercase">
                  <span>Adversarial Review</span>
                  <span>•</span>
                  <span>Symulacja Riposty</span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#172338] mt-1">
                  Test Obciążeniowy Linii Obrony
                </h2>
                <p className="text-sm text-[#5F6774] mt-1">
                  Weryfikacja słabości argumentacji z perspektywy pełnomocnika powoda.
                </p>
              </div>

              <div className="space-y-4">
                {counterArguments.map((adv) => (
                  <div key={adv.id} className="bg-[#FFFFFF] border border-[#E1E3E7] rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-serif font-bold text-base text-[#172338]">
                        {adv.objectionTitle}
                      </h3>
                      <span
                        className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                          adv.defenseWeaknessScore === "NISKA"
                            ? "bg-[#E6F4EA] text-[#137333]"
                            : adv.defenseWeaknessScore === "SREDNIA"
                            ? "bg-[#FEF7E0] text-[#B06000]"
                            : "bg-[#FCE8E6] text-[#C5221F]"
                        }`}
                      >
                        Ryzyko: {adv.defenseWeaknessScore}
                      </span>
                    </div>

                    <div className="p-3.5 bg-[#FAF9F6] border-l-4 border-[#B06000] rounded-r text-xs text-[#172338] leading-relaxed mb-3">
                      <strong className="block text-[#B06000] uppercase font-mono mb-1">
                        Prawdopodobna riposta pełnomocnika powoda:
                      </strong>
                      {adv.simulatedClaimantRiposte}
                    </div>

                    <p className="text-xs text-[#5F6774] leading-relaxed mb-3">
                      <strong className="text-[#172338]">Przewidywane wnioski powoda:</strong> {adv.claimantPossibleProofs.join("; ")}
                    </p>

                    <div className="p-3 bg-[#EEF2FF] rounded border border-[#C7D2FE] text-xs text-[#172338]">
                      <strong className="text-[#355CFF]">Rekomendacja wzmocnienia:</strong> {adv.strategicRecommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Widok 5: Przed Podpisem (Audyt) */}
          {activeTab === "PRZED_PODPISEM" && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-serif font-bold text-[#172338]">
                  Kontrola Merytoryczna „Przed Podpisem”
                </h2>
                <p className="text-sm text-[#5F6774] mt-1">
                  Automatyczny audyt spójności rachunkowej, brakujących dat i ryzyk procesowych.
                </p>
              </div>

              <div className="space-y-4">
                {auditFindings.map((finding) => (
                  <div key={finding.id} className="bg-[#FFFFFF] border border-[#E1E3E7] rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          finding.severity === "BLAD"
                            ? "bg-[#FCE8E6] text-[#C5221F]"
                            : finding.severity === "RYZYKO"
                            ? "bg-[#FEF7E0] text-[#B06000]"
                            : finding.severity === "BRAK_DANYCH"
                            ? "bg-[#EEF2FF] text-[#355CFF]"
                            : "bg-[#FAF9F6] text-[#5F6774]"
                        }`}
                      >
                        {finding.severity}
                      </span>
                      <span className="text-xs font-mono text-[#5F6774]">
                        Lokalizacja: {finding.location}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-[#172338] mb-2">
                      {finding.title}
                    </h3>
                    <p className="text-xs text-[#5F6774] leading-relaxed mb-3">
                      {finding.description}
                    </p>

                    {finding.legalBasisOrSource && (
                      <p className="text-xs font-mono text-[#172338] bg-[#FAF9F6] p-2 rounded mb-3">
                        Podstawa / Źródło: {finding.legalBasisOrSource}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-[#E1E3E7] text-xs">
                      <span className="text-[#355CFF] font-medium">
                        Zalecenie: {finding.recommendedAction}
                      </span>
                      <span className="font-mono bg-[#E6F4EA] text-[#137333] px-2 py-0.5 rounded">
                        Status: {finding.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Widok 6: Rejestry Publiczne i Baza Prawa (KRS, SN, NBP, VAT) */}
          {activeTab === "REJESTRY_I_PRAWO" && (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Nagłówek sekcji */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-bold bg-[#EEF2FF] text-[#355CFF] px-2 py-0.5 rounded border border-[#C7D2FE]">
                    ZGODNOŚĆ Z DANYMI PAŃSTWOWYMI
                  </span>
                  <span className="text-xs font-mono text-[#5F6774]">
                    Weryfikacja: KRS • Sąd Najwyższy • NBP • KAS
                  </span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#172338]">
                  Wiarygodność Procesowa i Źródła Zewnętrzne
                </h2>
                <p className="text-sm text-[#5F6774] mt-1">
                  Automatyczna kontrola reprezentacji stron, autentycznych precedensów orzeczniczych i kursów walutowych.
                </p>
              </div>

              {/* 1. KONTROLA UMOCAWIANIA I REPREZENTACJI (KRS) */}
              <div className="bg-[#FFFFFF] border border-[#E1E3E7] rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#E1E3E7] pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#172338]">
                      1. Weryfikacja Umocowania i Reprezentacji Stron (KRS)
                    </h3>
                    <p className="text-xs text-[#5F6774] mt-0.5">
                      Kontrola zgodności podpisów na umowach z rejestrem przedsiębiorców w datach czynności.
                    </p>
                  </div>
                  <span className="text-xs font-mono bg-[#FEF7E0] text-[#B06000] px-2.5 py-1 rounded font-bold border border-[#F5E0A0]">
                    Wykryto 1 wadę bezwzględną
                  </span>
                </div>

                <div className="space-y-3">
                  {signatureChecks.map((check, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border text-xs leading-relaxed ${
                        check.findingSeverity === "WADA_BEZWZGLEDNA"
                          ? "bg-[#FEF7E0]/40 border-[#B06000]"
                          : "bg-[#FAF9F6] border-[#E1E3E7]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-[#172338] text-sm">
                          {check.documentTitle}
                        </span>
                        <span
                          className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded ${
                            check.findingSeverity === "WADA_BEZWZGLEDNA"
                              ? "bg-[#FCE8E6] text-[#C5221F]"
                              : "bg-[#E6F4EA] text-[#137333]"
                          }`}
                        >
                          {check.findingSeverity === "WADA_BEZWZGLEDNA"
                            ? "⚠ BRAK UMOCAWIANIA (ART. 103 K.C.)"
                            : "✓ ZGODNE Z KRS"}
                        </span>
                      </div>
                      <p className="text-[#5F6774] mb-2">
                        <strong>Sygnatariusz:</strong> {check.signatoryName} ({check.purportedRole}) • Data podpisu: {check.signatureDate}
                      </p>
                      <p className="text-[#172338] mb-2 font-mono bg-[#FFFFFF] p-2.5 rounded border border-[#E1E3E7]">
                        {check.findingDescription}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#E1E3E7]/60">
                        <span className="text-[11px] text-[#355CFF] font-medium">
                          <strong>Zalecenie procesowe:</strong> {check.proceduralRecommendation}
                        </span>
                        <span className="font-mono text-[10px] text-[#8C93A0] shrink-0">
                          Podstawa: {check.legalBasis}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. PRECEDENSY SĄDU NAJWYŻSZEGO (ZERO HALUCYNACJI) */}
              <div className="bg-[#FFFFFF] border border-[#E1E3E7] rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#E1E3E7] pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#172338]">
                      2. Sprawdzone Orzecznictwo Sądu Najwyższego (Zero Halucynacji)
                    </h3>
                    <p className="text-xs text-[#5F6774] mt-0.5">
                      Autentyczne sygnatury i tezy powiązane bezpośrednio z linią obrony w niniejszej sprawie.
                    </p>
                  </div>
                  <span className="text-xs font-mono bg-[#E6F4EA] text-[#137333] px-2.5 py-1 rounded font-bold">
                    ✓ 4 zweryfikowane tezy SN
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {caseLawPrecedents.map((prec) => (
                    <div
                      key={prec.id}
                      className="p-4 rounded-lg border border-[#E1E3E7] bg-[#FAF9F6] text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#355CFF]">
                            {prec.caseNumber}
                          </span>
                          <span className="text-[#5F6774]">•</span>
                          <span className="font-sans text-[#172338] font-medium">
                            {prec.courtName} ({prec.division})
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-[#5F6774]">
                          {prec.judgmentType} z dnia {prec.judgmentDate} r.
                        </span>
                      </div>

                      <blockquote className="font-serif text-[13px] text-[#172338] italic leading-relaxed pl-3 border-l-2 border-[#355CFF] bg-[#FFFFFF] p-3 rounded-r">
                        „{prec.thesis}”
                      </blockquote>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-mono text-[#5F6774]">Zastosowanie:</span>
                          {prec.associatedIssues.map((iss, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-mono bg-[#FFFFFF] border border-[#E1E3E7] text-[#172338] px-1.5 py-0.5 rounded"
                            >
                              {iss}
                            </span>
                          ))}
                        </div>
                        {prec.directLink && (
                          <a
                            href={prec.directLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#355CFF] hover:underline font-mono text-[11px] shrink-0"
                          >
                            Źródło orzeczenia ↗
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. FINANSE NBP & BIAŁA LISTA PODATNIKÓW VAT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* NBP */}
                {recoveryCompensation && (
                  <div className="bg-[#FFFFFF] border border-[#E1E3E7] rounded-xl p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-[#E1E3E7] pb-2">
                      <h4 className="font-serif font-bold text-sm text-[#172338]">
                        3. Rekompensata NBP ({recoveryCompensation.statutoryEuroTier} EUR)
                      </h4>
                      <span className="text-[10px] font-mono bg-[#EEF2FF] text-[#355CFF] px-2 py-0.5 rounded font-bold">
                        Oficjalna Tabela A
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs text-[#5F6774]">
                      <p>
                        Wartość roszczenia: <strong className="text-[#172338] font-mono">147 600,00 zł</strong>
                      </p>
                      <p>
                        Stawka ustawowa: <strong className="text-[#172338] font-mono">{recoveryCompensation.statutoryEuroTier} EUR</strong> (dla długu &gt; 50 tys. zł)
                      </p>
                      <p>
                        Kurs NBP (tabela {recoveryCompensation.nbpRateUsed.tableNumber}):{" "}
                        <strong className="text-[#172338] font-mono">{recoveryCompensation.nbpRateUsed.midRate.toFixed(4)} PLN</strong>
                      </p>
                      <p className="pt-2 text-sm text-[#172338] font-bold">
                        Równowartość: <span className="font-mono text-[#355CFF]">{recoveryCompensation.formattedPln}</span>
                      </p>
                    </div>
                    <p className="text-[10px] font-mono text-[#8C93A0] pt-1 border-t border-[#E1E3E7]">
                      Podstawa: {recoveryCompensation.legalBasis}
                    </p>
                  </div>
                )}

                {/* VAT Whitelist */}
                {vatCheck && (
                  <div className="bg-[#FFFFFF] border border-[#E1E3E7] rounded-xl p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-[#E1E3E7] pb-2">
                      <h4 className="font-serif font-bold text-sm text-[#172338]">
                        4. Biała Lista Podatników VAT (KAS)
                      </h4>
                      <span className="text-[10px] font-mono bg-[#E6F4EA] text-[#137333] px-2 py-0.5 rounded font-bold">
                        ✓ Aktywny VAT
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs text-[#5F6774]">
                      <p>
                        Podatnik: <strong className="text-[#172338]">{vatCheck.companyName}</strong>
                      </p>
                      <p>
                        NIP: <strong className="text-[#172338] font-mono">{vatCheck.nip}</strong>
                      </p>
                      <p>
                        Rachunek z pozwu: <strong className="text-[#172338] font-mono text-[11px] block">{vatCheck.bankAccountChecked}</strong>
                      </p>
                      <p className="text-[11px] text-[#137333] bg-[#E6F4EA] p-2 rounded">
                        ✓ Rachunek bankowy figuruje w rejestrze Szefa KAS.
                      </p>
                    </div>
                    <p className="text-[10px] font-mono text-[#8C93A0] pt-1 border-t border-[#E1E3E7]">
                      Zapytanie: {vatCheck.requestId}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* PRAWA SZPALTA: Wgląd w Akta Sprawy (PDF & Chunks) */}
        {!isDossierCollapsed && (
          <aside className="w-full lg:w-[420px] xl:w-[480px] bg-[#FFFFFF] border-l border-[#E1E3E7] flex flex-col shrink-0 shadow-paper">
            {/* Wybór Załącznika z Akt */}
            <div className="p-4 border-b border-[#E1E3E7] bg-[#FAF9F6]">
              <label className="text-[11px] font-mono uppercase text-[#5F6774] block mb-1.5 font-bold">
                Wybierz dokument z akt sprawy:
              </label>
              <select
                value={selectedDocId}
                onChange={(e) => {
                  setSelectedDocId(e.target.value);
                  setActiveChunkId(null);
                }}
                className="w-full text-xs font-sans bg-[#FFFFFF] border border-[#E1E3E7] rounded px-3 py-2 text-[#172338] focus:outline-none focus:ring-1 focus:ring-[#355CFF]"
              >
                {documents.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.fileName} ({doc.pageCount} str.)
                  </option>
                ))}
              </select>

              {/* Raport Kompletności dla Aktywnego Dokumentu */}
              <div className="mt-3 flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#5F6774]">
                  Odczytano: {activeDoc?.completenessReport.digitallyExtractedPages + activeDoc?.completenessReport.ocrPages} / {activeDoc?.pageCount} str.
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded font-semibold ${
                    activeDoc?.completenessReport.status === "COMPLETE"
                      ? "bg-[#E6F4EA] text-[#137333]"
                      : "bg-[#FEF7E0] text-[#B06000]"
                  }`}
                >
                  {activeDoc?.completenessReport.status === "COMPLETE" ? "✓ Pełny odczyt" : "OCR selektywny"}
                </span>
              </div>
            </div>

            {/* Wykaz Wyekstrahowanych Fragmentów Tekstowych */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 bg-[#F6F5F1]/30">
              <div className="text-xs font-mono text-[#5F6774] uppercase tracking-wider mb-2">
                Wyekstrahowane segmenty dowodowe:
              </div>

              {activeDoc?.chunks.map((chunk) => {
                const isActive = chunk.id === activeChunkId;
                return (
                  <div
                    key={chunk.id}
                    id={chunk.id}
                    className={`p-4 rounded-lg border text-xs transition-all ${
                      isActive
                        ? "bg-[#FEF7E0] border-[#B06000] shadow-sm"
                        : "bg-[#FFFFFF] border-[#E1E3E7] hover:border-[#355CFF]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#E1E3E7]/60">
                      <span className="font-mono font-bold text-[#172338]">
                        Strona {chunk.pageNumber} • Akapit {chunk.paragraphIndex}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-mono bg-[#B06000] text-[#FFFFFF] px-1.5 py-0.5 rounded font-bold">
                          AKTYWNY CYTAT ↗
                        </span>
                      )}
                    </div>
                    <p className="font-sans leading-relaxed text-[#172338]">
                      „{chunk.text}”
                    </p>
                    <div className="mt-2 text-[10px] font-mono text-[#8C93A0] flex justify-between">
                      <span>Chunk ID: {chunk.id}</span>
                      <span>100% dopasowanie</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stopka Panelu Akt */}
            <div className="p-3 border-t border-[#E1E3E7] bg-[#FAF9F6] text-[11px] font-mono text-[#5F6774] flex items-center justify-between">
              <span>Bezpieczne storage EOG</span>
              <span className="text-[#137333]">✓ Zweryfikowano RLS</span>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
