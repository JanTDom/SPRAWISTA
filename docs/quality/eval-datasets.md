# Zestawy Testowe i Procedura Ewaluacji Prawnej (Eval Datasets)

Dokument opisuje podział zbiorów danych syntetycznych oraz procedurę oceny poprawności merytorycznej Sprawisty.

---

## 1. Zbiory Danych Syntetycznych

Zbiór | Rozmiar | Przeznaczenie | Dostęp
:--- | :--- | :--- | :---
`DEV_SET` | 10 spraw | Strojenie promptów, testy regresyjne pipeline'u AI | Dostępny dla deweloperów
`VAL_SET` | 20 spraw | Ostateczna walidacja bramek jakości przed wydaniem | Ukryty przed promptami

---

## 2. Kluczowe Metryki Sukcesu Merytorycznego
- **Wskaźnik Zmyślonych Cytowań (Hallucination Rate)**: bezwzględny cel = `0.0%`.
- **Wskaźnik Pokrycia Kluczowych Faktów (Fact Recall)**: min. `98.0%`.
- **Precyzja Identyfikacji Zarzutów (Defense Precision)**: min. `95.0%`.
- **Zgodność z Prawem i K.p.c. (Legal Compliance Score)**: ocena radcy prawnego min. 4.8 / 5.0.
