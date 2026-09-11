import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="w-full bg-[#FFFFFF] border-t border-[#E1E3E7] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Philosophy */}
          <div className="md:col-span-1">
            <img src="/brand/logo.svg" alt="Sprawista" className="h-7 w-auto mb-4" />
            <p className="text-sm text-[#5F6774] leading-relaxed mb-3 font-sans">
              Od akt do pisma procesowego. Z weryfikowalnymi dowodami, źródłami i analizą argumentów drugiej strony.
            </p>
            <p className="text-xs text-[#8C93A0] font-mono">
              sprawista.pl • 2026
            </p>
          </div>

          {/* Col 2: Produkt */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#172338] mb-4 font-mono">
              Produkt
            </h4>
            <ul className="space-y-2 text-sm text-[#5F6774]">
              <li>
                <Link href="/demo" className="hover:text-[#172338] transition-colors">
                  Syntetyczne Demo
                </Link>
              </li>
              <li>
                <Link href="/jak-dziala" className="hover:text-[#172338] transition-colors">
                  Jak to działa
                </Link>
              </li>
              <li>
                <Link href="/cennik" className="hover:text-[#172338] transition-colors">
                  Cennik i subskrypcja
                </Link>
              </li>
              <li>
                <Link href="/app/sprawy" className="hover:text-[#172338] transition-colors">
                  Pulpit spraw kancelarii
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Rzetelność & Bezpieczeństwo */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#172338] mb-4 font-mono">
              Standard i Bezpieczeństwo
            </h4>
            <ul className="space-y-2 text-sm text-[#5F6774]">
              <li>
                <Link href="/bezpieczenstwo" className="hover:text-[#172338] transition-colors">
                  Ochrona tajemnicy kancelaryjnej
                </Link>
              </li>
              <li>
                <span className="text-[#8C93A0]">Tylko serwery w Unii Europejskiej</span>
              </li>
              <li>
                <span className="text-[#8C93A0]">Zero trenowania na aktach klientów</span>
              </li>
              <li>
                <span className="text-[#8C93A0]">Eksport czystego formatu DOCX</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Ważna Informacja Prawna */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#172338] mb-4 font-mono">
              Aksjomat Odpowiedzialności
            </h4>
            <p className="text-xs text-[#5F6774] leading-relaxed bg-[#F6F5F1] p-3 rounded border border-[#E1E3E7]">
              Sprawista jest specjalistycznym oprogramowaniem wspomagającym pracę radców prawnych i adwokatów.
              Nie świadczy samodzielnej pomocy prawnej. Pełnomocnik procesowy weryfikuje i zatwierdza ostateczną treść pisma.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-[#E1E3E7] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5F6774]">
          <p>© 2026 Sprawista. Wszelkie prawa zastrzeżone.</p>
          <div className="flex gap-6">
            <span>Standard Editorial Precision</span>
            <span>Postępowanie cywilne i gospodarcze (K.p.c.)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
