---
name: sprawista-browser-qa
description: >-
  Otwiera rzeczywistą aplikację w przeglądarce, wykonuje scenariusze testowe, zapisuje zrzuty ekranu, porównuje je z projektem i raportuje usterki.
  Używaj tego skilla przy testach E2E, inspekcji wizualnej UI, weryfikacji responsywności i potwierdzaniu jakości przed wydaniem.
---

# Skill: sprawista-browser-qa (Weryfikacja Wizualna i Testy Przeglądarkowe w Puppeteer)

Odpowiada za obiektywną ocenę działania i wyglądu Sprawisty w rzeczywistej przeglądarce internetowej. Wyklucza uznawanie kodu za „gotowy” wyłącznie na podstawie braku błędów kompilatora.

## 1. Kiedy Uruchamiać (Triggers)
- Po zaimplementowaniu nowego ekranu lub komponentu interfejsu.
- Przed zatwierdzeniem zmian wizualnych i scaleniem kodu.
- Gdy zachodzi podejrzenie rozjechania layoutu, ucinania tekstu lub problemów z responsywnością.

## 2. Wymagane Dane Wejściowe
- Adres lokalny uruchomionej aplikacji (np. `http://localhost:3000`).
- Scenariusz testowy do przejścia (kroki użytkownika).
- Oczekiwane punkty przerwania (Viewports: 1280x800 dla laptopa, 1920x1080 dla monitora stacjonarnego).

## 3. Procedura Krok po Kroku
1. **Nawigacja i Przygotowanie Środowiska**:
   - Użyj narzędzia `puppeteer_navigate` do otwarcia testowanego adresu URL.
   - Ustaw rozdzielczość testową za pomocą `puppeteer_evaluate`.
2. **Wykonanie Zrzutów Ekranu (Screenshots)**:
   - Wykonaj zrzuty ekranu dla kluczowych stanów widoku:
     - Stan początkowy / pusty;
     - Wypełniony formularz sprawy;
     - Dzielony ekran z otwartym pismem i aktami sprawy.
   - Zapisz zrzuty do katalogu audytowego (np. `docs/quality/screenshots/`).
3. **Audyt Wizualny i Rytmu Optycznego**:
   - Sprawdź, czy marginesy i odstępy są zgodne z siatką (wielokrotności 4px / 8px).
   - Zweryfikuj, czy polskie znaki diakrytyczne nie wywołują rozciągania wierszy (line height jump).
   - Potwierdź, że przyciski mają wysokość minimum 40 px, a kontrolki formularzy są czytelne.
4. **Weryfikacja Przepełnień i Skrajnych Danych**:
   - Przetestuj zachowanie przy bardzo długiej nazwie firmy powoda (np. 150 znaków).
   - Upewnij się, że nie występuje niekontrolowane poziome przewijanie całego okna (Horizontal Scroll Glitch).
5. **Generowanie Raportu Usterek Wizualnych**:
   - Opisz precyzyjnie każdą niezgodność: selektor elementu, oczekiwany wygląd, zaobserwowany błąd, ścieżka do zrzutu ekranu.

## 4. Wymagany Wynik
- Zestaw zrzutów ekranu wysokiej rozdzielczości potwierdzających działanie interfejsu.
- Raport testu wizualnego ze statusem `PASS` lub listą poprawek.

## 5. Warunki Odrzucenia Wyniku
- Uznanie ekranu za poprawny bez otwarcia przeglądarki i wykonania zrzutu.
- Ignorowanie uciętych napisów, nakładających się kontrolek lub nieczytelnego kontrastu.
- Zrzuty wykonane wyłącznie w jednym, nierealistycznym rozmiarze okna.

## 6. Sposób Weryfikacji
- Pomyślne wykonanie poleceń `puppeteer_navigate` i `puppeteer_screenshot`.
- Porównanie wymiarów i marginesów ze specyfikacją w `02-art-direction.md`.

## 7. Odnośniki do Materiałów
- Reguła: [02-art-direction.md](../../rules/02-art-direction.md)
- Reguła: [06-quality-and-release.md](../../rules/06-quality-and-release.md)
- Katalog zrzutów: [docs/quality/screenshots/](../../../docs/quality/)
