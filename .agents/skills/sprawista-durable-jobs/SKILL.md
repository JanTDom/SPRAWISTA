---
name: sprawista-durable-jobs
description: >-
  Obsługuje kolejki i długie zadania w tle (Trigger.dev v3), idempotencję, wznowienia po błędach, anulowanie i aktualizację postępu.
  Używaj tego skilla przy implementacji asynchronicznego przetwarzania akt, selektywnego OCR, analizy wieloetapowej i rozliczania operacji.
---

# Skill: sprawista-durable-jobs (Zadania Trwałe w Tle i Odporność Operacyjna)

Odpowiada za niezawodne wykonywanie długich, zasobożernych operacji (ekstrakcja akt, OCR, łańcuchy analiz AI, generowanie DOCX) poza synchronicznym cyklem żądania HTTP, z wykorzystaniem Trigger.dev v3.

## 1. Kiedy Uruchamiać (Triggers)
- Przy tworzeniu zadań asynchronicznych trwających powyżej 3 sekund.
- Przy konfiguracji zadań Trigger.dev w katalogu `src/trigger/`.
- Przy implementacji śledzenia postępu (Progress Bar) i powiadomień o zakończeniu analizy w interfejsie użytkownika.

## 2. Wymagane Dane Wejściowe
- Definicja zadania (`taskPayload`: identyfikator sprawy, lista dokumentów, parametry analizy).
- Klucz idempotencji (`idempotencyKey`).
- Kontekst autoryzacyjny (`organizationId`, `userId`).

## 3. Procedura Krok po Kroku
1. **Definicja Trwałego Zadania (Trigger.dev Task)**:
   - Zdefiniuj zadanie z podziałem na mniejsze, audytowalne kroki (Checkpoints / Sub-tasks):
     ```typescript
     export const processCaseTask = task({
       id: "process-case-dossier",
       retry: { maxAttempts: 3, factor: 2, minTimeoutInMs: 1000 },
       run: async (payload, { ctx }) => { ... }
     });
     ```
2. **Gwarancja Idempotencji**:
   - Wygeneruj deterministyczny klucz idempotencji: `idempotencyKey = `${payload.caseId}:${payload.operation}:${payload.version}``.
   - Jeśli zadanie o danym kluczu już trwa lub zostało ukończone — zwróć istniejący status bez ponownego uruchamiania kosztownych operacji.
3. **Aktualizacja Postępu w Czasie Rzeczywistym**:
   - Raportuj stan wykonania w procentach i krokach (np. `Krok 2/5: Odczytano 14 z 20 stron...`).
   - Zapisuj postęp w bazie danych i emituj zdarzenia do frontendu (SSE lub Server Actions Polling).
4. **Obsługa Anulowania (Graceful Cancellation)**:
   - Sprawdzaj flagę anulowania (`ctx.signal.aborted`) przed przejściem do kolejnego kosztownego wywołania LLM lub OCR.
   - W razie przerwania zwolnij tymczasowe zasoby i oznacz status jako `CANCELLED`.
5. **Precyzyjne Rozliczanie Kosztów (No Double Billing)**:
   - Rejestruj faktycznie zużyte tokeny i operacje OCR dopiero po pomyślnym wykonaniu każdego kroku.
   - W przypadku ponowienia (retry) odliczaj tylko faktycznie wykonane ponowne operacje.

## 4. Wymagany Wynik
- Gotowy, przetestowany plik zadania w `src/trigger/` z obsługą błędów i wznawiania.
- Płynny wskaźnik postępu w interfejsie użytkownika.

## 5. Warunki Odrzucenia Wyniku
- Wykonywanie wielostronicowej analizy akt bezpośrednio w trasie API Next.js (`route.ts`) z ryzykiem timeoutu serwera (np. 504 Vercel limit).
- Brak klucza idempotencji powodujący wielokrotne obciążenie konta klienta przy kliknięciu przycisku.
- Połknięcie błędów (silent fail) bez powiadomienia użytkownika o przyczynie awarii.

## 6. Sposób Weryfikacji
- Test symulacji awarii sieciowej w trakcie zadania i weryfikacja automatycznego wznowienia od ostatniego punktu kontrolnego.
- Test idempotencji: dwukrotne wywołanie zadania z tym samym kluczem wykonuje kod biznesowy tylko raz.

## 7. Odnośniki do Materiałów
- Reguła: [03-engineering.md](../../rules/03-engineering.md)
- Oficjalna dokumentacja: `https://trigger.dev/docs`
- Architektura zadań: [architecture/jobs.md](../../../docs/architecture/jobs.md)
