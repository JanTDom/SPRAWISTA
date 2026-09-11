---
name: sprawista-product
description: >-
  Pilnuje zakresu produktu, głównej ścieżki użytkownika, realnej wartości biznesowej i priorytetów Sprawisty.
  Używaj tego skilla przy planowaniu funkcjonalności, definiowaniu wymagań, weryfikacji zakresu MVP i odrzucaniu funkcji rozpraszających pierwszy proces.
---

# Skill: sprawista-product (Zarządzanie Zakresem i Wartością Biznesową)

Ten skill odpowiada za utrzymanie dyscypliny produktowej Sprawisty. Zapewnia, że każda implementowana funkcja bezpośrednio służy pierwszemu procesowi: przygotowaniu odpowiedzi na pozew o zapłatę z umowy cywilnej lub gospodarczej.

## 1. Kiedy Uruchamiać (Triggers)
- Przed rozpoczęciem pracy nad nową funkcjonalnością lub epikiem.
- Gdy pojawia się propozycja rozszerzenia zakresu (scope creep), np. dodanie obsługi spraw karnych, czatu ogólnego, fakturowania.
- Przy ustalaniu priorytetów zadań i definiowaniu kryteriów akceptacji dla użytkownika prawnika.

## 2. Wymagane Dane Wejściowe
- Opis proponowanej funkcji lub zmiany.
- Zidentyfikowana rola użytkownika (adwokat, radca prawny, aplikant, asystent).
- Uzasadnienie, jak zmiana wpływa na: czas sporządzenia odpowiedzi na pozew, jakość argumentacji lub redukcję ryzyka błędu procesowego.

## 3. Procedura Krok po Kroku
1. **Weryfikacja z Filtrem MVP**:
   - Czy funkcja jest niezbędna do przejścia ścieżki: *Wgranie akt -> Ekstrakcja faktów -> Zarzuty i dowody -> Analiza przeciwna -> Edycja pisma -> Eksport DOCX*?
   - Jeśli NIE: odrzuć lub przenieś do `docs/product/backlog.md` z uzasadnieniem.
2. **Definicja Wpływu na Doświadczenie Prawnika**:
   - Określ, czy funkcja zmniejsza obciążenie poznawcze (cognitive load).
   - Upewnij się, że zachowana jest zasada: „Prawnik decyduje, system dokumentuje”.
3. **Specyfikacja Wymagań Użytkownika**:
   - Zdefiniuj kryteria akceptacji w formacie Given-When-Then.
   - Uwzględnij specyfikę polskiej procedury cywilnej (K.p.c., prekluzja dowodowa, terminy).
4. **Synchronizacja Dokumentacji**:
   - Zaktualizuj `docs/product/scope.md` oraz `PROJECT_STATE.md`.

## 4. Wymagany Wynik
- Zwięzła specyfikacja funkcji z kryteriami akceptacji i zakresem danych.
- Jawne wskazanie, co NIE wchodzi w zakres danego zadania.

## 5. Warunki Odrzucenia Wyniku
- Propozycja wprowadza ogólnego bota bez powiązania z kartami akt.
- Propozycja obiecuje „automatyczne wygranie sprawy” lub sztuczne prawdopodobieństwo sukcesu.
- Zadanie dotyczy dziedzin wyłączonych z MVP (prawo karne, rodzinne, administracyjne).

## 6. Sposób Weryfikacji
- Weryfikacja zgodności z regułą `01-product-scope.md`.
- Potwierdzenie, że planowana funkcja nie łamie granic architektonicznych i bezpieczeństwa.

## 7. Odnośniki do Materiałów
- Reguła: [01-product-scope.md](../../rules/01-product-scope.md)
- Rejestr decyzji: [DECISIONS.md](../../../DECISIONS.md)
