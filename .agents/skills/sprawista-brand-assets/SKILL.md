---
name: sprawista-brand-assets
description: >-
  Projektuje znak marki, wordmark, grafikę hero, favicon, ikony i grafiki OpenGraph.
  Używaj tego skilla przy tworzeniu zasobów graficznych, generowaniu ilustracji koncepcyjnych oraz budowaniu spójnej tożsamości wizualnej Sprawisty.
---

# Skill: sprawista-brand-assets (Zasoby Wizualne i Znak Marki)

Odpowiada za projekt i generowanie unikalnych, autorskich materiałów graficznych marki Sprawista: znaku graficznego, typograficznego wordmarku, ilustracji hero oraz zasobów aplikacji (favicon, ikony, karty społecznościowe).

## 1. Kiedy Uruchamiać (Triggers)
- Przy tworzeniu lub modyfikacji znaku graficznego (logo), sygnetu, wordmarku.
- Przy generowaniu grafiki sekcji głównej (Hero Section) lub ilustracji stanów pustych (Empty States).
- Przy przygotowywaniu plików favicon (SVG, PNG, ICO) oraz obrazów Open Graph (`og-image.png`).

## 2. Wymagane Dane Wejściowe
- Przeznaczenie zasobu (np. sygnet w nawigacji, favicon 32x32, grafika hero 16:9).
- Wymagany format (SVG dla wektorów, PNG/WebP dla grafiki rastrowej).
- Zgodność z paletą: granat atramentowy (`#172338`), kobalt (`#355CFF`), papier (`#F6F5F1`).

## 3. Procedura Krok po Kroku
1. **Projektowanie Znaku (Logo & Sygnet)**:
   - Znak musi być oparty na czystej geometrii wektorowej (SVG), symbolizującej precyzję dowodową i porządek myśli (np. zbiegające się linie dowodowe, precyzyjny kąt wglądu w dokument).
   - Test czytelności w skrajnych rozmiarach: 16x16 px (favicon), 24x24 px (pasek menu), w jednym kolorze oraz w negatywie.
2. **Generowanie Materiałów Wizualnych (Hero & Editorial Art)**:
   - Jeśli używane jest narzędzie `generate_image`, przygotuj precyzyjny prompt:
     - Przedstawienie: kompozycja architektoniczno-papierowa, szlachetna faktura papieru czerpanego, gra światła bocznego, głębia ostrości, chłodny atrament i akcent kobaltu.
     - Zero tekstu wewnątrz generowanego obrazu.
     - Proporcje: 16:9 (Hero) lub 1:1 (Karty).
3. **Optymalizacja i Zapis Zasobów**:
   - Zapisz pliki w `public/brand/` lub `docs/design/assets/`.
   - Zoptymalizuj wagę (SVG zminifikowany, raster skompresowany bez utraty ostrości).
4. **Rejestr Praw i Źródeł**:
   - Każdy wygenerowany lub stworzony zasób musi posiadać wpis w `docs/design/assets-manifest.md` z opisem pochodzenia, promptem i licencją.

## 4. Wymagany Wynik
- Gotowe pliki wektorowe SVG lub zoptymalizowane obrazy WebP/PNG w repozytorium.
- Spójny manifest zasobów marki.

## 5. Warunki Odrzucenia Wyniku
- Znak wykorzystuje klisze: wagi Temidy, młotek sędziowski, kolumny, kodeks w skórze.
- Znak jest nieczytelny w rozmiarze faviconu (16–32 px).
- W wygenerowanym obrazie pojawił się losowy, zniekształcony tekst w sztucznym alfabecie.

## 6. Sposób Weryfikacji
- Sprawdzenie wyświetlania pliku SVG w przeglądarce w skali 16px, 24px i 120px.
- Weryfikacja braku zewnętrznych, niezaufanych hotlinków.

## 7. Odnośniki do Materiałów
- Reguła: [02-art-direction.md](../../rules/02-art-direction.md)
- Manifest zasobów: [assets-manifest.md](../../../docs/design/assets-manifest.md)
