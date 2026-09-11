---
name: sprawista-evidence-and-law
description: >-
  Rozdziela twierdzenia, dowody i oceny prawne. Buduje powiązania ze źródłami, obsługuje wersje aktów prawnych i wykrywa brak podstaw do wniosku.
  Używaj tego skilla przy analizie stanu faktycznego, kwalifikacji prawnej zarzutów, budowie osi czasu i weryfikacji powołań ustawowych.
---

# Skill: sprawista-evidence-and-law (Fakty, Dowody i Reżim Prawny)

Odpowiada za ścisłą metodologię prawniczą Sprawisty. Zapewnia właściwe rozróżnienie twierdzeń stron od obiektywnych dowodów, weryfikuje temporalny stan prawny oraz egzekwuje rygor prekluzji dowodowej.

## 1. Kiedy Uruchamiać (Triggers)
- Podczas ekstrakcji faktów i tworzenia chronologicznej osi czasu sprawy.
- Podczas formułowania katalogu zarzutów formalnych i merytorycznych do odpowiedzi na pozew.
- Przy sprawdzaniu aktualności i brzmienia przepisów (K.c., K.p.c., ustawy o terminach zapłaty w transakcjach handlowych).

## 2. Wymagane Dane Wejściowe
- Wyekstrahowana treść pozwu oraz załączników z przypisanymi identyfikatorami `chunkId`.
- Data wniesienia pozwu, data zawarcia umowy oraz data wymagalności roszczenia.
- Reżim postępowania: proces cywilny ogólny czy postępowanie gospodarcze (art. 458[1] i nast. K.p.c.).

## 3. Procedura Krok po Kroku
1. **Separacja Statusów Ontologicznych Informacji**:
   - Skategoryzuj każde zdarzenie jako: `CLAIM_CLAIMANT`, `CLAIM_DEFENDANT`, `DOCUMENT_CONTENT`, `RULING_FINDING`, `AI_HYPOTHESIS`.
   - Zapewnij, że żadne twierdzenie strony przeciwnej nie zostanie opisane jako fakt bezsporny bez potwierdzenia w aktach lub przyznania.
2. **Egzekwowanie Prekluzji Dowodowej (art. 458[5] K.p.c.)**:
   - Jeśli sprawa toczy się w trybie gospodarczym: wygeneruj ostrzeżenie i listę kontrolną, że wszelkie twierdzenia i dowody muszą być zgłoszone w odpowiedzi na pozew pod rygorem utraty prawa ich powoływania w toku sprawy.
3. **Analiza Podstaw Prawnych i Weryfikacja Intertemporalna**:
   - Sprawdź właściwe brzmienie przepisu według daty zdarzenia (np. właściwe stawki odsetek za opóźnienie w transakcjach handlowych na dany kwartał).
   - Skonsultuj rejestr aktów prawnych (Sejm ELI API).
4. **Identyfikacja Luk Dowodowych**:
   - Dla każdego zarzutu (np. zarzut nienależytego wykonania umowy, zgłoszenie wady w terminie, zarzut potrącenia) sprawdź, czy w aktach istnieje dowód (np. pismo reklamacyjne z dowodem nadania).
   - W przypadku braku dowodu: wygeneruj jawny znacznik luki dowodowej oraz propozycję wniosku dowodowego (np. przesłuchanie świadka, zobowiązanie powoda do złożenia dokumentu — art. 248 K.p.c.).

## 4. Wymagany Wynik
- Struktura `CaseFactsGraph` łącząca fakty z dokumentami źródłowymi.
- Raport zarzutów procesowych z przypisanymi podstawami prawnymi i dowodami.

## 5. Warunki Odrzucenia Wyniku
- Przyjęcie twierdzenia powoda o wykonaniu usługi za fakt bez dowodu w postaci podpisanego protokołu odbioru.
- Zacytowanie nieistniejącego artykułu ustawy lub zmyślonej tezy Sądu Najwyższego.
- Zastosowanie aktualnych przepisów o odsetkach do okresów, w których obowiązywały inne stawki.

## 6. Sposób Weryfikacji
- Test logiczny grafu dowodowego sprawdzający obecność referencji źródłowej dla każdego faktu.
- Porównanie powołanych przepisów z oficjalnym słownikiem ISAP / ELI API.

## 7. Odnośniki do Materiałów
- Reguła: [04-legal-provenance.md](../../rules/04-legal-provenance.md)
- Dokumentacja: [architecture/legal-model.md](../../../docs/architecture/legal-model.md)
