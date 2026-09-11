# QUALITY_GATES.md — Bramki Jakości i Kryteria Akceptacji Projektu SPRAWISTA

Każdy komponent i każde wydanie wersji produkcyjnej musi bezwzględnie spełnić poniższe bramki jakości (Quality Gates).

---

## 1. Bramka Architektoniczna i Typów (Gate A: TypeScript & Architecture)
Wymóg | Kryterium Akceptacji | Sposób Weryfikacji | Status
:--- | :--- | :--- | :---
**Zero błędów TypeScript** | Kompilacja `tsc --noEmit` kończy się kodem 0 bez ostrzeżeń | Uruchomienie `npm run typecheck` | NOT TESTED
**Zakaz typu `any`** | Ani jedno wystąpienie typu `any` w kodzie domenowym i aplikacyjnym | Linter `@typescript-eslint/no-explicit-any` | NOT TESTED
**Walidacja granic (Zod)** | Wszystkie wejścia API, formularzy i wyjścia AI walidowane schematem | Testy jednostkowe parserów Zod | NOT TESTED
**Separacja warstw** | Zero importów UI do warstwy domeny (`src/domain/`) | Reguły importów w ESLint | NOT TESTED

---

## 2. Bramka Rzetelności Merytorycznej (Gate B: Legal & AI Provenance)
Wymóg | Kryterium Akceptacji | Sposób Weryfikacji | Status
:--- | :--- | :--- | :---
**100% Weryfikowalność Cytowań** | Każdy dowód powołany w projekcie pisma posiada prawidłowy identyfikator karty akt | Test regresyjny weryfikacji powołań dowodowych | NOT TESTED
**Brak Zmyślonych Orzeczeń** | Żadna sygnatura ani teza orzeczenia nie jest generowana z wyobraźni modelu | Sprawdzenie z bazą orzeczeń lub wyłączenie powołania | NOT TESTED
**Determinizm Obliczeń** | Odsetki i terminy liczone wyłącznie przez funkcje matematyczne | 100% pokrycia testami modułu `calculators` | NOT TESTED
**Jawność Braków Dowodowych** | W przypadku braku dowodu pojawia się jawne oznaczenie `[Brak podstawy]` | Test scenariusza z niepełnymi aktami sprawy | NOT TESTED

---

## 3. Bramka Wizualna i Użyteczności (Gate C: Editorial UI & Accessibility)
Wymóg | Kryterium Akceptacji | Sposób Weryfikacji | Status
:--- | :--- | :--- | :---
**Standard 7 Stanów UI** | Każdy widok obsługuje: empty, loading, success, partial, error, unauthorized, overflow | Testy przeglądarkowe w Puppeteer ze zrzutami ekranu | NOT TESTED
**Kontrast i Dostępność** | WCAG 2.2 AA (kontrast min. 4.5:1 dla tekstu zwykłego, 3:1 dla dużego) | Automatyczny audyt Axe-core / Lighthouse | NOT TESTED
**Polskie Znaki i Typografia** | Prawidłowe renderowanie ą, ć, ę, ł, ń, ó, ś, ź, ż w Newsreader i Manrope | Inspekcja wizualna zrzutów ekranu | NOT TESTED
**Ergonomia na Laptopie** | Pełna funkcjonalność split-screen na ekranie 1280x800 bez ucinania treści | Test przeglądarkowy w rozdzielczości laptopowej | NOT TESTED

---

## 4. Bramka Bezpieczeństwa i Izolacji (Gate D: Security & Privacy)
Wymóg | Kryterium Akceptacji | Sposób Weryfikacji | Status
:--- | :--- | :--- | :---
**Izolacja Wielodostępowa (RLS)** | Użytkownik Kancelarii A nie ma dostępu do spraw Kancelarii B pod żadnym adresem | Testy integracyjne z mockowanymi tokenami JWT | NOT TESTED
**Uprawnienie do Sprawy** | Brak dostępu do sprawy bez jawnego przypisania (tajemnica zawodowa) | Test jednostkowy polityki dostępu na poziomie sprawy | NOT TESTED
**Ochrona Logów** | Zero surowych danych akt, PESEL, NIP i kwot w logach systemowych | Audyt regex w logach pipeline'u przetwarzania | NOT TESTED
**Odporność na Prompt Injection** | Treści z plików PDF nie modyfikują instrukcji systemowych i ról modelu | Test penetracyjny ze spreparowanym plikiem PDF | NOT TESTED

---

## 5. Bramka Eksportu Word (Gate E: DOCX Precision)
Wymóg | Kryterium Akceptacji | Sposób Weryfikacji | Status
:--- | :--- | :--- | :---
**Otwieralność Dokumentu** | Wygenerowany plik `.docx` otwiera się bez błędów w MS Word, LibreOffice i Pages | Walidacja schematu OpenXML i test otwarcia pliku | NOT TESTED
**Zgodność Treści z Pismem** | Wersja wyeksportowana jest tożsama co do litery z wersją zatwierdzoną w aplikacji | Porównanie sumy kontrolnej treści i test regresji | NOT TESTED
**Formatowanie Prawnicze** | Paginacja, justowanie, interlinia 1.5, marginesy sądowe (3.5 cm lewy na oprawę) | Sprawdzenie właściwości szablonu DOCX | NOT TESTED
