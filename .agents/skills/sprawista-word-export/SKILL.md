---
name: sprawista-word-export
description: >-
  Tworzy rzeczywiste, w pełni edytowalne pliki DOCX zgodne z wymogami polskiego sądownictwa i sprawdza ich otwieranie oraz formatowanie.
  Używaj tego skilla przy implementacji i modyfikacji generatora plików Word, stylów dokumentu procesowego, tabel dowodowych i eksportu pism.
---

# Skill: sprawista-word-export (Generator Pism Procesowych DOCX)

Odpowiada za precyzyjne generowanie gotowych do złożenia w sądzie dokumentów Microsoft Word (`.docx`). Zapewnia nienaganne formatowanie procesowe, zachowanie polskich znaków oraz poprawność struktury XML dokumentu.

## 1. Kiedy Uruchamiać (Triggers)
- Przy implementacji modułu eksportu do DOCX (`src/infrastructure/export/docx/`).
- Przy modyfikacji szablonu procesowego (marginesy, nagłówki, paginacja, interlinia).
- Podczas testów integracyjnych pobierania gotowej odpowiedzi na pozew.

## 2. Wymagane Dane Wejściowe
- Zatwierdzona treść odpowiedzi na pozew: oznaczenie sądu, wydział, sygnatura, oznaczenie stron i pełnomocników, wartość przedmiotu sporu (WPS), petitum pisma, zarzuty, uzasadnienie, spis załączników.
- Wersja dokumentu (`versionId`) i suma kontrolna treści w celu potwierdzenia integralności.

## 3. Procedura Krok po Kroku
1. **Zastosowanie Polskich Standardów Edytorskich Pisma Procesowego**:
   - **Marginesy sądowe**: lewy 35 mm (3.5 cm — margines na oprawę akt sądowych), prawy 15 mm, górny 25 mm, dolny 25 mm.
   - **Format arkusza**: A4 pionowo.
   - **Czcionka bazowa**: Times New Roman 12 pt lub Arial 11 pt (klasyczny standard polskich sądów) z interlinią 1.5 wiersza.
   - **Akapity i Justowanie**: Pełne justowanie tekstu uzasadnienia (`AlignmentType.JUSTIFIED`) z wcięciem pierwszego wiersza 1.25 cm.
2. **Budowa Struktury Pisma Procesowego**:
   - **Główka (Nagłówek prawy)**: Miejscowość i data.
   - **Adresat (Sąd)**: Wyrównany do prawej lub lewej zgodnie ze zwyczajem, pełna nazwa sądu i wydziału.
   - **Oznaczenie Sprawy i Stron**: Tabela bez obramowania z podziałem na Powoda i Pozwanego wraz z numerami PESEL/NIP/KRS i adresami.
   - **Tytuł Pisma**: Wycentrowany, pogrubiony: `ODPOWIEDŹ NA POZEW O ZAPŁATĘ`.
   - **Petitum (Wnioski procesowe)**: Punkty numerowane (np. 1. Wnoszę o oddalenie powództwa w całości; 2. Zasądzenie kosztów procesu...).
   - **Wnioski dowodowe**: Czytelne zestawienie dowodów z oznaczeniem faktów podlegających stwierdzeniu (art. 227 i art. 235[1] K.p.c.).
   - **Uzasadnienie i Podpis**: Merytoryczna argumentacja z podziałem na sekcje tematyczne oraz miejsce na podpis pełnomocnika.
   - **Załączniki**: Wyliczenie załączników z zachowaniem kolejności powołań w tekście.
3. **Generowanie Pliku przy użyciu Biblioteki `docx`**:
   - Wykorzystaj bibliotekę `docx` w Node.js.
   - Skonfiguruj numerację stron w stopce (np. `Strona 1 z 4`) z wyłączeniem pierwszej strony.
4. **Weryfikacja Integralności i Otwieralności**:
   - Potwierdź, że wygenerowany plik otwiera się bez komunikatów o uszkodzeniu w MS Word, LibreOffice Writer i Apple Pages.
   - Sprawdź obecność wszystkich polskich znaków diakrytycznych.

## 4. Wymagany Wynik
- Gotowy bufor binarny pliku `.docx` oraz endpoint udostępniający pobieranie (`Content-Disposition: attachment; filename="..."`).
- Zero utraty formatowania przy edycji przez prawnika w pakiecie biurowym.

## 5. Warunki Odrzucenia Wyniku
- Dokument powoduje błąd "plik jest uszkodzony i nie może zostać otwarty" w programie Microsoft Word.
- Brak marginesu na oprawę (lewy margines poniżej 30 mm).
- Treść wyeksportowanego pliku różni się od wersji zaakceptowanej przez prawnika w edytorze aplikacji.

## 6. Sposób Weryfikacji
- Test automatyczny walidujący poprawność schematu OpenXML w wygenerowanym archiwum zip DOCX.
- Manualne otwarcie pliku testowego w LibreOffice / MS Word i weryfikacja wizualna układu stron.

## 7. Odnośniki do Materiałów
- Reguła: [03-engineering.md](../../rules/03-engineering.md)
- Reguła: [06-quality-and-release.md](../../rules/06-quality-and-release.md)
- Szablon pism: [docs/product/court-draft-template.md](../../../docs/product/court-draft-template.md)
