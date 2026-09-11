---
name: sprawista-art-direction
description: >-
  Przekłada cel produktu na konkretną kompozycję, hierarchię optyczną, materiały, typografię, proporcje i ruch w standardzie Editorial Precision.
  Używaj tego skilla przed implementacją widoków interfejsu, layoutów, kart dokumentu i systemów tokenów stylistycznych.
---

# Skill: sprawista-art-direction (Kierunek Wizualny Editorial Precision)

Odpowiada za spójność estetyczną, unikalny charakter i rygor wizualny Sprawisty. Zapewnia, że aplikacja wygląda jak zaawansowane narzędzie redakcyjno-analityczne, a nie generyczny szablon AI.

## 1. Kiedy Uruchamiać (Triggers)
- Przed projektowaniem nowego ekranu, widoku lub komponentu nadrzędnego.
- Gdy zachodzi potrzeba modyfikacji palety kolorów, typografii lub tokenów stylistycznych.
- Podczas audytu wizualnego mającego wyeliminować szablony, klisze i błędy kompozycyjne.

## 2. Wymagane Dane Wejściowe
- Rola ekranu i kontekst pracy użytkownika (np. przegląd akt, edycja pisma, raport braków).
- Rozdzielczość docelowa (standard bazowy: 1280x800 laptop, 1440x900 desktop).
- Istniejące tokeny z `docs/design/tokens.md`.

## 3. Procedura Krok po Kroku
1. **Definicja Hierarchii Informacji**:
   - Wyznacz jeden główny punkt skupienia (Focus Object) na ekranie.
   - Uporządkuj elementy w naturalnej kolejności czytania (od lewej do prawej, od góry do dołu).
2. **Aplikacja Palety Editorial Precision**:
   - Tło obszaru roboczego: `#F6F5F1` (ciepły papier).
   - Arkusz dokumentu: `#FFFFFF` z subtelnym obrysem `border-neutral-200`.
   - Główny tekst: `#172338` (głęboki atrament).
   - Akcent interaktywny i cytowania: `#355CFF` (precyzyjny kobalt).
3. **Konfiguracja Rytmu Typograficznego**:
   - Zastosuj `Newsreader` dla tytułów sekcji i nagłówków pism.
   - Zastosuj `Manrope` dla kontrolek, tabel, etykiet i metadanych.
   - Ustaw czytelną interlinię (1.5 dla tekstu ciągłego).
4. **Weryfikacja Kontrastu i Dostępności**:
   - Zmierz współczynnik kontrastu tekstu do tła (minimum 4.5:1, zalecane >7:1).
   - Dodaj jednoznaczne stany `:focus-visible`, `:hover`, `:active`.
5. **Audyt Eliminacji Klisz**:
   - Sprawdź, czy na ekranie nie pojawiły się: młotki, wagi, świecące gradienty AI, fioletowe kule, przypadkowe bento.

## 4. Wymagany Wynik
- Udokumentowana specyfikacja widoku: hierarchia, siatka, tokeny barwne, typografia.
- Zestaw klas Tailwind lub definicja komponentów gotowa do przekazania do skilla `sprawista-frontend`.

## 5. Warunki Odrzucenia Wyniku
- Wykorzystanie fioletowo-różowych gradientów jako wskaźnika „nowoczesności AI”.
- Szary tekst o niskim kontraście uniemożliwiający czytanie na ekranie laptopa.
- Umieszczenie więcej niż dwóch rodzin krojów pism.

## 6. Sposób Weryfikacji
- Weryfikacja zgodności z regułą `02-art-direction.md`.
- Zrzut ekranu w Puppeteer porównany z wytycznymi w `QUALITY_GATES.md`.

## 7. Odnośniki do Materiałów
- Reguła: [02-art-direction.md](../../rules/02-art-direction.md)
- Tokeny projektowe: [tokens.md](../../../docs/design/tokens.md)
