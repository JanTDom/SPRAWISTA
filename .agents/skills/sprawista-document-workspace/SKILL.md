---
name: sprawista-document-workspace
description: >-
  Projektuje i implementuje pulpit pracy z dokumentem: widok akt sprawy, edytor pisma, źródła dowodowe i mapę argumentacji.
  Używaj tego skilla przy budowie dzielonego ekranu (split-screen), synchronizacji zaznaczeń, skoków do źródeł oraz ergonomii pracy na laptopie.
---

# Skill: sprawista-document-workspace (Dzielony Pulpit Pracy z Aktami i Pismem)

Odpowiada za kluczowy warsztat pracy prawnika w Sprawiście: zsynchronizowany, dzielony interfejs łączący projekt odpowiedzi na pozew z interaktywnym wglądem w akta sprawy i źródła dowodowe.

## 1. Kiedy Uruchamiać (Triggers)
- Przy implementacji i modyfikacji głównego widoku sprawy (`/cases/[id]/workspace`).
- Przy integracji edytora tekstu (TipTap) z przeglądarką dokumentów PDF i repozytorium załączników.
- Przy wdrażaniu synchronizacji zaznaczeń: kliknięcie powołania dowodowego otwiera i podświetla odpowiednią kartę akt.

## 2. Wymagane Dane Wejściowe
- Model danych sprawy: metadane, lista załączników, ustrukturyzowany projekt pisma, wyodrębnione fragmenty źródłowe (`SourceChunk`).
- Wymiary ekranu i preferencje szerokości szpalt (domyślny podział: 55% edytor pisma / 45% akta sprawy).

## 3. Procedura Krok po Kroku
1. **Architektura Split-Screen**:
   - Skonstruuj layout dwukolumnowy z możliwością płynnej zmiany proporcji (resizable divider) i zwijania prawego panelu.
   - Zadbaj o stan pamięci szerokości paneli w preferencjach sesji użytkownika.
2. **Synchronizacja Zaznaczeń (Bi-directional Linking)**:
   - Zaimplementuj niestandardowe węzły w edytorze TipTap: `<CitationBadge chunkId="..." pageNumber="..." documentId="..." />`.
   - Po kliknięciu odznaki wyemituj zdarzenie do przeglądarki akt:
     1. Załaduj właściwy dokument PDF.
     2. Przewiń do wskazanej strony (`pageNumber`).
     3. Podświetl współrzędne fragmentu (`boundingBox`).
3. **Ergonomia Pracy na Laptopie (13–14 cali)**:
   - Zapewnij skróty klawiszowe:
     - `Cmd+Option+E`: Skupienie na edytorze pisma.
     - `Cmd+Option+D`: Skupienie na podglądzie akt.
     - `Cmd+\`: Zwinięcie / rozwinięcie panelu akt w celu pisania w trybie pełnoekranowym.
4. **Niezależne Paski Przewijania**:
   - Lewy i prawy panel muszą przewijać się niezależnie, zapobiegając uciążliwemu przesuwaniu całego okna przeglądarki.

## 4. Wymagany Wynik
- W pełni funkcjonalny, responsywny komponent `DocumentWorkspace`.
- Płynne, pozbawione opóźnień przechodzenie od twierdzenia w tekście do skanu dokumentu w aktach.

## 5. Warunki Odrzucenia Wyniku
- Brak synchronizacji: kliknięcie dowodu w tekście nie wywołuje żadnej reakcji w panelu akt.
- Interfejs psuje się na ekranie MacBooka (1280x800) przez sztywno zadeklarowane szerokości w pikselach.
- Zmiana treści w edytorze zawiesza podgląd PDF.

## 6. Sposób Weryfikacji
- Test manualny i automatyczny w Puppeteer: kliknięcie odnośnika dowodowego i weryfikacja zmiany aktywnej strony w podglądzie PDF.
- Sprawdzenie braku błędów w konsoli podczas intensywnego przełączania zakładek.

## 7. Odnośniki do Materiałów
- Reguła: [02-art-direction.md](../../rules/02-art-direction.md)
- Reguła: [04-legal-provenance.md](../../rules/04-legal-provenance.md)
- Specyfikacja: [workspace-ux.md](../../../docs/design/workspace-ux.md)
