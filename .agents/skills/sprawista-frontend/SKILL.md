---
name: sprawista-frontend
description: >-
  Buduje modularny interfejs React / Next.js App Router zgodnie z zaakceptowanym systemem wizualnym Editorial Precision.
  Używaj tego skilla przy implementacji komponentów, widoków, formularzy, nawigacji oraz pilnowaniu granic server/client i dostępności.
---

# Skill: sprawista-frontend (Inżynieria Interfejsu React i Next.js)

Odpowiada za implementację czystego, dostępnego i wysoce wydajnego frontendu Sprawisty w oparciu o Next.js App Router, React Server Components i Tailwind CSS.

## 1. Kiedy Uruchamiać (Triggers)
- Przy tworzeniu lub modyfikacji komponentów UI w katalogu `src/presentation/`.
- Przy budowie nowych widoków tras w katalogu `src/app/`.
- Przy integracji stanu interaktywnego, formularzy lub wywołań Server Actions.

## 2. Wymagane Dane Wejściowe
- Specyfikacja ekranu lub komponentu zgodna z `02-art-direction.md`.
- Kontrakt typów danych (modele domenowe z `src/domain/`).
- Wymagane stany interakcji (Standard 7 Stanów: pusty, ładowanie, sukces, błąd itd.).

## 3. Procedura Krok po Kroku
1. **Wyznaczenie Granicy Serwer / Klient**:
   - Domyślnie utwórz komponent jako Server Component (pobieranie danych, renderowanie szkieletu).
   - Wydziel interaktywne elementy (np. przycisk akcji, przełącznik widoku, modal) do osobnych plików z dyrektywą `'use client'`.
2. **Implementacja Standardu 7 Stanów UI**:
   - Przygotuj stan ładowania: szkielet (`Skeleton`) z zachowaniem geometrii docelowej.
   - Obsłuż stan pusty (`EmptyState`) z precyzyjnym wezwaniem do działania w języku polskim.
   - Obsłuż stan błędu z możliwością ponowienia (`ErrorState` + przycisk „Spróbuj ponownie”).
3. **Zapewnienie Pełnej Dostępności (WCAG 2.2 AA)**:
   - Zastosuj semantyczne tagi HTML5 (`<main>`, `<nav>`, `<article>`, `<section>`, `<header>`).
   - Dodaj etykiety `aria-label` dla przycisków ikonowych.
   - Zapewnij widoczny i estetyczny pierścień fokusu (`focus-visible:ring-2 focus-visible:ring-[#355CFF]`).
4. **Zarządzanie Stanem i Przejściami**:
   - Stosuj `useTransition` lub Server Actions dla mutacji danych, aby uniknąć blokowania wątku UI.
   - Zapobiegaj utracie wpisanych danych w formularzach (ochrona przed przypadkowym odświeżeniem).

## 4. Wymagany Wynik
- Kompletny, modularny komponent w TypeScript w trybie strict.
- Czysty kod bez niepotrzebnych re-renderów, zdefiniowane typy Props z `readonly`.

## 5. Warunki Odrzucenia Wyniku
- Komponent jest gigantycznym plikiem powyżej 300 linii łączącym pobieranie danych, logikę biznesową i renderowanie.
- Użycie dyrektywy `'use client'` na najwyższym poziomie widoku bez uzasadnienia.
- Brak obsługi stanów błędów lub pustych danych.

## 6. Sposób Weryfikacji
- Kompilacja TypeScript: `tsc --noEmit`.
- Sprawdzenie braku ostrzeżeń lintera ESLint.
- Weryfikacja działania w przeglądarce za pomocą Puppeteer.

## 7. Odnośniki do Materiałów
- Reguła: [03-engineering.md](../../rules/03-engineering.md)
- Reguła: [06-quality-and-release.md](../../rules/06-quality-and-release.md)
- Architektura: [architecture/frontend.md](../../../docs/architecture/frontend.md)
