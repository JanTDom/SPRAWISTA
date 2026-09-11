import Link from "next/link";
import { SiteHeader } from "@/presentation/components/navigation/site-header";
import { SiteFooter } from "@/presentation/components/navigation/site-footer";

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F6F5F1]">
      <SiteHeader />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#5F6774] font-semibold">
              Proste i Przejrzyste Zasady
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#172338] mt-2 mb-4">
              Cennik Sprawisty
            </h1>
            <p className="text-lg text-[#5F6774] max-w-2xl mx-auto leading-relaxed">
              Jeden plan abonamentowy obejmujący cały proces odpowiedzi na pozew. Bez sztucznego dzielenia na pakiety „Basic” czy „Enterprise”.
            </p>
          </div>

          <div className="max-w-xl mx-auto bg-[#FFFFFF] border-2 border-[#172338] rounded-2xl p-8 shadow-paper-elevated mb-12">
            <div className="flex items-center justify-between pb-6 border-b border-[#E1E3E7] mb-6">
              <div>
                <span className="text-xs font-mono bg-[#EEF2FF] text-[#355CFF] font-semibold px-2.5 py-1 rounded">
                  Plan Kancelaria Pro
                </span>
                <h2 className="text-2xl font-serif font-bold text-[#172338] mt-2">Dla Zespołów Prawnych</h2>
                <p className="text-xs text-[#5F6774] mt-1">Dla kancelarii 2–20 prawników</p>
              </div>
              <div className="text-right">
                <span className="text-4xl font-serif font-bold text-[#172338]">599 zł</span>
                <span className="text-xs font-mono text-[#5F6774] block mt-0.5">netto / m-c za stanowisko</span>
              </div>
            </div>

            <div className="space-y-4 mb-8 text-sm text-[#172338]">
              <div className="flex items-start gap-3">
                <span className="text-[#355CFF] font-bold mt-0.5">✓</span>
                <div>
                  <strong>Pełny cykl odpowiedzi na pozew:</strong>
                  <p className="text-xs text-[#5F6774] mt-0.5">Od akt sprawy, przez mapę sporu, po zatwierdzony projekt pisma.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#355CFF] font-bold mt-0.5">✓</span>
                <div>
                  <strong>Selektywny OCR i wielokrokowa ekstrakcja:</strong>
                  <p className="text-xs text-[#5F6774] mt-0.5">Do 1000 stron akt miesięcznie na stanowisko (PDF, DOCX, skany).</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#355CFF] font-bold mt-0.5">✓</span>
                <div>
                  <strong>Weryfikacja źródeł „Od zdania do dowodu”:</strong>
                  <p className="text-xs text-[#5F6774] mt-0.5">100% powiązań z kartami akt i rejestrem Sejm ELI API.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#355CFF] font-bold mt-0.5">✓</span>
                <div>
                  <strong>Analiza przeciwna (Adversarial Review):</strong>
                  <p className="text-xs text-[#5F6774] mt-0.5">Symulacja riposty powoda i test odporności linii obrony.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#355CFF] font-bold mt-0.5">✓</span>
                <div>
                  <strong>Eksport DOCX w standardzie sądowym:</strong>
                  <p className="text-xs text-[#5F6774] mt-0.5">Margines na oprawę akt 3.5 cm, interlinia 1.5, numeracja stron.</p>
                </div>
              </div>
            </div>

            <Link
              href="/demo"
              className="w-full inline-flex items-center justify-center bg-[#172338] hover:bg-[#355CFF] text-[#FFFFFF] font-semibold py-3.5 px-6 rounded-lg transition-colors text-center text-sm shadow-sm"
            >
              Uruchom pełne demo bez zobowiązań
            </Link>
          </div>

          {/* Zasady Rozliczania i Fakturowanie */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#5F6774]">
            <div className="bg-[#FFFFFF] border border-[#E1E3E7] p-4 rounded-lg">
              <strong className="text-[#172338] block mb-1">Polska Faktura VAT</strong>
              Faktura VAT 23% wystawiana automatycznie co miesiąc przez Stripe Customer Portal.
            </div>
            <div className="bg-[#FFFFFF] border border-[#E1E3E7] p-4 rounded-lg">
              <strong className="text-[#172338] block mb-1">Brak Długoterminowej Umowy</strong>
              Możliwość anulowania subskrypcji w dowolnym miesiącu z zachowaniem dostępu do końca okresu.
            </div>
            <div className="bg-[#FFFFFF] border border-[#E1E3E7] p-4 rounded-lg">
              <strong className="text-[#172338] block mb-1">Pilotaż Techniczny</strong>
              Podczas fazy testów aplikacja udostępniana jest bezpłatnie na syntetycznych aktach spraw.
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
