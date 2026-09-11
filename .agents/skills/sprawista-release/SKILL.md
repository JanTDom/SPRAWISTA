---
name: sprawista-release
description: >-
  Przygotowuje wdrożenia produkcyjne, migracje bazodanowe, konfigurację środowisk, monitoring, plan wycofania (rollback) i weryfikację adresu live.
  Używaj tego skilla przed publikacją nowej wersji na Vercel/Supabase, przy wdrażaniu zmian w schemacie danych i testach po wdrożeniu.
---

# Skill: sprawista-release (Procedura Wdrożenia, Migracji i Rollbacku)

Odpowiada za bezpieczne, bezprzestojowe wydanie nowej wersji Sprawisty na produkcję. Eliminuje ryzyko awarii, utraty spójności bazy danych lub niedostępności systemu dla pracujących kancelarii.

## 1. Kiedy Uruchamiać (Triggers)
- Przygotowanie wydania do środowiska stagingowego lub produkcyjnego.
- Wdrażanie nowych migracji PostgreSQL w Supabase.
- Konfiguracja zmiennych środowiskowych i domen na Vercel.

## 2. Wymagane Dane Wejściowe
- Tag wydania lub commit na gałęzi `main`.
- Raport spełnienia bramek jakości z `QUALITY_GATES.md`.
- Lista migracji bazy danych i zmian w zmiennych środowiskowych.

## 3. Procedura Krok po Kroku
1. **Weryfikacja Bramek Jakości Przed Wydaniem (Pre-Flight Checks)**:
   - Sprawdź kompilację typów: `npm run typecheck` -> `PASS`.
   - Sprawdź linter i formatowanie: `npm run lint` -> `PASS` (zero błędów i ostrzeżeń).
   - Uruchom testy jednostkowe i integracyjne: `npm test` -> `PASS`.
2. **Procedura Bezpiecznej Migracji Bazy Danych (Supabase Migrations)**:
   - Zastosuj podejście kompatybilności wstecznej (Expand and Contract pattern):
     1. Dodaj nowe kolumny lub tabele z wartościami domyślnymi.
     2. Wdróż nowy kod aplikacji korzystający z nowych struktur.
     3. Dopiero w kolejnym wydaniu usuń przestarzałe elementy.
   - Wykonaj kopię zapasową (snapshot) przed migracją w środowisku produkcyjnym.
3. **Wdrożenie Aplikacji (Vercel Deployment)**:
   - Wdróż wersję preview i zweryfikuj działanie zmiennych środowiskowych.
   - Po pomyślnym teście preview przeprowadź promocję na produkcję.
4. **Weryfikacja Działającego Adresu (Post-Deployment Smoke Test)**:
   - Odpytaj endpoint stanu systemu: `curl -f https://sprawista.pl/api/health` -> `status: 200 OK`.
   - Zaloguj się na konto testowe i utwórz próbną sprawę syntetyczną.
   - Sprawdź, czy webhooki Stripe i zadania Trigger.dev odpowiadają poprawnie.
5. **Procedura Awaryjnego Wycofania (Rollback Plan)**:
   - W razie krytycznej awarii natychmiast przełącz ruch na poprzednie stabilne wdrożenie na Vercel (Instant Rollback < 1 minuty).
   - Wycofaj migrację bazy danych za pomocą przygotowanego skryptu `down.sql`.
   - Poinformuj zespół i zarejestruj incydent w `PROJECT_STATE.md`.

## 4. Wymagany Wynik
- Nowa wersja działająca stabilnie pod adresem produkcyjnym ze statusem `HEALTHY`.
- Zaktualizowany rejestr wydań i stan projektu.

## 5. Warunki Odrzucenia Wyniku
- Próba wdrożenia na produkcję bez przejścia testów i bramek jakości.
- Migracje niszczące istniejące dane użytkowników (np. `DROP TABLE` bez migracji wstecznej).
- Brak przygotowanego planu wycofania przed rozpoczęciem deploymentu.

## 6. Sposób Weryfikacji
- Weryfikacja kodu odpowiedzi HTTP 200 z adresu produkcyjnego.
- Test E2E sprawdzający przejście kluczowej ścieżki użytkownika na środowisku produkcyjnym.

## 7. Odnośniki do Materiałów
- Bramki jakości: [QUALITY_GATES.md](../../../QUALITY_GATES.md)
- Procedura operacyjna: [docs/operations/deployment.md](../../../docs/operations/deployment.md)
