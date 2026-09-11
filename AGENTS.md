# AGENTS.md — Indeks Reguł, Ról i Źródeł Prawdy Projektu SPRAWISTA

Ten plik stanowi zwięzły, przenośny punkt wejścia dla agentów i inżynierów pracujących nad systemem Sprawista. Zawiera mapę reguł, źródeł prawdy i procedur operacyjnych.

---

## 1. Tożsamość i Cel Nadrzędny
- **Produkt**: Sprawista (`sprawista.pl`) — profesjonalna aplikacja webowa AI dla polskich kancelarii prawnych, przekształcająca dokumenty sprawy w sprawdzalny projekt odpowiedzi na pozew o zapłatę z umowy cywilnej lub gospodarczej.
- **Aksjomat**: Prawnik decyduje i zatwierdza. System dostarcza rzetelne fakty, dowody, źródła i analizę przeciwną w weryfikowalnym układzie redakcyjnym.

---

## 2. Mapa Reguł Projektowych (`.agents/rules/`)
Każdy agent podejmujący zadanie musi przestrzegać przypisanych reguł:

Plik Reguły | Zakres | Kiedy Stosować
:--- | :--- | :---
[`00-sprawista-core.md`](.agents/rules/00-sprawista-core.md) | Rdzeń tożsamości, zakazy merytoryczne, zasady współpracy | Zawsze aktywna dla każdego zadania
[`01-product-scope.md`](.agents/rules/01-product-scope.md) | Zakres MVP, granice produktu, ścieżka użytkownika | Planowanie funkcji, weryfikacja zakresu, odrzucanie rozpraszaczy
[`02-art-direction.md`](.agents/rules/02-art-direction.md) | Editorial Precision, paleta, typografia, zakazy klisz | Projektowanie i implementacja UI, grafiki, stylów
[`03-engineering.md`](.agents/rules/03-engineering.md) | Next.js App Router, TypeScript strict, Supabase, Trigger.dev | Kodowanie frontend/backend, architektura bazy, zadania w tle
[`04-legal-provenance.md`](.agents/rules/04-legal-provenance.md) | Kategoryzacja twierdzeń i dowodów, zakaz halucynacji, ELI API | Przetwarzanie akt, ekstrakcja, prompt engineering, kalkulatory
[`05-security-privacy.md`](.agents/rules/05-security-privacy.md) | Multitenancy, RLS, ochrona tajemnicy kancelaryjnej, prompt injection | Uprawnienia, bazy danych, integracje API, logowanie
[`06-quality-and-release.md`](.agents/rules/06-quality-and-release.md) | Standard 7 stanów UI, testy zachowań, weryfikacja wizualna | Testowanie, QA, audyty przed wdrożeniem, definicja ukończenia

---

## 3. Żywe Dokumenty Prawdy i Pamięci
Dokumenty w katalogu głównym projektu podlegają stałej aktualizacji:
- [`PROJECT_STATE.md`](PROJECT_STATE.md) — Aktualny stan budowy, działające moduły, blokady i bieżący cel.
- [`DECISIONS.md`](DECISIONS.md) — Rejestr kluczowych decyzji architektonicznych i produktowych (ADR).
- [`CAPABILITIES.md`](CAPABILITIES.md) — Rzeczywiste narzędzia, dostępność środowiskowa, limity i konfiguracje.
- [`IMPLEMENTATION_PLAN.md`](IMPLEMENTATION_PLAN.md) — Etapy realizacyjne, zależności i kryteria odbioru.
- [`QUALITY_GATES.md`](QUALITY_GATES.md) — Wymogi jakościowe, bramki wydania i dowody weryfikacji.

---

## 4. Zestaw Dedykowanych Skilli (`.agents/skills/`)
Projekt posiada 20 wyspecjalizowanych skilli procedur wykonawczych:
1. `sprawista-product` — Zarządzanie zakresem i ścieżką wartości.
2. `sprawista-art-direction` — Kierunek wizualny Editorial Precision.
3. `sprawista-brand-assets` — Znak, typografia wektorowa i materiały marki.
4. `sprawista-typography` — Typografia dokumentowa, polskie znaki i skala tekstu.
5. `sprawista-frontend` — Modularny interfejs React / Next.js.
6. `sprawista-document-workspace` — Dzielony pulpit pracy z aktami i pismem.
7. `sprawista-document-ingestion` — Bezpieczny upload, ekstrakcja tekstu i selektywny OCR.
8. `sprawista-evidence-and-law` — Rozdział twierdzeń, dowodów i stanów prawnych.
9. `sprawista-ai-pipeline` — Wielokrokowy deterministyczny pipeline analityczny.
10. `sprawista-adversarial-review` — Symulacja riposty przeciwnika procesowego.
11. `sprawista-multitenancy` — Izolacja kancelarii, sprawy i uprawnień (RLS+app).
12. `sprawista-durable-jobs` — Kolejki zadań długotrwałych (Trigger.dev).
13. `sprawista-security` — Model zagrożeń, prompt injection, ochrona tajemnicy.
14. `sprawista-word-export` — Deterministyczny generator pism procesowych DOCX.
15. `sprawista-billing` — Transparentny model subskrypcyjny Stripe.
16. `sprawista-accessibility-performance` — WCAG 2.2 AA, wydajność i metryki CWV.
17. `sprawista-browser-qa` — Rzeczywiste testy w przeglądarce i zrzuty ekranu.
18. `sprawista-legal-evaluation` — Zestawy ewaluacyjne i benchmarki merytoryczne.
19. `sprawista-release` — Procedura bezpiecznego wdrożenia i rollbacku.
20. `sprawista-project-memory` — Utrwalanie sprawdzonych wzorców i decyzji.

---

## 5. Standard Inżynierski (Fable 5.1)
- **Zero placeholderów, TODO i kodu-zaślepki.**
- **Weryfikacja u źródła**: testy i linter muszą przejść lokalnie przed uznaniem zadania za ukończone.
- **Brak zgadywania**: weryfikacja wersji i kontraktów API w oficjalnych dokumentacjach.
