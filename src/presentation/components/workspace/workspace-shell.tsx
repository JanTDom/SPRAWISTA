"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MatterFullAggregate } from "@/domain/repositories/matter-repository";
import { CaseDocument, DocumentChunk, CitationLink, TimelineEvent, CaseIssue } from "@/domain/models/evidence";
import { ProceduralDraft, PleadingSection } from "@/domain/models/pleading";
import { LegalResearchPanel } from "./legal-research-panel";
import { parseRawTextToDocument } from "@/domain/services/document-parser";

interface WorkspaceShellProps {
  aggregate: MatterFullAggregate;
  isDemo?: boolean;
}

export function WorkspaceShell({ aggregate, isDemo = false }: WorkspaceShellProps) {
  const { matter } = aggregate;

  // Dynamiczny stan spraw i dokumentów (możliwość ingerencji na każdym poziomie)
  const [documents, setDocuments] = useState<CaseDocument[]>(aggregate.documents ? [...aggregate.documents] : []);
  const [timeline, setTimeline] = useState<TimelineEvent[]>(aggregate.timeline ? [...aggregate.timeline] : []);
  const [issues, setIssues] = useState<CaseIssue[]>(aggregate.issues ? [...aggregate.issues] : []);
  const [counterArguments, setCounterArguments] = useState(aggregate.counterArguments ? [...aggregate.counterArguments] : []);
  const [auditFindings, setAuditFindings] = useState(aggregate.auditFindings ? [...aggregate.auditFindings] : []);
  const [currentDraft, setCurrentDraft] = useState<ProceduralDraft>(aggregate.draft);

  // Aktywna zakładka
  const [activeTab, setActiveTab] = useState<
    "PISMO" | "CHRONOLOGIA" | "MAPA_SPORU" | "ANALIZA_PRZECIWNA" | "PRZED_PODPISEM" | "REJESTRY_I_PRAWO"
  >("PISMO");

  // Przełącznik widoku na mobile: "EDITOR" (pismo / zakładki) lub "DOSSIER" (akta sprawy)
  const [mobileView, setMobileView] = useState<"EDITOR" | "DOSSIER">("EDITOR");

  // Aktywny dokument i podświetlony fragment w panelu akt
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || "");
  const [activeChunkId, setActiveChunkId] = useState<string | null>(null);
  const [isDossierCollapsed, setIsDossierCollapsed] = useState<boolean>(false);

  // Modal wgrywania / wklejania dokumentu
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadType, setUploadType] = useState("ZALACZNIK");
  const [uploadText, setUploadText] = useState("");

  // Modal dodawania faktu do osi czasu
  const [isFactModalOpen, setIsFactModalOpen] = useState(false);
  const [factDate, setFactDate] = useState("");
  const [factDescription, setFactDescription] = useState("");
  const [factProofSource, setFactProofSource] = useState("");

  // Modal dodawania zarzutu
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [issueTitle, setIssueTitle] = useState("");
  const [issueLegalBasis, setIssueLegalBasis] = useState("");
  const [issueArgument, setIssueArgument] = useState("");

  // Wybrany fragment do wyciągania wniosków (zaznaczenie tekstu)
  const [selectedChunkSnippet, setSelectedChunkSnippet] = useState<{
    text: string;
    chunkId: string;
    docTitle: string;
    page: number;
  } | null>(null);

  const [aiInsightLoading, setAiInsightLoading] = useState(false);
  const [aiInsightResult, setAiInsightResult] = useState<string | null>(null);

  // Stan zapisu i eksportu
  const [saveStatus, setSaveStatus] = useState<"SAVED" | "MODIFIED">("SAVED");
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Synchronizacja wybranego dokumentu po zmianie listy dokumentów
  useEffect(() => {
    if (!selectedDocId && documents.length > 0) {
      setSelectedDocId(documents[0].id);
    }
  }, [documents, selectedDocId]);

  // Skok: "Od zdania do dowodu"
  const handleCitationClick = (citation: CitationLink) => {
    setSelectedDocId(citation.documentId);
    setActiveChunkId(citation.sourceChunkId);
    setMobileView("DOSSIER");
    if (isDossierCollapsed) {
      setIsDossierCollapsed(false);
    }
  };

  const activeDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  // Pobranie pliku DOCX ze zaktualizowaną przez prawnika treścią
  const handleDownloadDocx = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/export/docx/${matter.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft: currentDraft }),
      });
      if (!response.ok) throw new Error("Błąd pobierania");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Odpowiedz_na_pozew_${(currentDraft.courtHeader.caseNumber || matter.caseNumber).replace(/[\/\s]/g, "_")}.docx`;
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

  // Dodanie nowego dokumentu przez wklejenie / wgranie tekstu
  const handleSaveUploadedDocument = () => {
    if (!uploadText.trim()) {
      alert("Wprowadź treść lub wgraj plik dokumentu.");
      return;
    }
    const docId = `doc-${Date.now()}`;
    const newDoc = parseRawTextToDocument(docId, {
      fileName: uploadTitle.trim() || `Dokument_${documents.length + 1}.pdf`,
      fileType: uploadType,
      rawContent: uploadText,
    });
    setDocuments((prev) => [...prev, newDoc]);
    setSelectedDocId(docId);
    setUploadTitle("");
    setUploadText("");
    setIsUploadModalOpen(false);
    setSaveStatus("MODIFIED");
  };

  // Obsługa wgrania pliku przez przeglądarkę
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadTitle(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setUploadText(content);
      }
    };
    reader.readAsText(file);
  };

  // Wstawienie zaznaczonego cytatu do pisma procesowego
  const handleInsertChunkAsCitation = () => {
    if (!selectedChunkSnippet) return;
    const citationText = ` (dowód: ${selectedChunkSnippet.docTitle}, k. ${selectedChunkSnippet.page})`;
    const updatedSections = currentDraft.sections.map((sec, idx) => {
      if (idx === currentDraft.sections.length - 1) {
        return {
          ...sec,
          contentMarkdown: `${sec.contentMarkdown}\n\nJak wynika z treści dokumentu: „${selectedChunkSnippet.text}”${citationText}.`,
        };
      }
      return sec;
    });

    setCurrentDraft({
      ...currentDraft,
      sections: updatedSections,
      evidentiaryMotions: [
        ...currentDraft.evidentiaryMotions,
        `Dowód z dokumentu ${selectedChunkSnippet.docTitle} (k. ${selectedChunkSnippet.page}) na fakt treści zobowiązania i okoliczności sprawy.`,
      ],
    });
    setSelectedChunkSnippet(null);
    setSaveStatus("MODIFIED");
    setActiveTab("PISMO");
    setMobileView("EDITOR");
  };

  // Utworzenie zarzutu procesowego z zaznaczonego fragmentu
  const handleCreateIssueFromChunk = () => {
    if (!selectedChunkSnippet) return;
    setIssueTitle(`Zarzut wynikający z ${selectedChunkSnippet.docTitle}`);
    setIssueArgument(`Na podstawie fragmentu: „${selectedChunkSnippet.text}” (k. ${selectedChunkSnippet.page}) strona pozwana podnosi zarzut...`);
    setIsIssueModalOpen(true);
  };

  // Dodanie faktu do osi czasu z zaznaczonego fragmentu
  const handleAddFactFromChunk = () => {
    if (!selectedChunkSnippet) return;
    setFactDescription(`Okoliczność wynikająca z: „${selectedChunkSnippet.text}”`);
    setFactProofSource(`${selectedChunkSnippet.docTitle} (k. ${selectedChunkSnippet.page})`);
    setIsFactModalOpen(true);
  };

  // Analiza wycinka przez AI Gemini
  const handleAiAnalyzeChunk = async () => {
    if (!selectedChunkSnippet) return;
    setAiInsightLoading(true);
    setAiInsightResult(null);
    try {
      const res = await fetch("/api/legal-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ai_chat",
          question: `Jesteś radcą prawnym reprezentującym pozwanego w sprawie o zapłatę. Przeanalizuj ten fragment dokumentu: „${selectedChunkSnippet.text}”. Sformułuj zwięzły wniosek obrończy lub zarzut, na który prawnik może powołać się w odpowiedzi na pozew.`,
        }),
      });
      const data = await res.json();
      setAiInsightResult(data.answer || "Brak odpowiedzi od asystenta AI.");
    } catch (e) {
      setAiInsightResult("Nie udało się połączyć z asystentem AI.");
    } finally {
      setAiInsightLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] max-h-[100dvh] bg-[#F6F5F1] overflow-hidden text-[#172338]">
      {/* 1. GÓRNY PASEK STANU I AKCJI */}
      <header className="h-14 bg-[#FFFFFF] border-b border-[#E1E3E7] px-2 sm:px-4 lg:px-6 flex items-center justify-between z-30 shrink-0 gap-1 sm:gap-2">
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          <Link
            href="/app/sprawy"
            className="text-xs font-mono text-[#5F6774] hover:text-[#172338] transition-colors shrink-0 flex items-center gap-0.5 p-1 rounded hover:bg-[#FAF9F6]"
            title="Powrót do listy spraw"
          >
            ← <span className="hidden sm:inline">Sprawy</span>
          </Link>
          <span className="text-[#E1E3E7] shrink-0">|</span>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-mono font-bold text-xs sm:text-sm text-[#172338] truncate max-w-[85px] sm:max-w-[200px]">
              {matter.caseNumber}
            </span>
            <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-[#FAF9F6] border border-[#E1E3E7] text-[#5F6774] hidden md:inline truncate">
              {matter.courtDepartment}
            </span>
          </div>
        </div>

        {/* PRZEŁĄCZNIK WIDOKU NA MOBILE: Pismo vs Akta */}
        <div className="flex lg:hidden items-center bg-[#FAF9F6] border border-[#E1E3E7] rounded-lg p-0.5 shrink-0">
          <button
            onClick={() => setMobileView("EDITOR")}
            className={`px-2 py-1 text-[11px] font-sans font-medium rounded-md transition-all ${
              mobileView === "EDITOR"
                ? "bg-[#172338] text-[#FFFFFF] shadow-sm font-bold"
                : "text-[#5F6774] hover:text-[#172338]"
            }`}
          >
            📝 Pismo
          </button>
          <button
            onClick={() => setMobileView("DOSSIER")}
            className={`px-2 py-1 text-[11px] font-sans font-medium rounded-md transition-all flex items-center gap-1 ${
              mobileView === "DOSSIER"
                ? "bg-[#172338] text-[#FFFFFF] shadow-sm font-bold"
                : "text-[#5F6774] hover:text-[#172338]"
            }`}
          >
            <span>📁 Akta</span>
            <span className="text-[9px] font-mono bg-[#E1E3E7] text-[#172338] px-1 rounded-full">
              {documents.length}
            </span>
          </button>
        </div>

        {/* AKCJE DESKTOP / MOBILE */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="text-[11px] sm:text-xs font-sans font-medium bg-[#FAF9F6] hover:bg-[#EEF2FF] text-[#355CFF] border border-[#C7D2FE] px-2 sm:px-3 py-1 sm:py-1.5 rounded-md transition-colors flex items-center gap-1"
          >
            <span>+</span>
            <span className="hidden sm:inline">Wgraj dokument</span>
            <span className="sm:hidden">Plik</span>
          </button>

          <button
            onClick={handleDownloadDocx}
            disabled={isDownloading}
            className="bg-[#172338] hover:bg-[#355CFF] text-[#FFFFFF] text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-md transition-colors shadow-sm flex items-center gap-1"
          >
            {isDownloading ? (
              <span>...</span>
            ) : (
              <>
                <span>DOCX</span>
                <span className="font-mono text-[9px] bg-[#FFFFFF]/20 px-1 rounded hidden sm:inline">Word</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* 2. SUB-NAWIGACJA ZAKŁADEK (RESPONSYWNA, Z POZIOMYM SCROLLEM BEZ UCINANIA) */}
      <div className="h-12 bg-[#FAF9F6] border-b border-[#E1E3E7] px-3 sm:px-6 flex items-center shrink-0 overflow-x-auto whitespace-nowrap scrollbar-none">
        <nav className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => {
              setActiveTab("PISMO");
              setMobileView("EDITOR");
            }}
            className={`px-3 py-1.5 text-xs font-sans rounded-md transition-all shrink-0 ${
              activeTab === "PISMO"
                ? "bg-[#FFFFFF] text-[#172338] font-bold shadow-sm border border-[#E1E3E7]"
                : "text-[#5F6774] hover:text-[#172338]"
            }`}
          >
            Pismo procesowe
          </button>

          <button
            onClick={() => {
              setActiveTab("CHRONOLOGIA");
              setMobileView("EDITOR");
            }}
            className={`px-3 py-1.5 text-xs font-sans rounded-md transition-all shrink-0 ${
              activeTab === "CHRONOLOGIA"
                ? "bg-[#FFFFFF] text-[#172338] font-bold shadow-sm border border-[#E1E3E7]"
                : "text-[#5F6774] hover:text-[#172338]"
            }`}
          >
            Oś czasu ({timeline.length})
          </button>

          <button
            onClick={() => {
              setActiveTab("MAPA_SPORU");
              setMobileView("EDITOR");
            }}
            className={`px-3 py-1.5 text-xs font-sans rounded-md transition-all shrink-0 ${
              activeTab === "MAPA_SPORU"
                ? "bg-[#FFFFFF] text-[#172338] font-bold shadow-sm border border-[#E1E3E7]"
                : "text-[#5F6774] hover:text-[#172338]"
            }`}
          >
            Mapa zarzutów ({issues.length})
          </button>

          <button
            onClick={() => {
              setActiveTab("ANALIZA_PRZECIWNA");
              setMobileView("EDITOR");
            }}
            className={`px-3 py-1.5 text-xs font-sans rounded-md transition-all shrink-0 flex items-center gap-1 ${
              activeTab === "ANALIZA_PRZECIWNA"
                ? "bg-[#FFFFFF] text-[#172338] font-bold shadow-sm border border-[#E1E3E7]"
                : "text-[#5F6774] hover:text-[#172338]"
            }`}
          >
            <span>Analiza przeciwna</span>
            {counterArguments.length > 0 && (
              <span className="bg-[#FEF7E0] text-[#B06000] text-[10px] font-mono font-bold px-1.5 py-0.2 rounded">
                {counterArguments.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab("PRZED_PODPISEM");
              setMobileView("EDITOR");
            }}
            className={`px-3 py-1.5 text-xs font-sans rounded-md transition-all shrink-0 flex items-center gap-1 ${
              activeTab === "PRZED_PODPISEM"
                ? "bg-[#FFFFFF] text-[#172338] font-bold shadow-sm border border-[#E1E3E7]"
                : "text-[#5F6774] hover:text-[#172338]"
            }`}
          >
            <span>Audyt</span>
            {auditFindings.length > 0 && (
              <span className="bg-[#E6F4EA] text-[#137333] text-[10px] font-mono font-bold px-1.5 py-0.2 rounded">
                {auditFindings.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab("REJESTRY_I_PRAWO");
              setMobileView("EDITOR");
            }}
            className={`px-3 py-1.5 text-xs font-sans rounded-md transition-all shrink-0 flex items-center gap-1 ${
              activeTab === "REJESTRY_I_PRAWO"
                ? "bg-[#FFFFFF] text-[#172338] font-bold shadow-sm border border-[#E1E3E7]"
                : "text-[#5F6774] hover:text-[#172338]"
            }`}
          >
            <span>Prawo & AI</span>
            <span className="bg-[#EEF2FF] text-[#355CFF] text-[10px] font-mono font-bold px-1.5 py-0.2 rounded">
              ✦ Gemini
            </span>
          </button>
        </nav>
      </div>

      {/* 3. GŁÓWNY OBSZAR ROBOCZY: SPLIT SCREEN LUB PEŁNY EKRAN NA MOBILE */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden relative">
        {/* LEWA SZPALTA: Pismo procesowe i analizy (widoczna na desktopie lub gdy mobileView === 'EDITOR') */}
        <div
          className={`flex-1 overflow-y-auto overscroll-contain p-3 sm:p-6 lg:p-8 pb-36 sm:pb-16 transition-all ${
            mobileView === "EDITOR" ? "flex flex-col" : "hidden lg:flex lg:flex-col"
          } ${isDossierCollapsed ? "max-w-4xl mx-auto w-full" : ""}`}
        >
          {/* WIDOK 1: PISMO PROCESOWE (PEŁNA INGERENCJA PRAWNIKA) */}
          {activeTab === "PISMO" && (
            <div className="sheet-paper max-w-3xl mx-auto w-full p-5 sm:p-10 text-[#172338] shadow-paper bg-[#FFFFFF] rounded-xl border border-[#E1E3E7]">
              {/* Nagłówek Sądu */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 pb-4 border-b border-[#E1E3E7]">
                <div>
                  <input
                    type="text"
                    value={currentDraft.courtHeader.courtName}
                    onChange={(e) =>
                      setCurrentDraft({
                        ...currentDraft,
                        courtHeader: { ...currentDraft.courtHeader, courtName: e.target.value },
                      })
                    }
                    placeholder="Nazwa Sądu (np. Sąd Rejonowy w Warszawie)"
                    className="font-serif font-bold text-base w-full bg-transparent border-b border-dashed border-[#E1E3E7] focus:border-[#355CFF] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={currentDraft.courtHeader.department}
                    onChange={(e) =>
                      setCurrentDraft({
                        ...currentDraft,
                        courtHeader: { ...currentDraft.courtHeader, department: e.target.value },
                      })
                    }
                    placeholder="Wydział (np. I Wydział Cywilny)"
                    className="text-xs text-[#5F6774] w-full bg-transparent border-b border-dashed border-[#E1E3E7] focus:border-[#355CFF] focus:outline-none mt-1"
                  />
                  <p className="text-xs font-mono font-semibold text-[#355CFF] mt-1.5">
                    Sygn. akt: {currentDraft.courtHeader.caseNumber || matter.caseNumber}
                  </p>
                </div>
                <div className="text-right text-xs font-sans text-[#5F6774]">
                  <input
                    type="text"
                    value={`${currentDraft.courtHeader.city}, dnia ${currentDraft.courtHeader.date}`}
                    onChange={(e) => {
                      const val = e.target.value;
                      const parts = val.split(", dnia ");
                      setCurrentDraft({
                        ...currentDraft,
                        courtHeader: {
                          ...currentDraft.courtHeader,
                          city: parts[0] || currentDraft.courtHeader.city,
                          date: parts[1] || currentDraft.courtHeader.date,
                        },
                      });
                    }}
                    className="text-right bg-transparent border-b border-dashed border-[#E1E3E7] focus:border-[#355CFF] focus:outline-none"
                  />
                </div>
              </div>

              {/* Tabela Stron */}
              <div className="bg-[#FAF9F6] border border-[#E1E3E7] rounded-lg p-3 sm:p-4 text-xs space-y-2 mb-6 font-sans">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <span className="font-bold w-16 shrink-0 text-[#5F6774]">Powód:</span>
                  <input
                    type="text"
                    value={currentDraft.claimantRepresentation}
                    onChange={(e) =>
                      setCurrentDraft({ ...currentDraft, claimantRepresentation: e.target.value })
                    }
                    placeholder="Oznaczenie powoda (np. Jan Kowalski / ABC Sp. z o.o.)"
                    className="flex-1 bg-[#FFFFFF] border border-[#E1E3E7] rounded px-2.5 py-1 text-[#172338] focus:border-[#355CFF] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <span className="font-bold w-16 shrink-0 text-[#5F6774]">Pozwany:</span>
                  <input
                    type="text"
                    value={currentDraft.defendantRepresentation}
                    onChange={(e) =>
                      setCurrentDraft({ ...currentDraft, defendantRepresentation: e.target.value })
                    }
                    placeholder="Oznaczenie pozwanego i pełnomocnika"
                    className="flex-1 bg-[#FFFFFF] border border-[#E1E3E7] rounded px-2.5 py-1 text-[#172338] focus:border-[#355CFF] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <span className="font-bold w-16 shrink-0 text-[#5F6774]">W.P.S.:</span>
                  <input
                    type="text"
                    value={currentDraft.valueOfDispute}
                    onChange={(e) =>
                      setCurrentDraft({ ...currentDraft, valueOfDispute: e.target.value })
                    }
                    placeholder="Wartość przedmiotu sporu (np. 50 000,00 zł)"
                    className="font-mono bg-[#FFFFFF] border border-[#E1E3E7] rounded px-2.5 py-1 text-[#172338] focus:border-[#355CFF] focus:outline-none"
                  />
                </div>
              </div>

              {/* Tytuł Pisma */}
              <input
                type="text"
                value={currentDraft.title}
                onChange={(e) => setCurrentDraft({ ...currentDraft, title: e.target.value })}
                className="text-center font-serif font-bold text-lg sm:text-xl uppercase tracking-wider text-[#172338] mb-6 w-full bg-transparent border-b border-dashed border-[#E1E3E7] focus:border-[#355CFF] focus:outline-none"
              />

              {/* Petitum (Wnioski procesowe) */}
              <div className="space-y-3 text-sm leading-relaxed mb-8">
                <div className="flex items-center justify-between pb-1 border-b border-[#E1E3E7]">
                  <p className="font-sans font-bold text-xs text-[#5F6774] uppercase tracking-wider">
                    Wnioski procesowe (Petitum):
                  </p>
                  <button
                    onClick={() =>
                      setCurrentDraft({
                        ...currentDraft,
                        petitumPoints: [...currentDraft.petitumPoints, "Nowy wniosek procesowy;"],
                      })
                    }
                    className="text-[11px] font-mono text-[#355CFF] hover:underline"
                  >
                    + Dodaj punkt
                  </button>
                </div>

                {currentDraft.petitumPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-2 group">
                    <span className="font-mono font-bold text-[#355CFF] shrink-0 text-xs mt-1">
                      {i + 1}.
                    </span>
                    <textarea
                      value={point}
                      rows={2}
                      onChange={(e) => {
                        const next = [...currentDraft.petitumPoints];
                        next[i] = e.target.value;
                        setCurrentDraft({ ...currentDraft, petitumPoints: next });
                      }}
                      className="flex-1 text-sm bg-transparent border border-transparent hover:border-[#E1E3E7] focus:border-[#355CFF] focus:bg-[#FAF9F6] rounded p-1.5 focus:outline-none resize-y"
                    />
                    <button
                      onClick={() => {
                        const next = currentDraft.petitumPoints.filter((_, idx) => idx !== i);
                        setCurrentDraft({ ...currentDraft, petitumPoints: next });
                      }}
                      className="opacity-0 group-hover:opacity-100 text-[#D93025] text-xs p-1 hover:bg-[#FCE8E6] rounded transition-opacity"
                      title="Usuń wniosek"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Uzasadnienie (Sekcje i akapity) */}
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-1 border-b border-[#E1E3E7]">
                  <h3 className="font-serif font-bold text-base text-[#172338]">
                    Uzasadnienie
                  </h3>
                  <button
                    onClick={() =>
                      setCurrentDraft({
                        ...currentDraft,
                        sections: [
                          ...currentDraft.sections,
                          {
                            id: `sec-${Date.now()}`,
                            orderIndex: currentDraft.sections.length + 1,
                            title: `${currentDraft.sections.length + 1}. Nowy zarzut / argument`,
                            contentMarkdown: "Wprowadź treść argumentacji lub wstaw cytat z akt sprawy.",
                            citations: [],
                          },
                        ],
                      })
                    }
                    className="text-[11px] font-mono text-[#355CFF] hover:underline"
                  >
                    + Dodaj sekcję uzasadnienia
                  </button>
                </div>

                {currentDraft.sections.map((sec, secIdx) => (
                  <div key={sec.id} className="space-y-3 p-3 sm:p-4 rounded-lg bg-[#FAF9F6]/60 border border-[#E1E3E7]/80">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={sec.title}
                        onChange={(e) => {
                          const nextSecs = [...currentDraft.sections];
                          nextSecs[secIdx] = { ...sec, title: e.target.value };
                          setCurrentDraft({ ...currentDraft, sections: nextSecs });
                        }}
                        className="font-serif font-bold text-sm text-[#172338] w-full bg-transparent border-b border-dashed border-[#E1E3E7] focus:border-[#355CFF] focus:outline-none"
                      />
                      {currentDraft.sections.length > 1 && (
                        <button
                          onClick={() => {
                            const nextSecs = currentDraft.sections.filter((_, i) => i !== secIdx);
                            setCurrentDraft({ ...currentDraft, sections: nextSecs });
                          }}
                          className="text-[#8C93A0] hover:text-[#C5221F] text-xs px-1"
                          title="Usuń sekcję"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    <div className="group relative">
                      <textarea
                        value={sec.contentMarkdown}
                        rows={4}
                        onChange={(e) => {
                          const nextSecs = [...currentDraft.sections];
                          nextSecs[secIdx] = { ...sec, contentMarkdown: e.target.value };
                          setCurrentDraft({ ...currentDraft, sections: nextSecs });
                        }}
                        placeholder="Treść uzasadnienia zarzutu lub stanu faktycznego..."
                        className="w-full text-sm leading-relaxed bg-[#FFFFFF] border border-[#E1E3E7] rounded-lg p-3 text-[#172338] focus:border-[#355CFF] focus:outline-none resize-y"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Załączniki */}
              <div className="mt-8 pt-6 border-t border-[#E1E3E7]">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-sans font-bold text-xs text-[#5F6774] uppercase tracking-wider">
                    Załączniki:
                  </p>
                  <button
                    onClick={() =>
                      setCurrentDraft({
                        ...currentDraft,
                        annexes: [...currentDraft.annexes, `Załącznik nr ${currentDraft.annexes.length + 1}`],
                      })
                    }
                    className="text-[11px] font-mono text-[#355CFF] hover:underline"
                  >
                    + Dodaj załącznik
                  </button>
                </div>
                <div className="space-y-1.5">
                  {currentDraft.annexes.map((annex, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs text-[#8C93A0]">{i + 1}.</span>
                      <input
                        type="text"
                        value={annex}
                        onChange={(e) => {
                          const next = [...currentDraft.annexes];
                          next[i] = e.target.value;
                          setCurrentDraft({ ...currentDraft, annexes: next });
                        }}
                        className="flex-1 text-xs bg-transparent border-b border-dashed border-[#E1E3E7] focus:border-[#355CFF] focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* WIDOK 2: OŚ CZASU FAKTÓW (PEŁNA EDYCJA) */}
          {activeTab === "CHRONOLOGIA" && (
            <div className="max-w-4xl mx-auto w-full space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#172338]">Oś Czasu Faktów</h2>
                  <p className="text-xs text-[#5F6774]">
                    Chronologiczny wykaz zdarzeń faktycznych z powiązaniem do materiału dowodowego.
                  </p>
                </div>
                <button
                  onClick={() => setIsFactModalOpen(true)}
                  className="bg-[#172338] hover:bg-[#355CFF] text-white text-xs font-semibold px-3 py-2 rounded-md shadow-sm transition-colors"
                >
                  + Dodaj fakt
                </button>
              </div>

              {timeline.length === 0 ? (
                <div className="bg-white border border-[#E1E3E7] rounded-xl p-8 text-center space-y-3">
                  <div className="text-2xl">📅</div>
                  <h3 className="font-serif font-bold text-sm text-[#172338]">Brak wpisów w osi czasu</h3>
                  <p className="text-xs text-[#5F6774] max-w-sm mx-auto">
                    Kliknij „+ Dodaj fakt” lub zaznacz fragment w panelu akt sprawy po prawej, aby wyciągnąć zdarzenie bezpośrednio z dokumentu.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {timeline.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white border border-[#E1E3E7] rounded-xl p-4 shadow-sm hover:border-[#355CFF] transition-all"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono font-bold text-xs text-[#355CFF]">
                          {event.date}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#E1E3E7] text-[#5F6774]">
                          {event.status}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-sm text-[#172338]">
                        {event.title}
                      </h4>
                      <p className="text-sm font-sans text-[#5F6774] leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* WIDOK 3: MAPA SPORU I ZARZUTÓW */}
          {activeTab === "MAPA_SPORU" && (
            <div className="max-w-4xl mx-auto w-full space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#172338]">Mapa Sporu i Zarzutów</h2>
                  <p className="text-xs text-[#5F6774]">
                    Zestawienie zarzutów pozwanego, ich kwalifikacja prawna i podstawa dowodowa.
                  </p>
                </div>
                <button
                  onClick={() => setIsIssueModalOpen(true)}
                  className="bg-[#172338] hover:bg-[#355CFF] text-white text-xs font-semibold px-3 py-2 rounded-md shadow-sm transition-colors"
                >
                  + Nowy zarzut
                </button>
              </div>

              {issues.length === 0 ? (
                <div className="bg-white border border-[#E1E3E7] rounded-xl p-8 text-center space-y-3">
                  <div className="text-2xl">⚖️</div>
                  <h3 className="font-serif font-bold text-sm text-[#172338]">Brak zdefiniowanych zarzutów</h3>
                  <p className="text-xs text-[#5F6774] max-w-sm mx-auto">
                    Dodaj własny zarzut lub zaznacz fragment w aktach sprawy, aby utworzyć zarzut na podstawie umowy, protokołu lub korespondencji.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {issues.map((issue) => (
                    <div
                      key={issue.id}
                      className="bg-white border border-[#E1E3E7] rounded-xl p-5 shadow-sm space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif font-bold text-sm text-[#172338]">
                          {issue.title}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EEF2FF] text-[#355CFF] font-bold">
                          {issue.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#172338] leading-relaxed">
                        <strong>Stanowisko pozwanego:</strong> {issue.defendantPosition}
                      </p>
                      {issue.claimantPosition && (
                        <p className="text-xs text-[#5F6774] leading-relaxed">
                          <strong>Twierdzenie powoda:</strong> {issue.claimantPosition}
                        </p>
                      )}
                      {issue.supportingProof && (
                        <p className="text-xs text-[#137333] font-mono">
                          ✓ Dowód: {issue.supportingProof}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* WIDOK 4: ANALIZA PRZECIWNA */}
          {activeTab === "ANALIZA_PRZECIWNA" && (
            <div className="max-w-4xl mx-auto w-full space-y-4">
              <h2 className="text-xl font-serif font-bold text-[#172338]">Symulacja Riposty Przeciwnika</h2>
              <p className="text-xs text-[#5F6774]">
                Ocena słabych punktów linii obrony i przewidywane riposty powoda.
              </p>
              <div className="bg-white border border-[#E1E3E7] rounded-xl p-6 space-y-3">
                <p className="text-xs font-mono text-[#B06000] font-bold uppercase">
                  Weryfikacja adversarialna linii obrony
                </p>
                <p className="text-sm leading-relaxed text-[#172338]">
                  System weryfikuje argumentację pod kątem potencjalnej odpowiedzi powoda na podstawie wgranych akt sprawy.
                </p>
              </div>
            </div>
          )}

          {/* WIDOK 5: PRZED PODPISEM */}
          {activeTab === "PRZED_PODPISEM" && (
            <div className="max-w-4xl mx-auto w-full space-y-4">
              <h2 className="text-xl font-serif font-bold text-[#172338]">Audyt Przed Podpisem</h2>
              <p className="text-xs text-[#5F6774]">
                Kontrola formalna, wymogi art. 126 i 128 K.p.c., odpisy, pełnomocnictwa i opłaty.
              </p>
              <div className="bg-white border border-[#E1E3E7] rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-[#137333]">
                  <span>✓</span>
                  <span className="text-sm font-semibold">Kompletność formalna pism</span>
                </div>
                <p className="text-xs text-[#5F6774] leading-relaxed">
                  Pismo zawiera oznaczenie sądu, sygnatury, stron, wartość przedmiotu sporu oraz wnioski procesowe.
                </p>
              </div>
            </div>
          )}

          {/* WIDOK 6: REJESTRY, PRAWO & GEMINI AI */}
          {activeTab === "REJESTRY_I_PRAWO" && (
            <div className="max-w-4xl mx-auto w-full space-y-6">
              <LegalResearchPanel />
            </div>
          )}
        </div>

        {/* PRAWA SZPALTA: CZYTNIK AKT SPRAWY I WYCIĄGANIE WNIOSKÓW Z FRAGMENTÓW */}
        <aside
          className={`w-full lg:w-[420px] xl:w-[480px] bg-[#FFFFFF] border-l border-[#E1E3E7] flex flex-col shrink-0 shadow-paper transition-all ${
            mobileView === "DOSSIER" ? "flex flex-col flex-1" : "hidden lg:flex"
          } ${isDossierCollapsed ? "lg:hidden" : ""}`}
        >
          {/* Wybór Załącznika z Akt */}
          <div className="p-3 sm:p-4 border-b border-[#E1E3E7] bg-[#FAF9F6]">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-mono uppercase text-[#5F6774] font-bold">
                Akta sprawy ({documents.length}):
              </label>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="text-[11px] font-mono text-[#355CFF] hover:underline font-bold"
              >
                + Wgraj dokument
              </button>
            </div>

            {documents.length > 0 ? (
              <select
                value={selectedDocId}
                onChange={(e) => {
                  setSelectedDocId(e.target.value);
                  setActiveChunkId(null);
                  setSelectedChunkSnippet(null);
                }}
                className="w-full text-xs font-sans bg-[#FFFFFF] border border-[#E1E3E7] rounded px-3 py-2 text-[#172338] focus:outline-none focus:ring-1 focus:ring-[#355CFF]"
              >
                {documents.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.fileName} ({doc.pageCount} str.)
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-xs text-[#8C93A0] italic py-1">
                Brak wgranych dokumentów. Wgraj pozew lub umowę powyżej.
              </div>
            )}
          </div>

          {/* PASEK WYCIĄGANIA WNIOSKÓW (GDY WYBRANO FRAGMENT) */}
          {selectedChunkSnippet && (
            <div className="p-3 bg-[#EEF2FF] border-b border-[#C7D2FE] space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="font-bold text-[#355CFF]">Wybrany fragment dowodowy:</span>
                <button
                  onClick={() => setSelectedChunkSnippet(null)}
                  className="text-[#8C93A0] hover:text-[#172338]"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs font-serif italic text-[#172338] line-clamp-2">
                „{selectedChunkSnippet.text}”
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  onClick={handleInsertChunkAsCitation}
                  className="text-[11px] font-sans font-semibold bg-[#355CFF] text-white px-2 py-1 rounded shadow-sm hover:bg-[#2849D9]"
                >
                  📌 Wstaw jako dowód
                </button>
                <button
                  onClick={handleCreateIssueFromChunk}
                  className="text-[11px] font-sans font-semibold bg-[#FFFFFF] text-[#172338] border border-[#E1E3E7] px-2 py-1 rounded hover:bg-[#FAF9F6]"
                >
                  ⚖️ Utwórz zarzut
                </button>
                <button
                  onClick={handleAddFactFromChunk}
                  className="text-[11px] font-sans font-semibold bg-[#FFFFFF] text-[#172338] border border-[#E1E3E7] px-2 py-1 rounded hover:bg-[#FAF9F6]"
                >
                  📅 Dodaj fakt
                </button>
                <button
                  onClick={handleAiAnalyzeChunk}
                  disabled={aiInsightLoading}
                  className="text-[11px] font-sans font-semibold bg-[#2E7D32] text-white px-2 py-1 rounded hover:bg-[#1B5E20]"
                >
                  {aiInsightLoading ? "✦ AI bada..." : "✦ AI Wniosek"}
                </button>
              </div>

              {aiInsightResult && (
                <div className="mt-2 p-2 bg-white rounded border border-[#A5D6A7] text-xs text-[#172338] space-y-1">
                  <span className="font-mono text-[10px] text-[#2E7D32] font-bold block">
                    ✦ Sugestia procesowa Gemini:
                  </span>
                  <p className="leading-relaxed">{aiInsightResult}</p>
                </div>
              )}
            </div>
          )}

          {/* LISTA AKAPITÓW / KART DOKUMENTU */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4 pb-36 sm:pb-16 space-y-3 bg-[#F6F5F1]/40">
            {activeDoc && activeDoc.chunks.length > 0 ? (
              activeDoc.chunks.map((chunk: DocumentChunk) => {
                const isSelected = selectedChunkSnippet?.chunkId === chunk.id;
                return (
                  <div
                    key={chunk.id}
                    onClick={() =>
                      setSelectedChunkSnippet({
                        text: chunk.text,
                        chunkId: chunk.id,
                        docTitle: activeDoc.fileName,
                        page: chunk.pageNumber,
                      })
                    }
                    className={`p-3.5 rounded-lg border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#FEF7E0] border-[#B06000] shadow-sm ring-1 ring-[#B06000]"
                        : "bg-[#FFFFFF] border-[#E1E3E7] hover:border-[#355CFF]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-[#E1E3E7]/60">
                      <span className="font-mono font-bold text-[#172338]">
                        Karta {chunk.pageNumber} • Ustęp {chunk.paragraphIndex}
                      </span>
                      <span className="text-[10px] font-mono text-[#355CFF]">
                        Kliknij, by użyć ↗
                      </span>
                    </div>
                    <p className="font-sans leading-relaxed text-[#172338]">
                      {chunk.text}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center space-y-3">
                <div className="text-3xl">📄</div>
                <h4 className="font-serif font-bold text-sm text-[#172338]">Akta są puste</h4>
                <p className="text-xs text-[#5F6774] leading-relaxed">
                  Wgraj plik PDF/DOCX lub wklej treść pozwu, umowy albo faktury, aby rozpocząć analizę dowodową.
                </p>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="bg-[#172338] hover:bg-[#355CFF] text-white text-xs font-semibold px-4 py-2 rounded-md shadow-sm transition-colors"
                >
                  + Wgraj pierwszy dokument
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* MODAL: WGRYWANIE / WKLEJANIE DOKUMENTU */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#172338]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-[#E1E3E7] max-w-xl w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-[#E1E3E7]">
              <h3 className="font-serif font-bold text-lg text-[#172338]">
                Wgraj dokument do akt sprawy
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-[#8C93A0] hover:text-[#172338] text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono text-[#5F6774] font-bold block mb-1">
                  Wybierz plik z dysku (PDF, DOCX, TXT):
                </label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="w-full text-xs font-sans border border-[#E1E3E7] rounded-lg p-2 bg-[#FAF9F6]"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#5F6774] font-bold block mb-1">
                  Nazwa dokumentu w aktach:
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="np. Pozew z dn. 10.08.2026 r. / Umowa o roboty budowlane"
                  className="w-full text-xs font-sans border border-[#E1E3E7] rounded-lg p-2.5 focus:border-[#355CFF] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#5F6774] font-bold block mb-1">
                  Treść dokumentu (wklej lub załaduj z pliku):
                </label>
                <textarea
                  rows={8}
                  value={uploadText}
                  onChange={(e) => setUploadText(e.target.value)}
                  placeholder="Wklej tutaj treść pozwu, umowy, protokołu odbioru, faktury lub wezwania do zapłaty..."
                  className="w-full text-xs font-sans border border-[#E1E3E7] rounded-lg p-2.5 focus:border-[#355CFF] focus:outline-none resize-y"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E1E3E7]">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-[#5F6774] hover:text-[#172338]"
              >
                Anuluj
              </button>
              <button
                onClick={handleSaveUploadedDocument}
                className="px-5 py-2 text-xs font-semibold bg-[#172338] hover:bg-[#355CFF] text-white rounded-lg shadow-sm transition-colors"
              >
                Dodaj do akt sprawy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DODAWANIE FAKTU DO OSI CZASU */}
      {isFactModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#172338]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-[#E1E3E7] max-w-md w-full p-6 space-y-4">
            <h3 className="font-serif font-bold text-base text-[#172338]">
              Dodaj fakt do osi czasu
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono text-[#5F6774] block mb-1">Data zdarzenia:</label>
                <input
                  type="date"
                  value={factDate}
                  onChange={(e) => setFactDate(e.target.value)}
                  className="w-full text-xs border border-[#E1E3E7] rounded p-2 focus:outline-none focus:border-[#355CFF]"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-[#5F6774] block mb-1">Opis faktu:</label>
                <textarea
                  rows={3}
                  value={factDescription}
                  onChange={(e) => setFactDescription(e.target.value)}
                  placeholder="Opisz zdarzenie istotne dla sprawy..."
                  className="w-full text-xs border border-[#E1E3E7] rounded p-2 focus:outline-none focus:border-[#355CFF]"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-[#5F6774] block mb-1">Źródło dowodowe:</label>
                <input
                  type="text"
                  value={factProofSource}
                  onChange={(e) => setFactProofSource(e.target.value)}
                  placeholder="np. Protokół odbioru, k. 2"
                  className="w-full text-xs border border-[#E1E3E7] rounded p-2 focus:outline-none focus:border-[#355CFF]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#E1E3E7]">
              <button
                onClick={() => setIsFactModalOpen(false)}
                className="px-3 py-1.5 text-xs text-[#5F6774]"
              >
                Anuluj
              </button>
              <button
                onClick={() => {
                  if (!factDescription) return;
                  setTimeline((prev) => [
                    ...prev,
                    {
                      id: `fact-${Date.now()}`,
                      date: factDate || new Date().toISOString().split("T")[0],
                      isDateCertain: true,
                      title: factDescription.slice(0, 50),
                      description: factDescription,
                      status: "DOCUMENT_CONTENT",
                      sourceDocumentTitle: factProofSource || undefined,
                    },
                  ]);
                  setIsFactModalOpen(false);
                  setFactDate("");
                  setFactDescription("");
                  setFactProofSource("");
                  setActiveTab("CHRONOLOGIA");
                  setMobileView("EDITOR");
                }}
                className="px-4 py-1.5 text-xs font-semibold bg-[#172338] text-white rounded hover:bg-[#355CFF]"
              >
                Zapisz fakt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DODAWANIE ZARZUTU */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#172338]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-[#E1E3E7] max-w-lg w-full p-6 space-y-4">
            <h3 className="font-serif font-bold text-base text-[#172338]">
              Utwórz zarzut procesowy
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono text-[#5F6774] block mb-1">Nazwa zarzutu:</label>
                <input
                  type="text"
                  value={issueTitle}
                  onChange={(e) => setIssueTitle(e.target.value)}
                  placeholder="np. Zarzut przedawnienia / Zarzut braku odbioru"
                  className="w-full text-xs border border-[#E1E3E7] rounded p-2 focus:outline-none focus:border-[#355CFF]"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-[#5F6774] block mb-1">Podstawa prawna:</label>
                <input
                  type="text"
                  value={issueLegalBasis}
                  onChange={(e) => setIssueLegalBasis(e.target.value)}
                  placeholder="np. art. 118 K.c. / art. 647 K.c. / art. 498 K.c."
                  className="w-full text-xs border border-[#E1E3E7] rounded p-2 focus:outline-none focus:border-[#355CFF]"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-[#5F6774] block mb-1">Argumentacja prawna:</label>
                <textarea
                  rows={4}
                  value={issueArgument}
                  onChange={(e) => setIssueArgument(e.target.value)}
                  placeholder="Wyjaśnij dlaczego roszczenie powoda nie zasługuje na uwzględnienie..."
                  className="w-full text-xs border border-[#E1E3E7] rounded p-2 focus:outline-none focus:border-[#355CFF]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#E1E3E7]">
              <button
                onClick={() => setIsIssueModalOpen(false)}
                className="px-3 py-1.5 text-xs text-[#5F6774]"
              >
                Anuluj
              </button>
              <button
                onClick={() => {
                  if (!issueTitle) return;
                  setIssues((prev) => [
                    ...prev,
                    {
                      id: `issue-${Date.now()}`,
                      title: issueTitle,
                      category: "MATERIALNY",
                      claimantPosition: "Roszczenie dochodzone w pozwie",
                      defendantPosition: issueArgument,
                      supportingProof: issueLegalBasis || "Akta sprawy",
                      adversaryCounterProof: "Brak dowodu przeciwnego w pozwie",
                      lawyerDecision: "PODNIESC",
                    },
                  ]);
                  setIsIssueModalOpen(false);
                  setIssueTitle("");
                  setIssueLegalBasis("");
                  setIssueArgument("");
                  setActiveTab("MAPA_SPORU");
                  setMobileView("EDITOR");
                }}
                className="px-4 py-1.5 text-xs font-semibold bg-[#172338] text-white rounded hover:bg-[#355CFF]"
              >
                Zapisz zarzut
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
