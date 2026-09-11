# PROJECT_STATE.md — Stan Projektu SPRAWISTA

**Ostatnia aktualizacja**: 2026-09-12  
**Status fazy**: Faza 1, 2 & 3 — Pełna Implementacja Lokalna, Demonstrator Syntetyczny, Workspace, Eksport DOCX oraz Rozszerzona Baza Wiedzy i Rejestrów Publicznych (Zakończona Sukcesem)

---

## 1. Aktualny Status Projektu
- Repozytorium Git na gałęzi `main`.
- Aplikacja Next.js 15.2.1 (React 19, TypeScript strict, Tailwind CSS 3.4) skompilowana i działająca pod adresem: `http://localhost:3000`.
- **Rozszerzona Baza Wiedzy i Wiarygodności Procesowej**:
  - **Rejestry KRS / CEIDG**: automatyczna weryfikacja umocowania sygnatariuszy umów i aneksów na dzień czynności, wykrywanie rzekomych pełnomocników (*falsus procurator*, art. 103 K.c.), naruszeń reprezentacji łącznej (art. 205 K.s.h.) oraz kontrola upadłości/restrukturyzacji (art. 174 K.p.c.).
  - **Autentyczne Orzecznictwo Sądu Najwyższego (Zero Halucynacji)**: precyzyjne powiązanie zweryfikowanych wyroków i uchwał SN (m.in. I CKN 520/97, V CSK 99/07, III CZP 111/13) z zarzutami obrony, bez ryzyka zmyślonych sygnatur.
  - **Kalkulator NBP**: przeliczenia walutowe wg art. 358 K.c. oraz deterministyczne obliczanie zryczałtowanych rekompensat 40/70/100 EUR z ustawy o transakcjach handlowych.
  - **Biała Lista Podatników VAT**: weryfikacja statusu czynnego podatnika oraz rejestracji rachunku bankowego w wykazie Szefa KAS.
- Dwuszpaltowy pulpit pracy (Split-Screen Workspace) z 6 zakładkami: Pismo, Oś czasu, Mapa sporu, Analiza przeciwna, Przed podpisem oraz **Rejestry i Prawo**.
- Deterministyczny generator i pobieranie plików DOCX (`/api/export/docx/[matterId]`) z wymogami polskiego sądownictwa (35 mm lewy margines na wszycie, Times New Roman 12pt, interlinia 1.5, numeracja stron `Strona X z Y`).
- Zestaw **18 testów jednostkowych i integracyjnych** przechodzi w 100% (`npm test`).
- Typecheck TypeScript (`npm run typecheck`) bez błędów.
- Weryfikacja wizualna w przeglądarce (Puppeteer) potwierdzona na 5 scenariuszach (`docs/quality/screenshots/01-05`).

---

## 2. Działające Elementy i Trasy
- [x] `http://localhost:3000/` — Strona główna z demonstratorem „Od zdania do dowodu”, 3 etapami procesu, podglądem Adversarial Review, audytu przed podpisem, cennikiem i FAQ.
- [x] `http://localhost:3000/demo` — Pełnowymiarowy pulpit pracy z nową zakładką „Rejestry i Prawo”.
- [x] `http://localhost:3000/app/sprawy` — Pulpit spraw kancelarii z filtrami, statusami i metrykami.
- [x] `http://localhost:3000/app/sprawy/matter-synth-001/workspace` — Dedykowany pulpit pracy ze sprawą.
- [x] `http://localhost:3000/jak-dziala` — Szczegółowa specyfikacja wieloetapowego procesu merytorycznego.
- [x] `http://localhost:3000/bezpieczenstwo` — 7 filarów ochrony tajemnicy kancelaryjnej i zgodności z RODO/EOG.
- [x] `http://localhost:3000/cennik` — Transparentny plan Kancelaria Pro (599 zł netto / m-c) bez ukrytych opłat.
- [x] `http://localhost:3000/api/export/docx/matter-synth-001` — Generator DOCX z uwzględnieniem orzecznictwa SN i zarzutu braku umocowania.

---

## 3. Środowisko i Migracja
- **Aktualne środowisko**: Lokalna produkcja (`http://localhost:3000`).
- **Następny krok (zgodnie z instrukcją użytkownika)**: Przeniesienie na infrastrukturę docelową (Vercel + Supabase PostgreSQL z RLS + Trigger.dev + Stripe) po udostępnieniu kluczy dostępowych i konfiguracji kont chmurowych.

---

## 4. Ostatni Commit
- `a9dab92` — `feat: complete local web application, synthetic demo, workspace and DOCX generator`
- Przygotowany commit: `feat: add legal knowledge engine, KRS/CEIDG verification, Supreme Court precedents and NBP compensation calculators`.
