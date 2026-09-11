# DECISIONS.md — Rejestr Decyzji Architektonicznych i Produktowych (ADR)

Rejestr dokumentuje kluczowe wybory techniczne, produktowe i procesowe w projekcie Sprawista.

---

## ADR-001: Koncentracja na Jednym Procesie Procesowym w Wersji Startowej
- **Data**: 2026-09-11
- **Status**: Zaakceptowana
- **Kontekst**: Narzędzia prawnicze próbujące obsługiwać równocześnie prawo karne, administracyjne i rozwody cierpią na płytkość analizy, błędy dowodowe i brak zaufania środowiska prawniczego.
- **Decyzja**: Skupienie całości zasobów na jednym, powtarzalnym i mierzalnym procesie: **Odpowiedź na pozew o zapłatę wynikającą z umowy w postępowaniu cywilnym lub gospodarczym**.
- **Konsekwencje**:
  - (+) Wysoka precyzja ekstrakcji faktów z umów, faktur i protokołów.
  - (+) Zamknięty, sprawdzalny katalog zarzutów formalnych i materialnych.
  - (-) Odrzucenie na etapie MVP innych spraw (np. odszkodowania z deliktu, prawo pracy).
- **Warunek ponownej oceny**: Po osiągnięciu 95%+ wskaźnika satysfakcji i zatwierdzeń odpowiedzi na pozew przez minimum 20 kancelarii pilotażowych.

---

## ADR-002: Wybór Stosu Technologicznego — Next.js App Router, Supabase, Trigger.dev
- **Data**: 2026-09-11
- **Status**: Zaakceptowana
- **Kontekst**: Potrzebujemy architektury bezpiecznej, z izolacją danych (RLS), odpornej na długotrwałe przetwarzanie dokumentów (OCR, wektoryzacja, analiza AI) i zapewniającej błyskawiczny interfejs.
- **Decyzja**:
  - Frontend & API: Next.js (App Router, Server Components).
  - Baza danych & Auth & Storage: Supabase (PostgreSQL 15+ z RLS i prywatnym Storage).
  - Trwałe zadania w tle: Trigger.dev v3.
  - Edycja dokumentu i eksport: TipTap na froncie, dedykowany generator DOCX na backendzie.
- **Konsekwencje**:
  - (+) Zero limitów czasu zapytania HTTP dla operacji AI (Trigger.dev obsługuje zadania wielominutowe).
  - (+) Bezpieczeństwo tajemnicy zawodowej oparte na RLS w Postgresie.
  - (-) Wymaga utrzymania osobnej konfiguracji dla zadań w tle i weryfikacji regionów przetwarzania (UE).
- **Warunek ponownej oceny**: Przekroczenie limitów wydajnościowych bazy lub konieczność migracji on-premise dla klientów korporacyjnych.

---

## ADR-003: Kierunek Wizualny Editorial Precision i Rezygnacja z Klisz AI
- **Data**: 2026-09-11
- **Status**: Zaakceptowana
- **Kontekst**: Typowe interfejsy AI są generyczne (fioletowe gradienty, unoszące się kule), a serwisy prawnicze archaiczne (młotki sędziowskie, rzymskie kolumny). Żadne z tych podejść nie buduje zaufania radcy prawnego ani sędziego.
- **Decyzja**: Przyjęcie koncepcji **Editorial Precision**: estetyka szlachetnego papieru, precyzyjnego atramentu, wybitnej typografii (Newsreader + Manrope) i funkcjonalnego split-screenu pracy z dokumentem.
- **Konsekwencje**:
  - (+) Wizerunek profesjonalnego instrumentu analitycznego, a nie „zabawki z AI”.
  - (+) Wyższa ergonomia wielogodzinnej pracy dzięki ciepłemu tłu (`#F6F5F1`) i zbalansowanemu kontrastowi.
  - (-) Konieczność rygorystycznego pilnowania typografii i odrzucania szablonowych bibliotek UI bez dostosowania tokenów.
- **Warunek ponownej oceny**: Negatywny feedback z testów użyteczności z prawnikami na monitorach 13–16 cali.

---

## ADR-004: Deterministyczne Obliczenia Terminów i Odsetek Zamiast LLM
- **Data**: 2026-09-11
- **Status**: Zaakceptowana
- **Kontekst**: Modele LLM są niedeterministyczne w arytmetyce kalendarzowej (uwzględnianie sobót, świąt państwowych, art. 115 K.c.) oraz w naliczaniu odsetek ustawowych za opóźnienie w transakcjach handlowych.
- **Decyzja**: Wszystkie obliczenia terminów procesowych, terminów przedawnienia i kwot odsetek są realizowane w 100% przez deterministyczny, testowany kod TypeScript (`src/domain/calculators/`). Model AI jedynie identyfikuje daty i kwoty z dokumentów.
- **Konsekwencje**:
  - (+) Zero błędów kalendarzowych i odsetkowych.
  - (+) Pełna audytowalność wzorów obliczeń.
  - (-) Konieczność aktualizacji tabeli stóp procentowych NBP i świąt ustawowych w kodzie.
- **Warunek ponownej oceny**: Brak. Jest to nienegocjowalna zasada rzetelności procesowej.

---

## ADR-005: Struktura Instrukcji i Skilli w Standardzie Antigravity (.agents/)
- **Data**: 2026-09-11
- **Status**: Zaakceptowana
- **Kontekst**: Antigravity obsługuje natywną hierarchię reguł i skilli w katalogu `.agents/` na poziomie repozytorium z ładowaniem progresywnym.
- **Decyzja**: Umieszczenie 7 reguł w `.agents/rules/`, 20 skilli z frontmatterem w `.agents/skills/` oraz przenośnego indeksu w `AGENTS.md`.
- **Konsekwencje**:
  - (+) Automatyczne odkrywanie reguł i umiejętności przez system Antigravity.
  - (+) Zachowanie limitu tokenów dzięki progresywnemu ładowaniu szczegółowych instrukcji.
  - (-) Wymóg dbania o zwięzłość plików reguł (<10 000 znaków).
- **Warunek ponownej oceny**: Zmiana oficjalnej specyfikacji katalogów konfiguracyjnych w kolejnych wersjach Antigravity.
