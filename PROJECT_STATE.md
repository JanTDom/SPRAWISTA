# PROJECT_STATE.md — Stan Projektu SPRAWISTA

**Ostatnia aktualizacja**: 2026-09-12  
**Status fazy**: Integracja Silnika Kwantowo-Hybrydowego YourQuantum & Optymalizacja Strategii Procesowej — Zakończona Pełnym Sukcesem

---

## 1. Wdrożenie Produkcyjne (Live Web)
- **Domena Główna**: [https://sprawista.pl](https://sprawista.pl) (przekierowanie 308 do `https://www.sprawista.pl/`)
- **Domena WWW**: [https://www.sprawista.pl](https://www.sprawista.pl) (pełna aplikacja produkcyjna, status HTTP 200)
- **Vercel Alias**: `https://sprawista.vercel.app`
- **Certyfikat SSL**: Let's Encrypt / Vercel (automatyczny, aktywny, HTTPS)
- **Konfiguracja DNS (nazwa.pl)**:
  - `sprawista.pl` -> Typ `A` -> `216.150.1.1` (status: `wykonany`, `Valid Configuration`)
  - `*.sprawista.pl` -> Typ `A` -> `216.150.1.1` (status: `wykonany`, `Valid Configuration`)
  - `www.sprawista.pl` -> Typ `CNAME` -> `8be676ab9f71b6c0.vercel-dns-016.com` (status: `wykonany`, `Valid Configuration`)
- **Hosting / PaaS**: Vercel (zespół `Political Dark Matter`, projekt `sprawista`, Next.js 15.2.9)
- **GitHub**: [https://github.com/JanTDom/SPRAWISTA](https://github.com/JanTDom/SPRAWISTA) (gałąź `main`, commit `f841ebe`)
- **Baza Danych**: Supabase (`vrucfsiwlqywtbgrubxa`, region `aws-0-eu-west-2`)
- **Warstwa AI**: Gemini 2.5 Flash (`GEMINI_API_KEY` w Vercel Environment Variables)
- **Silnik Kwantowy / Optymalizacyjny**: YourQuantum API (`YOURQUANTUM_API_KEY=yq_live_master_aff0d626d1dd85ed88ab023b`)

---

## 2. Integracja Kwantowo-Hybrydowa YourQuantum
- [x] **Zapisanie i zabezpieczenie klucza API**: klucz `yq_live_master_aff0d626d1dd85ed88ab023b` skonfigurowany w `.env.local` z autoryzacją Bearer i X-API-Key.
- [x] **Klient `YourQuantumClient` (`yourquantum-client.ts`)**: obsługa protokołu `UniversalComputeRequest`, modeli QUBO/Ising, CP-SAT oraz Hybrid Benders z paszportami kryptograficznymi SHA-256 i wskaźnikami odporności.
- [x] **Usługa `QuantumStrategyOptimizer` (`quantum-strategy-optimizer.ts`)**:
  - Modelowanie kombinatorycznego problemu wyboru zarzutów procesowych (NP-trudny problem koalicji zarzutów),
  - Automatyczne wykrywanie sprzeczności procesowych (np. zarzut nieistnienia/nieważności umowy z art. 58 K.c. vs stanowczy zarzut potrącenia z art. 498 K.c.),
  - Wyznaczanie zarzutów głównych, ewentualnych (z ostrożności procesowej) oraz odradzanych z uwagi na ryzyko procesowe,
  - Wycena odporności linii obrony (wskaźnik `robustnessScore`).
- [x] **Endpoint API (`/api/quantum-strategy`)**: bezpieczna trasa Next.js łącząca pulpit prawnika z silnikiem obliczeniowym.
- [x] **UI w Warsztacie (`WorkspaceShell`)**:
  - Dedykowany przycisk `⚛️ Kwantowa optymalizacja` w zakładce *Mapa zarzutów*,
  - Interaktywny panel prezentujący wynik odporności, solver, paszport SHA-256 oraz rekomendacje taktyczne dla każdego zarzutu.

---

## 3. Praca na Realnych Dokumentach i Plastyczność dla Prawnika
- [x] **Zero fikcyjnych pism**: brak sztucznych dokumentów Budimexu w domyślnym widoku.
- [x] **Czysty Pulpit Spraw (`/app/sprawy`)**: elegancki stan pusty z kreatorem nowej sprawy.
- [x] **Płynna Ingerencja Prawnika**: modyfikacja petitum, uzasadnienia, stron, wniosków dowodowych i natychmiastowy eksport DOCX.
- [x] **Toolbar Wyciągania Wniosków z Zaznaczenia**: wstawianie dowodu, tworzenie zarzutu, dodawanie faktu do osi czasu, analiza Gemini AI.

---

## 4. Jakość i Testy (Fable 5.1)
- **45 testów jednostkowych i integracyjnych**: 100% pass (`npm test`).
- **TypeScript strict**: 0 błędów (`npx tsc --noEmit`).
- **Next.js 15.2.9**: produkcyjny build z 11 zoptymalizowanymi trasami (kod 0).
