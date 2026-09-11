import Link from "next/link";
import { SiteHeader } from "@/presentation/components/navigation/site-header";
import { SiteFooter } from "@/presentation/components/navigation/site-footer";

export default function SecurityPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F6F5F1]">
      <SiteHeader />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#137333] font-semibold">
              Ochrona Tajemnicy Zawodowej
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#172338] mt-2 mb-4">
              Bezpieczeństwo i Poufność Danych
            </h1>
            <p className="text-lg text-[#5F6774] leading-relaxed">
              Tajemnica radcowska i adwokacka to fundament zaufania w wymiarze sprawiedliwości.
              Architektura Sprawisty została zaprojektowana z zachowaniem zasady obrony w głąb (Defense-in-Depth).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-[#FFFFFF] border border-[#E1E3E7] rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-serif font-bold text-[#172338] mb-3">
                1. Izolacja Tenanta i Chiński Mur
              </h3>
              <p className="text-sm text-[#5F6774] leading-relaxed">
                Każda kancelaria posiada całkowicie odrębną przestrzeń logiczną w bazie danych, egzekwowaną przez Row Level Security (RLS) w PostgreSQL.
                Ponadto przynależność do kancelarii nie daje automatycznego wglądu do wszystkich spraw – dostęp wymaga jawnego przypisania prawnika do akt sprawy.
              </p>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E1E3E7] rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-serif font-bold text-[#172338] mb-3">
                2. Obrona przed Prompt Injection
              </h3>
              <p className="text-sm text-[#5F6774] leading-relaxed">
                Akta sprawy traktowane są jak dane niezaufane, a nie instrukcje systemowe.
                Ukryty w pliku PDF tekst typu „zignoruj poprzednie instrukcje” nie ma możliwości zmiany reguł analitycznych ani wywołania zewnętrznych narzędzi.
              </p>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E1E3E7] rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-serif font-bold text-[#172338] mb-3">
                3. Zero Akt w Logach i Telemetrii
              </h3>
              <p className="text-sm text-[#5F6774] leading-relaxed">
                Żadne dane osobowe stron (PESEL, NIP, adresy, kwoty roszczeń) ani fragmenty pism procesowych nie trafiają do logów aplikacyjnych, analityki behawioralnej ani systemów śledzenia błędów.
              </p>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E1E3E7] rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-serif font-bold text-[#172338] mb-3">
                4. Serwery w Unii Europejskiej
              </h3>
              <p className="text-sm text-[#5F6774] leading-relaxed">
                Infrastruktura obliczeniowa oraz bazy danych zlokalizowane są wyłącznie na terenie Europejskiego Obszaru Gospodarczego (region Frankfurt / Warszawa).
                Żadne dane nie są przesyłane do publicznych modeli w celach trenowania.
              </p>
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E1E3E7] rounded-xl p-8 shadow-sm">
            <h3 className="text-xl font-serif font-bold text-[#172338] mb-3">
              Trwałe Usuwanie Danych (Right to be Forgotten)
            </h3>
            <p className="text-sm text-[#5F6774] leading-relaxed mb-4">
              Po zakończeniu sprawy lub wygaśnięciu subskrypcji kancelaria może w dowolnym momencie trwale usunąć sprawę.
              Operacja powoduje kaskadowe usunięcie plików z prywatnego magazynu danych, rekordów bazodanowych, wektorów oraz wpisów z pamięci podręcznej.
            </p>
            <div className="text-xs font-mono text-[#5F6774] bg-[#FAF9F6] p-3 rounded border border-[#E1E3E7]">
              Szyfrowanie danych w spoczynku: AES-256 • Szyfrowanie w tranzycie: TLS 1.3
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
