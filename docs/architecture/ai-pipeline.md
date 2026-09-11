# Architektura Pipeline'u AI (Wielokrokowa Analiza i Generowanie)

Dokument określa architekturę modularnego łańcucha modeli językowych w Sprawiście.

---

## 1. Modularny Łańcuch Zadań (Chained Execution)
Zamiast jednego obszernego zapytania, Sprawista przetwarza sprawę w ściśle kontrolowanych krokach:

1. **Ekstrakcja Encji Procesowych (`extract-entities`)**:
   - Wejście: fragmenty pozwu.
   - Wyjście: strony procesu, kwota żądana, data doręczenia, właściwy sąd.
2. **Budowa Osi Czasu i Faktów (`build-timeline`)**:
   - Wejście: wszystkie wyekstrahowane fragmenty.
   - Wyjście: chronologiczna lista zdarzeń ze statusem (`CLAIM_CLAIMANT`, `DOCUMENT_CONTENT` itd.).
3. **Analiza Roszczeń i Zarzutów (`formulate-defenses`)**:
   - Wejście: oś czasu, żądanie pozwu.
   - Wyjście: formalne i merytoryczne zarzuty procesowe powiązane z dowodami w aktach.
4. **Redakcja Projektu Pisma (`draft-pleading`)**:
   - Wejście: zarzuty, fakty bezsporne, wnioski dowodowe.
   - Wyjście: ustrukturyzowany dokument odpowiedzi na pozew w formacie JSON zgodnym z TipTap.
5. **Weryfikacja Cytowań i Linii Dowodowej (`verify-citations`)**:
   - Wejście: projekt pisma + baza chunków.
   - Wyjście: raport zgodności powołań dowodowych (100% zgodności lub oznaczenie braków).

---

## 2. Gwarancja Ścisłego Typowania (Zod Schema Validation)
Każdy krok posiada odpowiadający mu schemat TypeScript z biblioteki `zod`. 
Wszelkie odchylenia struktury JSON zwracanej przez model są traktowane jako błąd typu i podlegają maksymalnie jednej procedurze naprawczej (Repair Prompt).
