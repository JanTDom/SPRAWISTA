# PROJECT_STATE.md — Stan Projektu SPRAWISTA

**Ostatnia aktualizacja**: 2026-09-12  
**Status fazy**: Faza 1 & 2 — Pełna Implementacja Lokalna, Demonstrator Syntetyczny, Workspace i Eksport DOCX (Zakończona Sukcesem)

---

## 1. Aktualny Status Projektu
- Repozytorium Git na gałęzi `main`.
- Aplikacja Next.js 15.2.1 (React 19, TypeScript strict, Tailwind CSS 3.4) skompilowana produkcyjnie (`next build`) i uruchomiona w trybie produkcyjnym pod adresem: `http://localhost:3000`.
- Pełny pipeline logiki domenowej: 7 statusów ontologicznych dowodów, kalkulatory terminów procesowych (art. 115 K.c.) i odsetek (transakcje handlowe vs cywilne), izolacja multitenancy na poziomie repozytorium.
- Realistyczny przypadek syntetyczny (*ABC Budownictwo Generalny Wykonawca Sp. z o.o.* vs *XYZ Developer S.A.*, sygn. akt XVI GC 1420/26, WPS 147 600,00 zł) z 10 kompletnymi dokumentami akt sprawy, chronologią, mapą zarzutów, audytem przed podpisem i symulacją riposty powoda (Adversarial Review).
- Dwuszpaltowy pulpit pracy (Split-Screen Workspace) z interaktywnym skokiem cytowania „Od zdania do dowodu” (podświetlenie aktywnego chunka z odznaką `AKTYWNY CYTAT ↗`).
- Deterministyczny generator i pobieranie plików DOCX (`/api/export/docx/[matterId]`) z wymogami polskiego sądownictwa (35 mm lewy margines na wszycie, Times New Roman 12pt, interlinia 1.5, numeracja stron `Strona X z Y`).
- Zestaw 8 testów jednostkowych i integracyjnych przechodzi w 100% (`npm test`).
- Typecheck TypeScript (`npm run typecheck`) bez błędów.
- Weryfikacja wizualna w przeglądarce (Puppeteer) potwierdzona na desktopie (1440x900), laptopie (1280x800) i urządzeniu mobilnym (390x844).

---

## 2. Działające Elementy i Trasy
- [x] `http://localhost:3000/` — Strona główna z demonstratorem „Od zdania do dowodu”, 3 etapami procesu, podglądem Adversarial Review, audytu przed podpisem, cennikiem i FAQ.
- [x] `http://localhost:3000/demo` — Pełnowymiarowy pulpit pracy (Split-Screen Workspace) na danych syntetycznych.
- [x] `http://localhost:3000/app/sprawy` — Pulpit spraw kancelarii z filtrami, statusami i metrykami.
- [x] `http://localhost:3000/app/sprawy/matter-synth-001/workspace` — Dedykowany pulpit pracy ze sprawą.
- [x] `http://localhost:3000/jak-dziala` — Szczegółowa specyfikacja wieloetapowego procesu merytorycznego.
- [x] `http://localhost:3000/bezpieczenstwo` — 7 filarów ochrony tajemnicy kancelaryjnej i zgodności z RODO/EOG.
- [x] `http://localhost:3000/cennik` — Transparentny plan Kancelaria Pro (599 zł netto / m-c) bez ukrytych opłat.
- [x] `http://localhost:3000/api/export/docx/matter-synth-001` — Prawdziwy, binarny generator DOCX z poprawnym nagłówkiem OpenXML ZIP.

---

## 3. Środowisko i Migracja
- **Aktualne środowisko**: Lokalna produkcja (`npm start` na porcie 3000).
- **Następny krok (zgodnie z instrukcją użytkownika)**: Przeniesienie na infrastrukturę docelową (Vercel + Supabase PostgreSQL z RLS + Trigger.dev + Stripe) po udostępnieniu kluczy dostępowych i konfiguracji kont chmurowych.

---

## 4. Ostatni Commit
- `c87dea1` — `docs: record initial project system setup and baseline state`
- Przygotowany commit: `feat: complete local web application, synthetic demo, workspace and DOCX generator`.
