"use client";

import { useState } from "react";
import Link from "next/link";

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F6F5F1]/95 backdrop-blur-md border-b border-[#E1E3E7] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#355CFF] rounded-md p-1"
          onClick={() => setMobileMenuOpen(false)}
        >
          <img src="/brand/logo.svg" alt="Sprawista" className="h-7 sm:h-8 w-auto" />
        </Link>

        {/* Desktop Navigation Links (>= md) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-[#5F6774]">
          <Link href="/jak-dziala" className="hover:text-[#172338] transition-colors">
            Jak działa
          </Link>
          <Link href="/bezpieczenstwo" className="hover:text-[#172338] transition-colors">
            Bezpieczeństwo
          </Link>
          <Link href="/cennik" className="hover:text-[#172338] transition-colors">
            Cennik
          </Link>
          <Link
            href="/app/sprawy"
            className="text-[#355CFF] font-semibold hover:text-[#2849D9] transition-colors flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-[#355CFF] animate-pulse"></span>
            Pulpit spraw
          </Link>
        </nav>

        {/* Action buttons (Desktop >= md) */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/demo"
            className="text-xs sm:text-sm font-medium text-[#172338] hover:text-[#355CFF] px-3 py-2 transition-colors"
          >
            Warsztat roboczy
          </Link>
          <Link
            href="/app/sprawy"
            className="bg-[#172338] hover:bg-[#355CFF] text-[#F6F5F1] text-xs sm:text-sm font-medium px-4 py-2.5 rounded-md transition-all duration-150 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#355CFF] focus-visible:ring-offset-2"
          >
            + Nowa sprawa
          </Link>
        </div>

        {/* Mobile & Tablet Action + Hamburger Button (< md) */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/app/sprawy"
            className="bg-[#172338] text-white text-xs font-semibold px-3 py-2 rounded-md shadow-sm"
          >
            Pulpit
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-[#172338] hover:bg-[#E1E3E7]/50 focus:outline-none focus:ring-2 focus:ring-[#355CFF]"
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFFFFF] border-b border-[#E1E3E7] px-4 pt-2 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/app/sprawy"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-lg bg-[#EEF2FF] text-[#355CFF] font-semibold text-sm"
            >
              <span>📁 Pulpit spraw kancelarii</span>
              <span className="font-mono text-xs">Otwórz →</span>
            </Link>
            <Link
              href="/demo"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-lg text-[#172338] hover:bg-[#FAF9F6] text-sm font-medium transition-colors"
            >
              Warsztat roboczy
            </Link>
            <Link
              href="/jak-dziala"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-lg text-[#172338] hover:bg-[#FAF9F6] text-sm font-medium transition-colors"
            >
              Jak działa Sprawista
            </Link>
            <Link
              href="/bezpieczenstwo"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-lg text-[#172338] hover:bg-[#FAF9F6] text-sm font-medium transition-colors"
            >
              Bezpieczeństwo i tajemnica radcowska
            </Link>
            <Link
              href="/cennik"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-lg text-[#172338] hover:bg-[#FAF9F6] text-sm font-medium transition-colors"
            >
              Cennik
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
