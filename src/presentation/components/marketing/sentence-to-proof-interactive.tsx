"use client";

import React, { useState } from "react";

interface InteractiveCitation {
  id: string;
  sentenceText: string;
  category: string;
  docTitle: string;
  pageNumber: number;
  quotedText: string;
  relation: "WSPIERA" | "PRZECZY" | "KONTEKST";
  relationDesc: string;
}

const DEMO_CITATIONS: InteractiveCitation[] = [
  {
    id: "cit-1",
    sentenceText:
      "Z ostrożności procesowej podnoszę zarzut braku wymagalności roszczenia powoda z uwagi na niewykonanie warunku umownego w postaci bezusterkowego protokołu odbioru (§ 4 ust. 3 Umowy).",
    category: "Zarzut procesowy",
    docTitle: "Umowa o roboty budowlane nr 12/2025",
    pageNumber: 5,
    quotedText:
      "§ 4 ust. 3: Podstawą wystawienia faktury końcowej za dany etap robót jest podpisany przez obie strony bezusterkowy protokół odbioru częściowego. W przypadku stwierdzenia wad istotnych Zamawiający jest uprawniony do odmowy odbioru.",
    relation: "WSPIERA",
    relationDesc: "Dosłowny zapis kontraktowy uzależniający wymagalność zapłaty od bezusterkowości odbioru.",
  },
  {
    id: "cit-2",
    sentenceText:
      "W toku czynności odbiorowych w dniu 30 listopada 2025 r. ujawniono wady istotne w postaci spękań płyty stropowej osi A-D przekraczających dopuszczalną rozwartość 0,4 mm.",
    category: "Stan faktyczny",
    docTitle: "Protokół odbioru częściowego z dn. 30.11.2025 r.",
    pageNumber: 2,
    quotedText:
      "Komisja stwierdza następujące wady istotne konstrukcji: pęknięcia skurczowe płyty stropowej osi A-D o rozwartości powyżej 0,4 mm oraz odchylenie pionu słupów żelbetowych przekraczające normę PN-EN 13670. Odmówiono odbioru.",
    relation: "WSPIERA",
    relationDesc: "Dowód z dokumentu podpisany przez inspektora nadzoru potwierdzający istnienie wad i odmowę odbioru.",
  },
  {
    id: "cit-3",
    sentenceText:
      "Powód w treści pozwu dochodzi kwoty 147 600,00 zł, zatajając przed Sądem fakt wystawienia faktury korygującej nr FK/2025/12/01 obniżającej należność o 49 200,00 zł brutto.",
    category: "Rozliczenie kwot",
    docTitle: "Faktura Korygująca nr FK/2025/12/01",
    pageNumber: 1,
    quotedText:
      "Faktura Korygująca nr FK/2025/12/01 z dnia 18.12.2025 r. Przyczyna korekty: Niewykonanie części robót zbrojarskich. Zmniejszenie kwoty o 49 200,00 zł brutto. Kwota po korekcie: 98 400,00 zł.",
    relation: "WSPIERA",
    relationDesc: "Dowód na bezpośrednią rozbieżność rachunkową pomiędzy żądaniem pozwu a stanem księgowym powoda.",
  },
];

export function SentenceToProofInteractive() {
  const [selectedId, setSelectedId] = useState<string>("cit-1");
  const active = DEMO_CITATIONS.find((c) => c.id === selectedId) || DEMO_CITATIONS[0];

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#E1E3E7] rounded-xl shadow-paper overflow-hidden">
      {/* Header Bar */}
      <div className="bg-[#FAF9F6] border-b border-[#E1E3E7] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#355CFF]"></span>
          <span className="text-xs font-mono font-semibold uppercase text-[#172338] tracking-wider">
            Interakcja Marki: Od Zdania do Dowodu
          </span>
        </div>
        <span className="text-xs font-sans text-[#5F6774] hidden sm:inline">
          Kliknij wybrane zdanie w projekcie pisma, aby przejść do karty akt
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
        {/* LEWA SZPALTA: Projekt Pisma */}
        <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-[#E1E3E7] bg-[#FFFFFF]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-[#5F6774]">PROJEKT ODPOWIEDZI NA POZEW (K.p.c.)</span>
            <span className="text-xs font-mono text-[#355CFF]">Sygn. akt XVI GC 1420/26</span>
          </div>

          <div className="space-y-3 font-serif text-[15px] leading-relaxed text-[#172338]">
            <p className="text-sm font-sans font-medium text-[#5F6774] not-italic mb-2">
              Fragment uzasadnienia zarzutów pozwanej spółki:
            </p>

            {DEMO_CITATIONS.map((cit, idx) => {
              const isSelected = cit.id === selectedId;
              return (
                <div
                  key={cit.id}
                  onClick={() => setSelectedId(cit.id)}
                  className={`p-3.5 rounded-lg transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-[#EEF2FF] border-[#355CFF] shadow-sm"
                      : "bg-[#FAF9F6]/50 border-transparent hover:bg-[#F6F5F1] hover:border-[#E1E3E7]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#5F6774]">
                      {idx + 1}. {cit.category}
                    </span>
                    <span
                      className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded ${
                        isSelected
                          ? "bg-[#355CFF] text-[#FFFFFF]"
                          : "bg-[#E1E3E7] text-[#5F6774]"
                      }`}
                    >
                      {cit.docTitle.split(" ")[0]} • str. {cit.pageNumber} ↗
                    </span>
                  </div>
                  <p className="text-[#172338]">
                    „{cit.sentenceText}”
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* PRAWA SZPALTA: Wgląd w Akta i Zaznaczony Dowód */}
        <div className="lg:col-span-5 p-6 bg-[#F6F5F1]/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E1E3E7]">
              <span className="text-xs font-mono text-[#5F6774]">PODGLĄD DOWODU Z AKT</span>
              <span className="text-xs font-sans font-semibold text-[#137333] bg-[#E6F4EA] px-2 py-0.5 rounded border border-[#C6ECCB]">
                ✓ Zweryfikowane źródło
              </span>
            </div>

            {/* Karta dokumentu */}
            <div className="bg-[#FFFFFF] border border-[#E1E3E7] rounded-lg p-5 shadow-sm mb-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h4 className="font-sans font-semibold text-sm text-[#172338]">
                    {active.docTitle}
                  </h4>
                  <p className="text-xs font-mono text-[#5F6774]">
                    Załącznik nr {active.id === "cit-1" ? "1" : active.id === "cit-2" ? "2" : "3"} • Karta akt {active.pageNumber}
                  </p>
                </div>
                <span className="bg-[#EEF2FF] text-[#355CFF] text-xs font-mono font-semibold px-2 py-1 rounded">
                  Relacja: {active.relation}
                </span>
              </div>

              {/* Fragment wyodrębniony */}
              <div className="p-3.5 bg-[#FEF7E0] border-l-4 border-[#B06000] rounded-r text-sm font-sans text-[#172338] leading-relaxed my-3">
                <p className="text-xs font-mono uppercase tracking-wider text-[#B06000] font-bold mb-1">
                  ODCZYTANY FRAGMENT ŹRÓDŁOWY:
                </p>
                „{active.quotedText}”
              </div>

              <p className="text-xs text-[#5F6774] leading-relaxed font-sans">
                <strong className="text-[#172338]">Ocena systemowa:</strong> {active.relationDesc}
              </p>
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E1E3E7] p-3 rounded-lg flex items-center justify-between text-xs text-[#5F6774] font-mono">
            <span>Identyfikator: {active.id}</span>
            <span className="text-[#355CFF] font-medium">Brak halucynacji • 100% odczyt</span>
          </div>
        </div>
      </div>
    </div>
  );
}
