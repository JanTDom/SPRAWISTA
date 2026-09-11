---
name: sprawista-accessibility-performance
description: >-
  Kontroluje obsługę klawiatury, zarządzanie fokusem, czytniki ekranu, kontrast WCAG 2.2 AA, ograniczony ruch i wydajność Core Web Vitals.
  Używaj tego skilla przy audytach dostępności, optymalizacji czasu reakcji interfejsu (<100ms), profilowaniu renderowania i redukcji wagi bundla.
---

# Skill: sprawista-accessibility-performance (Dostępność WCAG 2.2 AA i Wydajność Interfejsu)

Odpowiada za błyskawiczne działanie oraz pełną dostępność Sprawisty. Sprawia, że prawnicy mogą pracować bez zmęczenia wzroku przez wiele godzin, sprawnie poruszając się po dokumentach za pomocą klawiatury.

## 1. Kiedy Uruchamiać (Triggers)
- Przy tworzeniu i modyfikacji interaktywnych komponentów (modale, rozwijane listy, zakładki akt).
- Podczas testów wydajnościowych Core Web Vitals (LCP, INP, CLS).
- Przed akceptacją widoków do wydania produkcyjnego.

## 2. Wymagane Dane Wejściowe
- Komponent lub strona poddawana audytowi.
- Wymagany standard: WCAG 2.2 poziom AA.
- Budżety wydajnościowe: LCP < 2.0s, INP < 100ms, CLS < 0.05.

## 3. Procedura Krok po Kroku
1. **Nawigacja Klawiaturą i Pułapki Fokusu (Focus Trapping)**:
   - Zapewnij logiczny porządek tabulacji (`tabindex`).
   - W oknach modalnych zamknij fokus wewnątrz okna (`focus trap`) i umożliw wyjście klawiszem `Escape`.
   - Zapewnij wyraźny, widoczny wskaźnik skupienia (`focus-visible`).
2. **Dostępność dla Czytników Ekranu (Screen Readers / ARIA)**:
   - Użyj semantycznych elementów HTML5 (`<button>` zamiast klikalnego `<div>`).
   - Dodaj dynamiczne powiadomienia o postępie analizy akt za pomocą `aria-live="polite"`.
   - Uzupełnij etykiety `aria-expanded` dla zwijanych paneli bocznych.
3. **Wsparcie dla Ograniczonego Ruchu (prefers-reduced-motion)**:
   - W stylach CSS wyłącz lub zminimalizuj animacje przy preferencji użytkownika:
     ```css
     @media (prefers-reduced-motion: reduce) {
       * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
     }
     ```
4. **Natychmiastowy Feedback (<100ms)**:
   - Każde kliknięcie przycisku generowania, zaznaczenia lub zapisu musi dać natychmiastową wizualną informację zwrotną (aktywacja wskaźnika, zmiana stanu przycisku) w czasie poniżej 100 milisekund.
5. **Optymalizacja Core Web Vitals**:
   - Wyeliminuj skakanie układu (CLS) poprzez rezerwację wymiarów dla podglądu PDF i szkieletów edytora.
   - Dynamiczne ładowanie ciężkich bibliotek (np. `pdfjs-dist` ładowany leniwie tylko po wejściu do podglądu akt).

## 4. Wymagany Wynik
- Kod spełniający wytyczne WCAG 2.2 AA potwierdzony audytem.
- Czas reakcji na interakcję <100ms.

## 5. Warunki Odrzucenia Wyniku
- Elementy interaktywne niedostępne z klawiatury (brak możliwości obsługi bez myszy).
- Brak widocznego pierścienia fokusu.
- Blokowanie wątku głównego przeglądarki na ponad 100ms podczas przewijania akt.

## 6. Sposób Weryfikacji
- Automatyczny audyt narzędziem `axe-core` lub wbudowanym w przeglądarkę testem dostępności.
- Ręczna weryfikacja obsługi całego procesu pisma wyłącznie za pomocą klawiatury (`Tab`, `Enter`, `Space`, `Esc`).

## 7. Odnośniki do Materiałów
- Reguła: [02-art-direction.md](../../rules/02-art-direction.md)
- Reguła: [06-quality-and-release.md](../../rules/06-quality-and-release.md)
- Wytyczne WCAG: `https://www.w3.org/WAI/WCAG22/quickref/`
