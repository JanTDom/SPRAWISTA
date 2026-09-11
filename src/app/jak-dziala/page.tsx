import Link from "next/link";
import { SiteHeader } from "@/presentation/components/navigation/site-header";
import { SiteFooter } from "@/presentation/components/navigation/site-footer";

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F6F5F1]">
      <SiteHeader />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#355CFF] font-semibold">
              Metodologia i Technologia
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#172338] mt-2 mb-4">
              Jak działa Sprawista?
            </h1>
            <p className="text-lg text-[#5F6774] leading-relaxed">
              Zamiast pojedynczego promptu – kontrolowany, wieloetapowy proces inżynieryjny oparty na przepisach polskiego Kodeksu postępowania cywilnego.
            </p>
          </div>

          <div className="space-y-12">
            {/* Krok 1 */}
            <div className="bg-[#FFFFFF] border border-[#E1E3E7] rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-7 rounded-full bg-[#172338] text-[#FFFFFF] text-xs font-mono font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="text-2xl font-serif font-bold text-[#172338]">
                  Bezpieczne przyjmowanie akt i selektywny OCR
                </h2>
              </div>
              <p className="text-sm text-[#5F6774] leading-relaxed mb-4">
                Wgrywasz akta sprawy (PDF, skany, korespondencję e-mail). System analizuje każdą stronę pod kątem jakości cyfrowej warstwy tekstowej.
                Dla stron z tekstem cyfrowym wykonuje bezpośrednią ekstrakcję, a dla skanów uruchamia selektywny OCR zoptymalizowany pod język polski.
              </p>
              <div className="bg-[#FAF9F6] border border-[#E1E3E7] p-4 rounded-lg text-xs font-mono text-[#172338]">
                <strong>Raport Kompletności:</strong> Liczba stron, pewność odczytu i wykaz stron wymagających weryfikacji ręcznej (np. odręczne podpisy).
              </div>
            </div>

            {/* Krok 2 */}
            <div className="bg-[#FFFFFF] border border-[#E1E3E7] rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-7 rounded-full bg-[#355CFF] text-[#FFFFFF] text-xs font-mono font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="text-2xl font-serif font-bold text-[#172338]">
                  Podział ontologiczny: twierdzenie vs dowód
                </h2>
              </div>
              <p className="text-sm text-[#5F6774] leading-relaxed mb-4">
                Kluczowa zasada rzetelności procesowej: twierdzenie powoda z pozwu NIE staje się automatycznie faktem.
                System przypisuje każdemu elementowi jeden z 7 statusów ontologicznych (twierdzenie powoda, twierdzenie klienta, treść dokumentu, ustalenie robocze itd.).
              </p>
              <div className="bg-[#FAF9F6] border border-[#E1E3E7] p-4 rounded-lg text-xs font-mono text-[#172338]">
                <strong>Rygor prekluzji dowodowej:</strong> W sprawach gospodarczych system egzekwuje art. 458[5] K.p.c., weryfikując czy wszystkie fakty i dowody znalazły się w odpowiedzi na pozew.
              </div>
            </div>

            {/* Krok 3 */}
            <div className="bg-[#FFFFFF] border border-[#E1E3E7] rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-7 rounded-full bg-[#172338] text-[#FFFFFF] text-xs font-mono font-bold flex items-center justify-center">
                  3
                </span>
                <h2 className="text-2xl font-serif font-bold text-[#172338]">
                  Analiza przeciwna (Adversarial Review)
                </h2>
              </div>
              <p className="text-sm text-[#5F6774] leading-relaxed mb-4">
                System bada podniesione zarzuty z perspektywy pełnomocnika powoda. Wykrywa potencjalne słabości dowodowe, np. ryzyko zarzutu wad nieistotnych czy brak spełnienia wymogów formalnych potrącenia z art. 203[1] K.p.c.
              </p>
              <div className="bg-[#FAF9F6] border border-[#E1E3E7] p-4 rounded-lg text-xs font-mono text-[#172338]">
                <strong>Ochrona przed zaskoczeniem na sali:</strong> Identyfikacja konieczności powołania biegłego sądowego z wyprzedzeniem.
              </div>
            </div>

            {/* Krok 4 */}
            <div className="bg-[#FFFFFF] border border-[#E1E3E7] rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-7 rounded-full bg-[#137333] text-[#FFFFFF] text-xs font-mono font-bold flex items-center justify-center">
                  4
                </span>
                <h2 className="text-2xl font-serif font-bold text-[#172338]">
                  Warsztat pracy z pismem i eksport DOCX
                </h2>
              </div>
              <p className="text-sm text-[#5F6774] leading-relaxed mb-4">
                W dzielonym edytorze prawnik widzi pismo po lewej i powiązane karty akt po prawej.
                Kliknięcie odnośnika w uzasadnieniu natychmiast przewija podgląd do odpowiedniej karty i akapitu dokumentu źródłowego.
                Po zatwierdzeniu pismo pobierane jest w formacie Microsoft Word ze wszystkimi formalnymi marginesami.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/demo"
              className="inline-flex items-center justify-center bg-[#172338] hover:bg-[#355CFF] text-[#FFFFFF] font-semibold text-base px-8 py-3.5 rounded-lg transition-colors shadow-sm"
            >
              Zobacz proces na sprawie demonstracyjnej →
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
