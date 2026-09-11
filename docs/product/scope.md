# Specyfikacja Zakresu Produktu (Product Scope — V1 MVP)

## 1. Cel Biznesowy
Sprawista (`sprawista.pl`) to profesjonalna aplikacja webowa AI dla małych i średnich polskich kancelarii prawnych (2–20 prawników).
Jej celem jest radykalne skrócenie czasu i podniesienie jakości sporządzania **odpowiedzi na pozew o zapłatę wynikającą z umowy** w procesie cywilnym i gospodarczym.

## 2. Podstawowy Przepływ Procesowy
```
Akta sprawy (PDF/skany)
         ↓
Selektywny OCR i ekstrakcja faktów
         ↓
Oś czasu i mapa sporu (podział twierdzeń i dowodów)
         ↓
Identyfikacja roszczeń i katalog zarzutów procesowych
         ↓
Wielokrokowy pipeline redakcyjny (zestawienie dowodów)
         ↓
Analiza przeciwna (symulacja riposty powoda)
         ↓
Dzielony pulpit pracy (edycja pisma + podgląd akt)
         ↓
Zatwierdzenie merytoryczne przez radcę prawnego / adwokata
         ↓
Eksport do czystego, edytowalnego pliku DOCX
```

## 3. Matryca Wymagań MVP

Moduł | Wymaganie Kluczowe | Granica Zakresu
:--- | :--- | :---
**Wgrywanie akt** | Obsługa plików PDF (do 100MB), raport kompletności odczytu | Brak OCR dla uszkodzonych plików uniemożliwiających odczyt
**Ekstrakcja** | Wydobycie kwot, terminów, stron, faktur, umów i protokołów | Brak obsługi spraw wielotomowych powyżej 500 stron w MVP
**Zarzuty** | Podstawowe zarzuty cywilne/gospodarcze (brak legitymacji, przedawnienie, wada dzieła, potrącenie, brak wymagalności) | Brak zarzutów konstytucyjnych i pytań prejudycjalnych do TSUE
**Edytor** | Split-screen ze skokami do kart akt i podświetleniem cytowań | Brak jednoczesnej pracy zespołowej na żywo (real-time multiplayer) w V1
**Eksport** | Szablon DOCX z marginesami sądowymi (3.5 cm) i paginacją | Brak bezpośredniego wnoszenia pism przez Portal Informacyjny Sądów
