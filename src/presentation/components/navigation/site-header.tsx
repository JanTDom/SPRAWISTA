import Link from "next/link";
import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#F6F5F1]/90 backdrop-blur-md border-b border-[#E1E3E7] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#355CFF] rounded-md p-1">
          <img src="/brand/logo.svg" alt="Sprawista" className="h-8 w-auto" />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#5F6774]">
          <Link href="/jak-dziala" className="hover:text-[#172338] transition-colors">
            Jak działa
          </Link>
          <Link href="/bezpieczenstwo" className="hover:text-[#172338] transition-colors">
            Bezpieczeństwo
          </Link>
          <Link href="/cennik" className="hover:text-[#172338] transition-colors">
            Cennik
          </Link>
          <Link href="/demo" className="text-[#355CFF] font-semibold hover:text-[#2849D9] transition-colors flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#355CFF] animate-pulse"></span>
            Interaktywne Demo
          </Link>
        </nav>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/app/sprawy"
            className="text-xs sm:text-sm font-medium text-[#172338] hover:text-[#355CFF] px-3 py-2 transition-colors"
          >
            Pulpit kancelarii
          </Link>
          <Link
            href="/demo"
            className="bg-[#172338] hover:bg-[#355CFF] text-[#F6F5F1] text-xs sm:text-sm font-medium px-4 py-2.5 rounded-md transition-all duration-150 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#355CFF] focus-visible:ring-offset-2"
          >
            Wypróbuj demo
          </Link>
        </div>
      </div>
    </header>
  );
}
