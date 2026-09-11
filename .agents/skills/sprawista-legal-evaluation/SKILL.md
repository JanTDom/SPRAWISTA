---
name: sprawista-legal-evaluation
description: >-
  Utrzymuje zestawy testów jakości analizy prawnej i pracy na aktach. Rozdziela zbiory rozwojowe od walidacyjnych oraz ocenę modelu od oceny prawnika.
  Używaj tego skilla przy ewaluacji promptów, mierzeniu dokładności ekstrakcji, testach odporności na błędy merytoryczne i benchmarkach prawniczych.
---

# Skill: sprawista-legal-evaluation (Ewaluacja Jakości Prawnej i Benchmarki Aktowe)

Odpowiada za rygorystyczny pomiar jakości merytorycznej analizy spraw w Sprawiście. Gwarantuje, że optymalizacje modeli i promptów nie obniżają standardu procesowego i nie wprowadzają ukrytych błędów prawnych.

## 1. Kiedy Uruchamiać (Triggers)
- Przy zmianie modeli bazowych AI (np. przejście na nowszą wersję Gemini, Claude, GPT).
- Przy modyfikacji promptów systemowych w pipeline analitycznym.
- W ramach regularnej ewaluacji skuteczności wykrywania zarzutów i dowodów.

## 2. Wymagane Dane Wejściowe
- Zbiór testowy spraw syntetycznych ze zdefiniowaną „prawdą odniesienia” (Ground Truth sporządzoną przez radcę prawnego).
- Rozdzielone zbiory danych:
  - **Zbiór Rozwojowy (Dev Set)**: 10 spraw do iteracyjnego dopracowywania promptów.
  - **Zbiór Walidacyjny (Validation/Test Set)**: 20 spraw ukrytych, wykorzystywanych wyłącznie do finalnej weryfikacji.

## 3. Procedura Krok po Kroku
1. **Automatyczny Pomiar Metryk Ekstrakcji (Automated Metrics)**:
   - **Precyzja Identyfikacji Faktów (Precision)**: Odsetek poprawnie wyekstrahowanych faktów w stosunku do wszystkich zgłoszonych.
   - **Kompletność Zdarzeń (Recall)**: Czy z pozwu i załączników wyciągnięto wszystkie istotne daty i kwoty?
   - **Wskaźnik Zmyślonych Cytowań (Hallucination Rate)**: Bezwzględny wymóg = `0.0%`. Ani jedno zmyślone orzeczenie lub artykuł.
2. **Procedura Oceny Przez Niezależnego Prawnika (Human-in-the-Loop Evaluation)**:
   - Przekaż anonimizowany projekt odpowiedzi na pozew niezależnemu adwokatowi lub radcy prawnemu.
   - Ocena w skali 1–5 w kryteriach:
     1. Poprawność formalna (spełnienie art. 126 i 128 K.p.c.);
     2. Trafność i siła podniesionych zarzutów;
     3. Spójność logiczna i styl argumentacji;
     4. Gotowość do złożenia w sądzie po drobnych poprawkach.
3. **Izolacja Danych Walidacyjnych**:
   - Sprawy ze zbioru walidacyjnego nie mogą być używane w promptach jako przykłady (Few-Shot Prompting), aby uniknąć przeuczenia (data contamination).
4. **Raport Jakości Merytorycznej**:
   - Zapisz wyniki w `docs/quality/legal-eval-report.md`.

## 4. Wymagany Wynik
- Raport z wynikami ewaluacji zawierający wskaźniki Precision, Recall, Hallucination Rate oraz średnią ocenę prawnika.
- Decyzja: akceptacja zmian (`PASS`) lub odrzucenie (`FAIL`).

## 5. Warunki Odrzucenia Wyniku
- Wskaźnik halucynacji wyższy niż 0.0% w zbiorze walidacyjnym.
- Pominięcie zarzutu przedawnienia w sprawie, w której upłynął 3-letni termin dla roszczeń gospodarczych.
- Zmiana promptu przetestowana wyłącznie na jednej, prostej sprawie.

## 6. Sposób Weryfikacji
- Uruchomienie skryptu ewaluacyjnego porównującego wyjście pipeline'u z Ground Truth.
- Audyt braku wycieku danych ze zbioru walidacyjnego do kodu promptów.

## 7. Odnośniki do Materiałów
- Reguła: [04-legal-provenance.md](../../rules/04-legal-provenance.md)
- Reguła: [06-quality-and-release.md](../../rules/06-quality-and-release.md)
- Zestawy testowe: [docs/quality/eval-datasets.md](../../../docs/quality/eval-datasets.md)
