# IMPLEMENTATION_PLAN.md — Plan Wdrożenia i Kamienie Milowe Projektu SPRAWISTA

Plan definiuje ustrukturyzowane etapy budowy systemu Sprawista w standardzie inżynieryjnym Fable 5.1.

---

## Przegląd Etapów Realizacji

Etap | Nazwa Fazy | Zależności | Kryteria Zakończenia | Status
:--- | :--- | :--- | :--- | :---
**Faza 0** | **Trwała Konfiguracja i Standardy Pracy** | Brak | Reguły, 20 skilli, indeksy, git repo, brak błędów weryfikacji | **UKOŃCZONA**
**Faza 1** | **Fundament Aplikacji i Design System** | Faza 0 | Next.js 15, TypeScript strict, Tailwind z tokenami Editorial Precision, bazowe layouty | ZAPLANOWANA
**Faza 2** | **Przyjmowanie Akt i Ekstrakcja (Ingestion & OCR)** | Faza 1 | Upload PDF, prywatne Storage, ekstrakcja tekstu, chunking, raport kompletności | ZAPLANOWANA
**Faza 3** | **Silnik Faktów, Kalendarz i Mapa Sporu** | Faza 2 | Ekstrakcja osi czasu, deterministyczne kalkulatory terminów i odsetek, podział twierdzeń | ZAPLANOWANA
**Faza 4** | **Dzielony Pulpit Pracy (Document Workspace)** | Faza 1, 3 | Split-screen: edytor pisma procesowego + podgląd akt ze skokiem do cytatów | ZAPLANOWANA
**Faza 5** | **Wielokrokowy Pipeline AI i Adversarial Review** | Faza 3, 4 | Generowanie zarzutów z dowodami, symulacja riposty powoda, brak halucynacji | ZAPLANOWANA
**Faza 6** | **Moduł Generowania DOCX i Eksport Pisma** | Faza 4 | Czysty, w pełni edytowalny plik Word zgodny z wymogami polskiego sądownictwa | ZAPLANOWANA
**Faza 7** | **Multitenancy, Auth i Ochrona Tajemnicy** | Faza 1, 2 | Supabase Auth, organizacje, uprawnienia na poziomie sprawy, audyt RLS | ZAPLANOWANA
**Faza 8** | **Zadania Trwałe w Tle (Trigger.dev)** | Faza 2, 5 | Długie procesy OCR i analizy w kolejce wznawialnej, zero 504 timeoutów | ZAPLANOWANA
**Faza 9** | **Billing i Subskrypcje Kancelaryjne** | Faza 7 | Stripe Checkout, webhooki z weryfikacją podpisu, zarządzanie planem | ZAPLANOWANA
**Faza 10** | **Testy Przeglądarkowe, Ewaluacja Prawna i Release** | Wszystkie | Scenariusze E2E w Puppeteer, 100% poprawności źródeł, wdrożenie produkcyjne | ZAPLANOWANA

---

## Szczegółowe Zadania Najbliższego Etapu (Faza 1 — Po Otrzymaniu Promptu)
1. Inicjalizacja projektu Next.js (App Router, TypeScript strict, ESLint).
2. Konfiguracja Tailwind CSS z dedykowanymi tokenami barwnymi Editorial Precision (`#F6F5F1`, `#172338`, `#5F6774`, `#355CFF`, `#E1E3E7`).
3. Import i optymalizacja fontów `Newsreader` oraz `Manrope` (lokalnie/Next Font z obsługą polskich znaków).
4. Budowa komponentu bazowego `WorkspaceShell` dostosowanego do ekranów 13–16 cali z płynnie zwijanymi szpaltami.
5. Zweryfikowanie stanu pustego i responsywności pierwszego widoku za pomocą MCP Puppeteer.
