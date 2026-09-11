---
name: sprawista-ai-pipeline
description: >-
  Projektuje kontrolowany, wieloetapowy proces analizy, wyszukiwania, generowania i weryfikacji pism prawnych.
  Używaj tego skilla przy implementacji promptów, schematów Zod, walidacji wyjść LLM, limitów kosztów i testów modeli.
---

# Skill: sprawista-ai-pipeline (Wieloetapowy Pipeline Analityczno-Generatywny AI)

Odpowiada za architekturę pipeline'u sztucznej inteligencji w Sprawiście. Zastępuje niebezpieczne podejście „jeden gigantyczny prompt” modularnym, sekwencyjnym łańcuchem typowanych kroków z pełną weryfikacją danych wyjściowych.

## 1. Kiedy Uruchamiać (Triggers)
- Przy implementacji serwisów orkiestracji AI (`src/infrastructure/ai/`).
- Przy projektowaniu i modyfikacji promptów systemowych i schematów walidacji odpowiedzi modelu.
- Przy optymalizacji kosztów tokenów, doborze modeli (Gemini / Claude / OpenAI) i obsłudze limitów API (Rate Limits).

## 2. Wymagane Dane Wejściowe
- Ustrukturyzowane fragmenty akt (`document_chunks`).
- Kontekst etapu (np. analiza wstępna, generowanie zarzutów, redakcja uzasadnienia).
- Schemat wyjściowy Zod definiujący ścisły kontrakt danych.

## 3. Procedura Krok po Kroku
1. **Wieloetapowa Architektura Kroków (Multi-Step Pipeline)**:
   - **Krok 1: Klasyfikacja i Ekstrakcja Encji**: Wyodrębnienie stron, kwot, dat, numerów faktur i umów do schematu `CaseEntitiesSchema`.
   - **Krok 2: Oś Czasu Faktów**: Ekstrakcja chronologii z przypisaniem źródeł do schematu `TimelineEventsSchema`.
   - **Krok 3: Analiza Żądań i Rozbicie Roszczeń**: Podział pozwu na roszczenie główne, odsetkowe i koszty do schematu `ClaimBreakdownSchema`.
   - **Krok 4: Generowanie Zarzutów Procesowych**: Sformułowanie zarzutów (przedawnienie, potrącenie, brak wykazania) wraz z dowodami.
   - **Krok 5: Redakcja Projektu Pisma**: Złożenie odpowiedzi na pozew zgodnie z polską strukturą procesową (art. 126 i 128 K.p.c.).
   - **Krok 6: Weryfikacja i Cytowania**: Automatyczne sprawdzenie, czy każde powołanie dowodowe istnieje w aktach.
2. **Ścisłe Typowanie Struktur (Zod Structured Outputs)**:
   - Każde wywołanie LLM musi korzystać z mechanizmu Structured Outputs / JSON Schema.
   - Odpowiedź modelu jest natychmiast walidowana przez schemat `Zod`. W przypadku błędu walidacji następuje maksymalnie jedna próba samonaprawy (Self-Correction Retry) z przekazaniem błędu walidacji.
3. **Zarządzanie Kosztami i Limitami (Budżet Tokenów)**:
   - Zastosuj podział na modele ekonomiczne (do wstępnej klasyfikacji i filtrowania fragmentów) oraz modele flagowe (do końcowej redakcji argumentacji prawnej).
   - Śledź i zapisuj liczbę zużytych tokenów (`input_tokens`, `output_tokens`) oraz koszt w rekordzie sprawy.
4. **Odporność na Błędy Dostawców (Resilience)**:
   - Implementuj automatyczny retry z wykładniczym opóźnieniem (Exponential Backoff z Jitterem) dla błędów sieciowych i kodów 429/503.

## 4. Wymagany Wynik
- W pełni przetestowany serwis pipeline'u AI zwracający silnie typowane obiekty.
- Zapewniona powtarzalność i brak halucynacji w schemacie danych.

## 5. Warunki Odrzucenia Wyniku
- Próba realizacji całego procesu w jednym zapytaniu bez kroków pośrednich.
- Użycie promptu bez schematu walidacji i parsowanie tekstu za pomocą niestabilnych wyrażeń regularnych.
- Brak obsługi błędów przekroczenia limitu tokenów (Context Window Overflow).

## 6. Sposób Weryfikacji
- Test jednostkowy pipeline'u z wykorzystaniem mocków odpowiedzi LLM.
- Test regresyjny weryfikujący poprawność parsowania wyjścia modelu.

## 7. Odnośniki do Materiałów
- Reguła: [03-engineering.md](../../rules/03-engineering.md)
- Reguła: [04-legal-provenance.md](../../rules/04-legal-provenance.md)
- Architektura AI: [architecture/ai-pipeline.md](../../../docs/architecture/ai-pipeline.md)
