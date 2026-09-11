import Link from "next/link";
import { SiteHeader } from "@/presentation/components/navigation/site-header";
import { SiteFooter } from "@/presentation/components/navigation/site-footer";
import { SentenceToProofInteractive } from "@/presentation/components/marketing/sentence-to-proof-interactive";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F6F5F1]">
      <SiteHeader />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden border-b border-[#E1E3E7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Copy & CTAs */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#E1E3E7] text-xs font-mono text-[#5F6774]">
                  <span className="w-2 h-2 rounded-full bg-[#355CFF]"></span>
                  Postępowanie cywilne i gospodarcze • K.p.c.
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#172338] tracking-tight leading-[1.12]">
                  Od akt do pisma. <br />
                  <span className="text-[#355CFF] italic font-normal">Bez gubienia dowodów.</span>
                </h1>

                <p className="text-lg sm:text-xl text-[#5F6774] font-sans leading-relaxed max-w-xl">
                  Sprawista pomaga przygotować odpowiedź na pozew na podstawie dokumentów sprawy.
                  Porządkuje argumenty, wskazuje ich źródła i pokazuje, co wymaga sprawdzenia.
                </p>

                {/* CTAs */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <Link
                    href="/demo"
                    className="inline-flex items-center justify-center bg-[#172338] hover:bg-[#355CFF] text-[#FFFFFF] text-base font-semibold px-6 py-3.5 rounded-lg transition-all duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#355CFF] focus-visible:ring-offset-2"
                  >
                    Zobacz Sprawistę w działaniu
                    <span className="ml-2 font-mono">→</span>
                  </Link>
                  <Link
                    href="/app/sprawy"
                    className="inline-flex items-center justify-center bg-[#FFFFFF] hover:bg-[#FAF9F6] text-[#172338] border border-[#E1E3E7] text-base font-medium px-6 py-3.5 rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#172338]"
                  >
                    Pulpit spraw
                  </Link>
                </div>

                {/* Transparent baseline guarantee */}
                <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#5F6774] font-mono">
                  <span className="flex items-center gap-1.5">
                    <strong className="text-[#172338]">100%</strong> weryfikowalnych cytowań
                  </span>
                  <span className="flex items-center gap-1.5">
                    <strong className="text-[#172338]">Eksport DOCX</strong> gotowy do sądu
                  </span>
                  <span className="flex items-center gap-1.5">
                    <strong className="text-[#172338]">Prawnik</strong> decyduje i zatwierdza
                  </span>
                </div>
              </div>

              {/* Right Column: Bespoke Master Illustration */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="w-full max-w-lg lg:max-w-none rounded-xl overflow-hidden shadow-paper-elevated border border-[#E1E3E7] bg-[#FFFFFF] p-2">
                  <img
                    src="/brand/hero-illustration.svg"
                    alt="Od rozproszonego materiału do uporządkowanej argumentacji"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: NIE TYLKO PISZE. POKAZUJE, NA CZYM OPIERA WNIOSEK */}
        <section className="py-20 bg-[#F6F5F1] border-b border-[#E1E3E7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-mono uppercase tracking-widest text-[#355CFF] font-semibold">
                Architektura dowodowa
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#172338] mt-2 mb-4">
                Nie tylko pisze. Pokazuje, na czym opiera wniosek.
              </h2>
              <p className="text-base sm:text-lg text-[#5F6774] leading-relaxed">
                Każde istotne zdanie odpowiedzi na pozew jest powiązane ze stabilnym fragmentem akt:
                umową, protokołem, fakturą czy mailem. Jednym kliknięciem sprawdzasz, czy wniosek ma pokrycie w materiale.
              </p>
            </div>

            {/* Interaktywny Widget Od Zdania Do Dowodu */}
            <SentenceToProofInteractive />
          </div>
        </section>

        {/* SECTION 2: DOKUMENTY. ARGUMENTY. PROJEKT PISMA */}
        <section className="py-20 bg-[#FFFFFF] border-b border-[#E1E3E7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-16">
              <span className="text-xs font-mono uppercase tracking-widest text-[#5F6774] font-semibold">
                Trzy etapy procesu
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#172338] mt-2 mb-4">
                Dokumenty. Argumenty. Projekt pisma.
              </h2>
              <p className="text-base sm:text-lg text-[#5F6774] leading-relaxed">
                Sprawista nie jest polem na jeden długi prompt. To wielokrokowy proces o ścisłych regułach procesowych.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Krok 1 */}
              <div className="bg-[#FAF9F6] border border-[#E1E3E7] rounded-xl p-6 flex flex-col justify-between hover:border-[#355CFF] transition-colors">
                <div>
                  <div className="w-8 h-8 rounded bg-[#172338] text-[#F6F5F1] font-mono text-sm font-semibold flex items-center justify-center mb-4">
                    01
                  </div>
                  <h3 className="font-serif font-bold text-xl text-[#172338] mb-2">
                    Uporządkowanie akt i raport kompletności
                  </h3>
                  <p className="text-sm text-[#5F6774] leading-relaxed">
                    Wgrywasz pozew i załączniki. System wyodrębnia tekst, stosuje selektywny OCR dla skanów i tworzy czytelny raport stron nieczytelnych lub wymagających uwagi.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#E1E3E7] text-xs font-mono text-[#5F6774]">
                  Zero pomijania stron po cichu
                </div>
              </div>

              {/* Krok 2 */}
              <div className="bg-[#FAF9F6] border border-[#E1E3E7] rounded-xl p-6 flex flex-col justify-between hover:border-[#355CFF] transition-colors">
                <div>
                  <div className="w-8 h-8 rounded bg-[#355CFF] text-[#FFFFFF] font-mono text-sm font-semibold flex items-center justify-center mb-4">
                    02
                  </div>
                  <h3 className="font-serif font-bold text-xl text-[#172338] mb-2">
                    Oś czasu i katalog zarzutów
                  </h3>
                  <p className="text-sm text-[#5F6774] leading-relaxed">
                    System rozdziela twierdzenia powoda od dowodów z dokumentów. Tworzy chronologię zdarzeń i proponuje zarzuty: brak wymagalności, wady dzieła, potrącenie.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#E1E3E7] text-xs font-mono text-[#355CFF]">
                  Rygor prekluzji z art. 458[5] K.p.c.
                </div>
              </div>

              {/* Krok 3 */}
              <div className="bg-[#FAF9F6] border border-[#E1E3E7] rounded-xl p-6 flex flex-col justify-between hover:border-[#355CFF] transition-colors">
                <div>
                  <div className="w-8 h-8 rounded bg-[#172338] text-[#F6F5F1] font-mono text-sm font-semibold flex items-center justify-center mb-4">
                    03
                  </div>
                  <h3 className="font-serif font-bold text-xl text-[#172338] mb-2">
                    Projekt odpowiedzi i eksport Word
                  </h3>
                  <p className="text-sm text-[#5F6774] leading-relaxed">
                    W dzielonym edytorze weryfikujesz petitum, wnioski dowodowe i uzasadnienie. Po zatwierdzeniu pobierasz edytowalny plik DOCX z marginesami sądowymi (3.5 cm).
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#E1E3E7] text-xs font-mono text-[#5F6774]">
                  Prawdziwy DOCX, bez błędów XML
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: ZOBACZ SPRAWĘ OCZAMI PRZECIWNIKA */}
        <section className="py-20 bg-[#F6F5F1] border-b border-[#E1E3E7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-mono uppercase tracking-widest text-[#B06000] font-semibold">
                  Adversarial Review
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#172338]">
                  Zobacz sprawę także oczami przeciwnika.
                </h2>
                <p className="text-base text-[#5F6774] leading-relaxed">
                  Zamiast sztucznego entuzjazmu, Sprawista symuluje ripostę doświadczonego pełnomocnika powoda.
                  Wskazuje, które zarzuty mogą zostać obalone tezą z orzecznictwa SN, i sugeruje wniosek o biegłego zanim zrobisz to pod presją na sali rozpraw.
                </p>
                <div className="pt-2">
                  <div className="p-4 bg-[#FFFFFF] border-l-4 border-[#B06000] rounded-r border-t border-b border-r border-[#E1E3E7] text-xs font-sans text-[#172338] space-y-1">
                    <p className="font-bold text-[#B06000] uppercase font-mono">Zidentyfikowane ryzyko procesowe:</p>
                    <p className="text-sm text-[#172338]">Powód podniesie zarzut wad nieistotnych, powołując się na art. 654 K.c. (wyrok SN IV CSK 359/13).</p>
                    <p className="text-[#5F6774]">Rekomendacja: wnieść o opinię biegłego sądowego na okoliczność przekroczenia normy PN-EN 13670.</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="bg-[#FFFFFF] border border-[#E1E3E7] rounded-xl p-6 shadow-paper">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E1E3E7] mb-4">
                    <span className="text-xs font-mono text-[#5F6774]">STRESS-TEST ARGUMENTACJI</span>
                    <span className="text-xs font-mono text-[#172338] bg-[#FAF9F6] px-2 py-0.5 rounded border border-[#E1E3E7]">
                      Symulacja odpowiedzi powoda
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-[#FAF9F6] border border-[#E1E3E7]">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-[#172338]">Zarzut potrącenia z kosztów usunięcia wad</span>
                        <span className="text-[11px] font-mono text-[#C5221F] bg-[#FCE8E6] px-2 py-0.5 rounded font-semibold">
                          Ryzyko formalne K.p.c.
                        </span>
                      </div>
                      <p className="text-xs text-[#5F6774] leading-relaxed">
                        W postępowaniu gospodarczym zarzut potrącenia podlega rygorowi z art. 203[1] § 1 K.p.c. Wierzytelność pozwanego z tytułu prywatnej ekspertyzy nie jest bezsporna ani stwierdzona prawomocnym orzeczeniem.
                      </p>
                      <p className="text-xs text-[#355CFF] font-medium mt-2">
                        Rekomendacja strategiczna: Odrzucić zarzut potrącenia w petitum; podnieść zarzut nienależytego wykonania umowy (art. 471 K.c.) lub wytoczyć powództwo wzajemne.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-[#FAF9F6] border border-[#E1E3E7]">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-[#172338]">Rozbieżność kwotowa z fakturą korygującą</span>
                        <span className="text-[11px] font-mono text-[#137333] bg-[#E6F4EA] px-2 py-0.5 rounded font-semibold">
                          Mocny zarzut (Niskie ryzyko)
                        </span>
                      </div>
                      <p className="text-xs text-[#5F6774] leading-relaxed">
                        Zmniejszenie dochodzonej kwoty o 49 200,00 zł wynika wprost z dokumentu księgowego wystawionego przez powoda. Pełnomocnik powoda nie będzie w stanie obalić tego dowodu.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: ZANIM PODPISZESZ (AUDYT) */}
        <section className="py-20 bg-[#FFFFFF] border-b border-[#E1E3E7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-mono uppercase tracking-widest text-[#172338] font-semibold">
                Kontrola rzetelności
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#172338] mt-2 mb-4">
                Zanim podpiszesz.
              </h2>
              <p className="text-base sm:text-lg text-[#5F6774] leading-relaxed">
                Sprawista nie wypuszcza pisma bez weryfikacji. Moduł „Przed podpisem” sprawdza zgodność rachunkową kwot, istnienie powołanych dowodów, brakujące załączniki i terminy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[#FAF9F6] border border-[#E1E3E7] p-5 rounded-lg">
                <span className="text-xs font-mono uppercase font-bold text-[#C5221F] block mb-2">
                  Błąd rachunkowy
                </span>
                <p className="text-sm font-semibold text-[#172338] mb-1">
                  Niezgodność WPS z korektą
                </p>
                <p className="text-xs text-[#5F6774]">
                  Wykrywa różnicę między kwotą z petitum pozwu a wystawioną korektą faktury.
                </p>
              </div>

              <div className="bg-[#FAF9F6] border border-[#E1E3E7] p-5 rounded-lg">
                <span className="text-xs font-mono uppercase font-bold text-[#B06000] block mb-2">
                  Brak danych
                </span>
                <p className="text-sm font-semibold text-[#172338] mb-1">
                  Niepotwierdzona data
                </p>
                <p className="text-xs text-[#5F6774]">
                  Oznacza brak dowodu doręczenia pisma przed procesem i sugeruje wniosek dowodowy.
                </p>
              </div>

              <div className="bg-[#FAF9F6] border border-[#E1E3E7] p-5 rounded-lg">
                <span className="text-xs font-mono uppercase font-bold text-[#355CFF] block mb-2">
                  Zgodność źródeł
                </span>
                <p className="text-sm font-semibold text-[#172338] mb-1">
                  100% istnienia cytowań
                </p>
                <p className="text-xs text-[#5F6774]">
                  Żadna sygnatura ani artykuł ustawy nie pochodzi z wyobraźni modelu.
                </p>
              </div>

              <div className="bg-[#FAF9F6] border border-[#E1E3E7] p-5 rounded-lg">
                <span className="text-xs font-mono uppercase font-bold text-[#137333] block mb-2">
                  Zgodność formalna
                </span>
                <p className="text-sm font-semibold text-[#172338] mb-1">
                  Wymogi art. 126 i 128 K.p.c.
                </p>
                <p className="text-xs text-[#5F6774]">
                  Automatyczna lista załączników, dowód uiszczenia opłaty i doręczenia odpisów.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: TWOJA KANCELARIA. TWOJE ZASADY */}
        <section className="py-20 bg-[#F6F5F1] border-b border-[#E1E3E7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-mono uppercase tracking-widest text-[#355CFF] font-semibold">
                Organizacja i bezpieczeństwo
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#172338] mt-2 mb-4">
                Twoja kancelaria. Twoje zasady.
              </h2>
              <p className="text-base sm:text-lg text-[#5F6774] leading-relaxed">
                Zaprojektowane dla zespołów 2–20 prawników obsługujących przedsiębiorców.
                Zarządzaj dostępem do spraw, chroń tajemnicę radcowską i adwokacką dzięki izolacji spraw wewnątrz kancelarii.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#FFFFFF] border border-[#E1E3E7] p-6 rounded-xl shadow-sm">
                <h3 className="font-serif font-bold text-lg text-[#172338] mb-2">
                  Ścisły chiński mur
                </h3>
                <p className="text-sm text-[#5F6774] leading-relaxed">
                  Przynależność do kancelarii nie daje automatycznego dostępu do każdej sprawy. Każdy prawnik ma dostęp wyłącznie do spraw, do których został jawnie przypisany.
                </p>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E1E3E7] p-6 rounded-xl shadow-sm">
                <h3 className="font-serif font-bold text-lg text-[#172338] mb-2">
                  Zero akt w logach i telemetrii
                </h3>
                <p className="text-sm text-[#5F6774] leading-relaxed">
                  Surowa treść dokumentów, nazwiska stron, kwoty roszczeń i numery PESEL/NIP nigdy nie trafiają do logów aplikacyjnych ani zewnętrznych systemów śledzenia błędów.
                </p>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E1E3E7] p-6 rounded-xl shadow-sm">
                <h3 className="font-serif font-bold text-lg text-[#172338] mb-2">
                  Trwałe usuwanie danych
                </h3>
                <p className="text-sm text-[#5F6774] leading-relaxed">
                  Po zakończeniu sprawy możesz jednym kliknięciem trwale usunąć akta, wyekstrahowane fragmenty, wersje robocze oraz powiązane z nimi wpisy w pamięci podręcznej.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: JEDEN PLAN CENOWY */}
        <section className="py-20 bg-[#FFFFFF] border-b border-[#E1E3E7]" id="cennik">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-mono uppercase tracking-widest text-[#5F6774] font-semibold">
                Przejrzysty model
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#172338] mt-2 mb-4">
                Jeden uczciwy plan. Bez ukrytych opłat.
              </h2>
              <p className="text-base sm:text-lg text-[#5F6774] leading-relaxed">
                Nie mnożymy sztucznych pakietów. Zapewniamy pełny dostęp do procesu odpowiedzi na pozew dla każdego prawnika w zespole.
              </p>
            </div>

            <div className="max-w-xl mx-auto bg-[#FAF9F6] border-2 border-[#172338] rounded-2xl p-8 shadow-paper-elevated">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#E1E3E7]">
                <div>
                  <h3 className="font-serif font-bold text-2xl text-[#172338]">Sprawista Kancelaria</h3>
                  <p className="text-xs font-mono text-[#5F6774] mt-1">Pełny dostęp do procesu odpowiedzi na pozew</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl sm:text-4xl font-serif font-bold text-[#172338]">599 zł</span>
                  <span className="text-xs font-mono text-[#5F6774] block mt-0.5">netto / m-c za użytkownika</span>
                </div>
              </div>

              <ul className="space-y-3.5 mb-8 text-sm text-[#172338]">
                <li className="flex items-center gap-3">
                  <span className="text-[#355CFF] font-bold">✓</span>
                  Nieograniczone tworzenie spraw i wersji odpowiedzi na pozew
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#355CFF] font-bold">✓</span>
                  Selektywny OCR i ekstrakcja faktów z akt w formacie PDF i DOCX
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#355CFF] font-bold">✓</span>
                  Pełna integracja z polskim ELI API (baza aktów prawnych)
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#355CFF] font-bold">✓</span>
                  Symulacja riposty powoda (Adversarial Review) i audyt „Przed podpisem”
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#355CFF] font-bold">✓</span>
                  Eksport do czystego formatu DOCX z marginesem sądowym (3.5 cm)
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#355CFF] font-bold">✓</span>
                  Izolacja spraw wewnątrz kancelarii (ochrona tajemnicy zawodowej)
                </li>
              </ul>

              <div className="space-y-3">
                <Link
                  href="/demo"
                  className="w-full inline-flex items-center justify-center bg-[#172338] hover:bg-[#355CFF] text-[#FFFFFF] font-semibold py-3.5 px-6 rounded-lg transition-colors text-center text-sm shadow-sm"
                >
                  Wypróbuj pełne demo na syntetycznej sprawie
                </Link>
                <p className="text-center text-xs text-[#5F6774] font-mono">
                  Wersja pilotażowa dostępna natychmiast bez podawania karty.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: RZETELNE FAQ */}
        <section className="py-20 bg-[#F6F5F1] border-b border-[#E1E3E7]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#172338] mb-12 text-center">
              Często zadawane pytania
            </h2>

            <div className="space-y-6">
              <div className="bg-[#FFFFFF] border border-[#E1E3E7] rounded-xl p-6 shadow-sm">
                <h3 className="font-serif font-bold text-lg text-[#172338] mb-2">
                  Czy Sprawista zastępuje prawnika?
                </h3>
                <p className="text-sm text-[#5F6774] leading-relaxed font-sans">
                  <strong>Nie.</strong> Sprawista nie jest autonomicznym pełnomocnikiem i nie świadczy samodzielnej pomocy prawnej.
                  Narzędzie przygotowuje sprawdzalny projekt pisma z przypisanymi dowodami. Każde twierdzenie, zarzut i wniosek dowodowy podlega weryfikacji i zatwierdzeniu przez radcę prawnego lub adwokata.
                </p>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E1E3E7] rounded-xl p-6 shadow-sm">
                <h3 className="font-serif font-bold text-lg text-[#172338] mb-2">
                  Skąd Sprawista bierze źródła i przepisy?
                </h3>
                <p className="text-sm text-[#5F6774] leading-relaxed font-sans">
                  Źródła dowodowe pochodzą wyłącznie z akt wgranych do konkretnej sprawy. Przepisy prawne weryfikowane są w oparciu o oficjalny rejestr Sejmu RP (ELI API).
                  Sprawista nie wymyśla sygnatur orzeczeń ani numerów artykułów. W razie braku dowodu w aktach system wprost oznacza: <em>[Brak bezpośredniej podstawy w materiale]</em>.
                </p>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E1E3E7] rounded-xl p-6 shadow-sm">
                <h3 className="font-serif font-bold text-lg text-[#172338] mb-2">
                  Co robi system, gdy dokument jest nieczytelny?
                </h3>
                <p className="text-sm text-[#5F6774] leading-relaxed font-sans">
                  Nie udajemy, że odczytaliśmy zamazany skan. W Raporcie Kompletności Akt system jawnie wskazuje numery stron nieczytelnych lub wymagających ręcznej weryfikacji, oznaczając poziom pewności OCR.
                </p>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E1E3E7] rounded-xl p-6 shadow-sm">
                <h3 className="font-serif font-bold text-lg text-[#172338] mb-2">
                  Co dzieje się z danymi kancelarii i aktami spraw?
                </h3>
                <p className="text-sm text-[#5F6774] leading-relaxed font-sans">
                  Dane spraw przetwarzane są wyłącznie w certyfikowanych centrach danych na terenie Unii Europejskiej.
                  Akta klientów nie są wykorzystywane do trenowania publicznych modeli. Po zakończeniu pracy nad sprawą pełnomocnik może trwale i nieodwracalnie usunąć wszystkie załączniki i ekstrakcje.
                </p>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E1E3E7] rounded-xl p-6 shadow-sm">
                <h3 className="font-serif font-bold text-lg text-[#172338] mb-2">
                  Czy można pobrać plik w formacie Word (DOCX)?
                </h3>
                <p className="text-sm text-[#5F6774] leading-relaxed font-sans">
                  <strong>Tak.</strong> Wygenerowane pismo jest eksportowane jako rzeczywisty, w pełni edytowalny plik `.docx` z zachowaniem polskich marginesów sądowych (35 mm lewy na oprawę akt), czcionki Times New Roman 12 pt, interlinii 1.5 i numeracji stron.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: FINAL CALL TO ACTION */}
        <section className="py-20 bg-[#172338] text-[#FFFFFF]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight">
              Od akt do projektu pisma. <br />
              <span className="text-[#355CFF] italic font-normal">Z dowodami, które możesz sprawdzić.</span>
            </h2>
            <p className="text-base sm:text-lg text-[#8C93A0] max-w-2xl mx-auto leading-relaxed">
              Oceń działanie Sprawisty na rzeczywistej sprawie syntetycznej: zobacz podział twierdzeń, kliknij odnośnik dowodu i pobierz wygenerowany plik Word.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/demo"
                className="bg-[#355CFF] hover:bg-[#2849D9] text-[#FFFFFF] font-semibold text-base px-8 py-4 rounded-lg transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#355CFF]"
              >
                Uruchom interaktywne demo
              </Link>
              <Link
                href="/app/sprawy"
                className="bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/20 text-[#FFFFFF] font-medium text-base px-8 py-4 rounded-lg transition-all"
              >
                Przejdź do pulpitu spraw
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
