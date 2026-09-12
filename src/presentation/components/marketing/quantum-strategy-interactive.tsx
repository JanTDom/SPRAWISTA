"use client";

import React, { useState } from "react";

export function QuantumStrategyInteractive() {
  const [activeTab, setActiveTab] = useState<"standard_ai" | "quantum_engine">("quantum_engine");

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#E1E3E7] rounded-2xl shadow-paper-elevated overflow-hidden">
      {/* Top Header Bar */}
      <div className="px-6 py-4 border-b border-[#E1E3E7] bg-[#FAF9F6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#355CFF] font-semibold block">
            Porównanie technologii w procesie cywilnym
          </span>
          <h3 className="font-serif font-bold text-lg text-[#172338]">
            Sprawa o zapłatę za roboty budowlane (WPS: 147 600,00 zł)
          </h3>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex p-1 rounded-lg bg-[#EAE8E3] border border-[#D9D6CE]" role="tablist" aria-label="Wybór metody analizy">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "standard_ai"}
            onClick={() => setActiveTab("standard_ai")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-mono transition-all duration-150 ${
              activeTab === "standard_ai"
                ? "bg-[#FFFFFF] text-[#C5221F] font-bold shadow-sm"
                : "text-[#5F6774] hover:text-[#172338]"
            }`}
          >
            Zwykłe LLM (ChatGPT / Copilot)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "quantum_engine"}
            onClick={() => setActiveTab("quantum_engine")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-mono transition-all duration-150 ${
              activeTab === "quantum_engine"
                ? "bg-[#172338] text-[#FFFFFF] font-bold shadow-sm"
                : "text-[#5F6774] hover:text-[#172338]"
            }`}
          >
            ⚛️ Sprawista + YourQuantum™
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 lg:p-8">
        {activeTab === "standard_ai" ? (
          <div className="space-y-6">
            {/* Warning Banner */}
            <div className="p-4 rounded-xl bg-[#FCE8E6] border border-[#F5C2C7] flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-full bg-[#C5221F] text-[#FFFFFF] flex items-center justify-center flex-shrink-0 font-mono font-bold text-sm">
                ✕
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-[#C5221F]">
                  Wykryto kolizję procesową: Zgadywanie słów bez weryfikacji niesprzeczności
                </p>
                <p className="text-xs text-[#5F6774] leading-relaxed">
                  Zwykłe LLM generują tekst na podstawie statystycznej korelacji słów. Model wrzucił wszystkie znalezione zarzuty do jednego pisma bez hierarchii procesowej. Sąd uzna bezwarunkowe potrącenie za dorozumiane uznanie długu powoda.
                </p>
              </div>
            </div>

            {/* Simulated LLM Output */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 bg-[#FAF9F6] border border-[#E1E3E7] rounded-xl p-5 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#E1E3E7] text-[11px] text-[#5F6774]">
                  <span>WYGENEROWANY TEKST ZE ZWYKŁEGO LLM</span>
                  <span className="text-[#C5221F] font-bold">TEMPERATURA 0.7 (LOSOWOŚĆ)</span>
                </div>
                <div className="space-y-2.5 text-[#172338] leading-relaxed font-serif text-sm">
                  <div className="bg-[#FCE8E6]/60 p-2.5 rounded border border-[#F5C2C7]">
                    <strong className="text-[#C5221F] block text-xs font-mono uppercase mb-1">Zarzut 1: Brak stosunku umownego</strong>
                    „W pierwszej kolejności pozwany podnosi, że umowa o roboty budowlane z dnia 15.02.2025 r. jest bezwzględnie nieważna i roszczenie w ogóle nie istnieje...”
                  </div>
                  <div className="bg-[#FCE8E6]/60 p-2.5 rounded border border-[#F5C2C7]">
                    <strong className="text-[#C5221F] block text-xs font-mono uppercase mb-1">Zarzut 2: Potrącenie z tej samej umowy (Art. 498 K.c.)</strong>
                    „Jednocześnie pozwany oświadcza, że potrąca z roszczenia powoda swoją wierzytelność w kwocie 49 200,00 zł wynikającą z nienależytego wykonania tej umowy...”
                  </div>
                </div>
              </div>

              {/* Consequence Analysis */}
              <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E1E3E7] rounded-xl p-5 space-y-4">
                <span className="text-xs font-mono uppercase tracking-wider text-[#5F6774] font-semibold block">
                  Analiza skutków procesowych
                </span>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-[#FAF9F6] rounded-lg border border-[#E1E3E7]">
                    <span className="font-bold text-[#C5221F] block mb-1">Dorozumiane uznanie roszczenia</span>
                    <p className="text-[#5F6774] leading-relaxed">
                      Złożenie oświadczenia o potrąceniu bez zastrzeżenia ewentualności niweczy zarzut nieistnienia umowy (utrwalona linia SN, m.in. II CSK 444/18).
                    </p>
                  </div>

                  <div className="p-3 bg-[#FAF9F6] rounded-lg border border-[#E1E3E7]">
                    <span className="font-bold text-[#C5221F] block mb-1">Prekluzja z art. 458[5] K.p.c.</span>
                    <p className="text-[#5F6774] leading-relaxed">
                      Próba sprostowania tego błędu na późniejszym etapie zostanie odrzucona przez sąd gospodarczy jako spóźniona.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#E1E3E7] flex items-center justify-between text-xs font-mono">
                    <span className="text-[#5F6774]">Odporność procesowa:</span>
                    <span className="text-[#C5221F] font-bold">34% (Krytyczna usterka)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Success Banner */}
            <div className="p-4 rounded-xl bg-[#E6F4EA] border border-[#A8DAB5] flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-full bg-[#137333] text-[#FFFFFF] flex items-center justify-center flex-shrink-0 font-mono font-bold text-sm">
                ✓
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-sm font-bold text-[#137333]">
                    Koalicja zarzutów matematycznie niesprzeczna (Model QUBO / Benders)
                  </p>
                  <span className="px-2 py-0.5 rounded bg-[#FFFFFF] border border-[#A8DAB5] text-[11px] font-mono text-[#137333] font-semibold">
                    Czas obliczeń: 128 ms
                  </span>
                </div>
                <p className="text-xs text-[#5F6774] leading-relaxed">
                  Silnik YourQuantum zbadał macierz kolizji K.p.c. i K.c., odseparował zarzuty główne od ewentualnych oraz odrzucił zarzuty destrukcyjne dla linii obrony. Wynik jest deterministyczny i certyfikowany hashem SHA-256.
                </p>
              </div>
            </div>

            {/* Quantum Hierarchy View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Defense Hierarchy Matrix */}
              <div className="lg:col-span-8 space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-[#172338] font-semibold block">
                  Matematycznie wyznaczona struktura odpowiedzi na pozew
                </span>

                {/* Poziom 1: Główne */}
                <div className="p-4 rounded-xl bg-[#FAF9F6] border-2 border-[#137333]/30 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E6F4EA] text-[#137333] text-xs font-mono font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#137333]"></span>
                      POZIOM GŁÓWNY — ŻĄDANIE ODDALENIA W CAŁOŚCI
                    </span>
                    <span className="text-[11px] font-mono text-[#5F6774]">Maksymalna siła dowodowa</span>
                  </div>
                  <div className="space-y-2 mt-3">
                    <div className="bg-[#FFFFFF] p-3 rounded-lg border border-[#E1E3E7] text-xs space-y-1">
                      <p className="font-bold text-[#172338]">1. Zarzut braku wymagalności (Art. 654 K.c. w zw. z § 4 ust. 3 Umowy)</p>
                      <p className="text-[#5F6774]">Powiązanie: Brak podpisanego bezusterkowego protokołu odbioru. Wydatek zablokowany kontraktowo.</p>
                    </div>
                    <div className="bg-[#FFFFFF] p-3 rounded-lg border border-[#E1E3E7] text-xs space-y-1">
                      <p className="font-bold text-[#172338]">2. Zarzut wad istotnych dzieła (Norma PN-EN 13670)</p>
                      <p className="text-[#5F6774]">Powiązanie: Wpis w dzienniku budowy i protokół techniczny potwierdzający spękania konstrukcyjne.</p>
                    </div>
                  </div>
                </div>

                {/* Poziom 2: Ewentualne */}
                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#355CFF]/30 relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E8EEFF] text-[#355CFF] text-xs font-mono font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#355CFF]"></span>
                      POZIOM EWENTUALNY — Z OSTROŻNOŚCI PROCESOWEJ
                    </span>
                    <span className="text-[11px] font-mono text-[#355CFF]">Art. 498 K.c. zabezpieczony</span>
                  </div>
                  <div className="bg-[#FFFFFF] p-3 rounded-lg border border-[#E1E3E7] text-xs space-y-1 mt-2">
                    <p className="font-bold text-[#172338]">3. Ewentualny zarzut potrącenia kwoty 49 200,00 zł</p>
                    <p className="text-[#5F6774]">
                      Sformułowany <em>„wyłącznie na wypadek nieuwzględnienia przez Sąd zarzutu braku wymagalności”</em>. Chroni przed uznaniem długu.
                    </p>
                  </div>
                </div>

                {/* Poziom 3: Odradzane */}
                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E1E3E7] opacity-80">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#F1F3F4] text-[#5F6774] text-[11px] font-mono font-semibold">
                      ODRADZANE PRZEZ SOLVER (WYKLUCZENIE MATEMATYCZNE)
                    </span>
                    <span className="text-[11px] font-mono text-[#C5221F]">Zneutralizowane ryzyko</span>
                  </div>
                  <p className="text-xs text-[#5F6774] mt-2">
                    Zarzut pozorności umowy wykluczony ze względu na kolizję z zarzutem wad dzieła w macierzy QUBO.
                  </p>
                </div>
              </div>

              {/* Quantum Passport & Metrics */}
              <div className="lg:col-span-4 bg-[#FAF9F6] border border-[#E1E3E7] rounded-xl p-5 space-y-5">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#5F6774] font-semibold block mb-2">
                    Wskaźnik Odporności Linii Obrony
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-serif font-bold text-[#137333]">96%</span>
                    <span className="text-xs font-mono text-[#137333] font-semibold">BARDZO WYSOKA</span>
                  </div>
                  <div className="w-full h-2 bg-[#E1E3E7] rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-[#137333] rounded-full" style={{ width: "96%" }}></div>
                  </div>
                  <p className="text-[11px] text-[#5F6774] mt-1.5">
                    Wyliczone z gęstości dowodów i braku wektorów kolizji K.p.c.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E1E3E7] space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#5F6774]">Solver:</span>
                    <span className="text-[#172338] font-bold">YourQuantum Hybrid</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5F6774]">Model:</span>
                    <span className="text-[#172338]">QUBO / Benders Cut</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5F6774]">Prekluzja K.p.c.:</span>
                    <span className="text-[#137333] font-bold">Zabezpieczona</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E1E3E7] space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-[#5F6774] block tracking-wider">
                    Paszport kryptograficzny SHA-256
                  </span>
                  <div className="p-2 bg-[#FFFFFF] border border-[#E1E3E7] rounded text-[10px] font-mono text-[#172338] break-all select-all">
                    e7f2b904c81a29d40b6e983f478a05c123df612809e4a3b7d18c991a045838a1
                  </div>
                  <span className="text-[10px] text-[#5F6774] block">
                    Gwarantuje 100% determinizmu i powtarzalności dla sądu.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Technical Note */}
      <div className="px-6 py-3 bg-[#FAF9F6] border-t border-[#E1E3E7] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#5F6774] gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#137333]"></span>
          <span>Integracja produkcyjna: <strong>YourQuantum Compute API v1</strong></span>
        </div>
        <div className="font-mono text-[11px]">
          Prawnik decyduje • Algorytm gwarantuje brak sprzeczności
        </div>
      </div>
    </div>
  );
}
