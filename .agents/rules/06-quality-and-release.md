# 06-quality-and-release: Wymogi Jakościowe, Bramki Wydania i Testowanie

## 1. Standard Testowania Modułów (Backend & Logika Domenowa)
Każdy kluczowy moduł i funkcja systemowa musi przejść zestaw testów zachowania:
1. **Test działania (Happy Path)**: Weryfikacja oczekiwanego wyniku przy poprawnych danych.
2. **Test błędu i wyjątków (Error Path)**: Obsługa błędnego formatu, nieczytelnego pliku, niedostępności API zewnętrznego.
3. **Test braku uprawnień (Authorization)**: Próba dostępu użytkownika z innej organizacji lub bez uprawnienia do sprawy musi zakończyć się kodem `403 Forbidden` / rzuceniem błędu bezpieczeństwa.
4. **Test danych pustych (Empty State)**: Obsługa sprawy bez załączników, pustego pozwu, braku zarzutów.
5. **Test idempotencji (Repeat Operation)**: Wielokrotne wysłanie tego samego żądania nie tworzy duplikatów ani nie nalicza podwójnych opłat.
6. **Test odświeżenia i wznawiania (Hydration & Resume)**: Zdolność systemu do kontynuacji pracy po przerwaniu połączenia lub przeładowaniu strony.
7. **Test anulowania (Cancellation)**: Bezpieczne przerwanie długiego zadania (Trigger.dev / LLM stream) na żądanie użytkownika.

## 2. Standard 7 Stanów Interfejsu (Frontend Quality)
Żaden ekran ani komponent nie może istnieć wyłącznie w stanie „idealnym”. Każdy widok musi jawnie obsługiwać:
1. **Stan pusty (Empty)**: Czytelna informacja, co należy zrobić, aby rozpocząć (np. „Przeciągnij pozew i załączniki”).
2. **Stan ładowania (Loading / Skeleton)**: Płynny skeleton zachowujący docelowy layout, bez skakania elementów (brak CLS).
3. **Stan sukcesu (Success)**: Kompletny, przejrzysty widok danych z pełną hierarchią optyczną.
4. **Stan częściowego sukcesu (Partial Success)**: Np. 18 z 20 stron odczytano pomyślnie, 2 strony wymagają weryfikacji ręcznej z powodu słabej jakości skanu.
5. **Stan błędu (Error)**: Komunikat w języku polskim ze wskazaniem przyczyny i możliwością ponowienia próby (Retry).
6. **Stan braku dostępu (Unauthorized / Forbidden)**: Jasna informacja o braku uprawnień bez ujawniania metadanych sprawy.
7. **Stan skrajnych treści (Stress / Overflow)**: Poprawne zachowanie przy bardzo długiej sygnaturze (np. 50 znaków), wielostronicowym petitum, setkach załączników.
8. **Dostępność i nawigacja klawiaturą**: Widoczny focus ring, skróty klawiszowe, poprawny kontrast WCAG 2.2 AA.

## 3. Rzeczywista Weryfikacja Wizualna (Visual QA)
- **Zakaz deklarowania jakości „na oko” z kodu**: Sam brak błędów w kompilacji TypeScriptu nie oznacza, że interfejs wygląda dobrze.
- Weryfikacja wizualna wymaga:
  - Uruchomienia aplikacji w przeglądarce (narzędzie browser / puppeteer).
  - Wykonania zrzutów ekranu w rozdzielczościach roboczych (1280x800 laptop, 1920x1080 monitor, mobile viewport).
  - Weryfikacji: łamanie wierszy w języku polskim, wysokość kontrolek (min. 40px), czytelność tekstu dokumentu, płynność przewijania split-screen.

## 4. Ewaluacja Jakości AI (AI Verification Protocol)
Sprawdzanie pipeline'u AI nie kończy się na parsowaniu JSON. Obejmuje:
- **Zgodność z aktami (Fact Faithfulness)**: Czy każde wyekstrahowane twierdzenie ma pokrycie w tekście sprawy?
- **Kompletność faktów (Recall)**: Czy kluczowe daty (doręczenie, termin płatności) nie zostały pominięte?
- **Jakość i trafność zarzutów**: Czy zaproponowane zarzuty są adekwatne procesowo i oparte na polskich przepisach?
- **Odporność na złośliwe wstrzyknięcie tekstu (Prompt Injection Resilience)**.

## 5. Raportowanie Statusów i Bramki Wydania
- Dopuszczalne statusy testów: `PASS`, `FAIL`, `NOT TESTED`.
- Nigdy nie oznaczamy testu jako `PASS`, jeśli nie został fizycznie uruchomiony w środowisku.
- Każde wydanie musi spełnić Bramkę Jakości (Quality Gate): zero błędów TypeScript, zielone testy jednostkowe, sprawdzony eksport DOCX, audyt bezpieczeństwa RLS.
