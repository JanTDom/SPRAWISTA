# PROJECT_STATE.md — Stan Projektu SPRAWISTA

**Ostatnia aktualizacja**: 2026-09-12  
**Status fazy**: Praca na Realnych Dokumentach & Pełna Responsywność Mobile (Editorial Precision) — Zakończona Pełnym Sukcesem

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
- **GitHub**: [https://github.com/JanTDom/SPRAWISTA](https://github.com/JanTDom/SPRAWISTA) (gałąź `main`, najnowszy commit `0fb082e`)
- **Baza Danych**: Supabase (`vrucfsiwlqywtbgrubxa`, region `aws-0-eu-west-2`)
- **Warstwa AI**: Gemini 2.5 Flash (`GEMINI_API_KEY` w Vercel Environment Variables)

---

## 2. Praca na Realnych Dokumentach i Plastyczność dla Prawnika
- [x] **Zero zakodowanych na stałe fikcyjnych pism**: usunięto z domyślnego widoku mocki spraw budowlanych (Budimex / spękania stropu / faktury korygujące).
- [x] **Czysty Pulpit Spraw (`/app/sprawy`)**: elegancki stan pusty z natychmiastową możliwością utworzenia nowej sprawy procesowej na podstawie realnych danych.
- [x] **Kreator Nowej Sprawy**: wprowadzenie sygnatury akt, stron, sądu, wydziału, wartości sporu i trybu (cywilny zwykły / gospodarczy) z zapisem w pamięci lokalnej przeglądarki (`localStorage`).
- [x] **Płynna Ingerencja Prawnika na Każdym Poziomie**:
  - Edycja nagłówka sądu, sygnatury, stron, W.P.S. i daty w locie,
  - Dynamiczne dodawanie, usuwanie i edycja wniosków petitum,
  - Swobodna edycja sekcji i akapitów uzasadnienia z podziałem na markdown,
  - Dodawanie i usuwanie faktów z osi czasu oraz zarzutów z mapy sporu,
  - Bezpośredni eksport zmodyfikowanego pisma do edytowalnego formatu Word (`.docx`).
- [x] **Wyciąganie Wniosków z Części Dokumentu (Text-to-Insight Toolbar)**:
  - Selekcja dowolnego akapitu w panelu akt sprawy,
  - 📌 Wstaw jako dowód (automatyczne powołanie w uzasadnieniu z odnośnikiem do karty akt),
  - ⚖️ Utwórz zarzut procesowy na podstawie zaznaczenia,
  - 📅 Dodaj fakt do chronologii zdarzeń,
  - ✦ AI Wniosek — analiza zaznaczonego fragmentu przez Gemini 2.5 Flash pod kątem riposty powoda i podstawy KPC.

---

## 3. Poprawki Mobilne (Mobile Ergonomics & Responsive Design)
- [x] **Menu Hamburgerowe na Mobile (`SiteHeader`)**: responsywne menu z pełną nawigacją (Jak działa, Bezpieczeństwo, Cennik, Pulpit) bez ściskania napisów.
- [x] **Przełącznik Widoku w Warsztacie (`WorkspaceShell`)**: dedykowany przełącznik `[ 📝 Pismo ] | [ 📁 Akta ]` eliminujący ucinanie ekranu i blokowanie scrolla.
- [x] **Brak Ucinania Treści**: dodanie `pb-36` i elastycznych kontenerów `overflow-y-auto overscroll-contain` gwarantujących swobodne przewijanie całej treści pisma i akt na każdym telefonie.
- [x] **Kompaktowe Paski Stanu**: zoptymalizowany nagłówek dla ekranów od 320px do 420px.

---

## 4. Zestaw Testów i Jakość
- **43 testy jednostkowe i integracyjne**: 100% pass (`npm test`).
- **TypeScript strict**: 0 błędów (`npx tsc --noEmit`).
- **Next.js**: 15.2.9 production build zakończony z kodem 0.
