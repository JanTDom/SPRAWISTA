# 01-product-scope: Zakres Produktu i Główny Proces

## 1. Zakres Wersji Pierwszej (MVP / Core V1)
Głównym i jedynym procesem wersji startowej jest:
**Przygotowanie odpowiedzi na pozew o zapłatę wynikającą z umowy w procesie cywilnym lub gospodarczym (K.p.c.).**

### Dlaczego ten proces?
- Jest to najczęstszy, powtarzalny, a jednocześnie czasochłonny typ spraw w małych i średnich kancelariach obsługujących B2B.
- Zawiera pełen cykl dowodowy: umowa, aneksy, zamówienia, protokoły odbioru, faktury VAT, korespondencja e-mail, wezwania do zapłaty, potwierdzenia przelewów.
- Wymaga natychmiastowej dyscypliny terminowej (14 dni na odpowiedź na pozew) oraz rygoru prekluzji dowodowej (art. 458[5] K.p.c. w postępowaniu gospodarczym).

## 2. Główny Przepływ Użytkownika (End-to-End User Journey)
1. **Nowa Sprawa i Wgranie Akt**:
   - Prawnik tworzy sprawę: Sygnatura, Sąd, Strona (Pozwany), Powód, Wartość Przedmiotu Sporu (WPS).
   - Wgrywa pliki PDF (pozew z załącznikami, dokumentacja własna klienta).
2. **Ekstrakcja i Raport Kompletności**:
   - System przetwarza dokumenty, identyfikuje jakość warstwy tekstowej, uruchamia selektywny OCR dla skanów.
   - Prawnik widzi raport: liczba stron, rozpoznane dokumenty, strony nieczytelne lub wymagające uwagi.
3. **Uporządkowane Fakty i Oś Czasu (Chronologia)**:
   - Ekstrakcja zdarzeń z podziałem na: twierdzenie powoda, treść dokumentu, fakt bezsporny, fakt sporny.
   - Interaktywna oś czasu z odnośnikami do kart akt.
4. **Mapa Sporu i Katalog Zarzutów**:
   - Identyfikacja roszczeń pozwu (kapitał, odsetki, koszty).
   - Proponowane zarzuty formalne i merytoryczne (np. brak legitymacji, przedawnienie, nienależyte wykonanie, potrącenie, brak wymagalności).
5. **Konstrukcja Argumentacji i Zestawienie Dowodów**:
   - Połączenie każdego zarzutu z konkretnymi dowodami (np. dowód z dokumentu na karcie X).
   - Sprawdzenie aktualnego brzmienia przepisów (K.c., K.p.c.) na moment zaistnienia zdarzenia.
6. **Analiza Przeciwna (Adversarial Review)**:
   - System symuluje ripostę pełnomocnika powoda: jakie słabości ma nasza linia obrony? Jakie dowody mogą zostać zakwestionowane?
7. **Edytor i Weryfikacja Projektu Pisma**:
   - Dzielony ekran: po lewej projekt pisma z zachowaniem wymogów formalnych art. 126 i 128 K.p.c., po prawej wgląd w powiązane karty akt.
   - Prawnik modyfikuje, akceptuje lub odrzuca fragmenty.
8. **Eksport do DOCX**:
   - Wygenerowanie gotowego, czystego pliku Word z zachowaniem standardów typograficznych polskiego pisma procesowego (paginacja, nagłówek sądu, oznaczenie stron, osnowa, uzasadnienie, lista załączników).

## 3. Granice Produktu — Co Odrzucamy w MVP
- **Brak spraw karnych, rodzinnych i administracyjnych.**
- **Brak automatycznego wysyłania pism do portali sądowych.**
- **Brak ogólnego czatu prawniczego typu "pogadaj z kodeksem".**
- **Brak portalu dla klienta końcowego kancelarii w fazie pierwszej.**
- **Brak zautomatyzowanego wystawiania faktur za czynności prawne.**
- **Brak integracji z zewnętrznymi kalendarzami przed dopracowaniem rdzenia pisma.**

## 4. Kryteria Sukcesu Produktowego
- **Dokładność Źródeł**: 100% cytowań i powołań dowodowych w projekcie pisma musi wskazywać rzeczywisty dokument w aktach sprawy.
- **Czas Przygotowania Szkicu**: Redukcja wstępnego czasu analizy i zestawienia faktów z 4–6 godzin do poniżej 30 minut.
- **Satysfakcja Prawnika**: Prawnik otrzymuje pismo o strukturze profesjonalnej, w którym nanosi korekty merytoryczne zamiast formatować dokument od zera.
