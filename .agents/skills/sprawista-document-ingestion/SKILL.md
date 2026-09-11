---
name: sprawista-document-ingestion
description: >-
  Obsługuje bezpieczne przyjmowanie plików, ekstrakcję tekstu, selektywny OCR, stabilne identyfikatory fragmentów, wersjonowanie i raport kompletności.
  Używaj tego skilla przy implementacji uploadu akt sprawy, przetwarzaniu PDF-ów, krojeniu na fragmenty (chunking) i analizie jakości odczytu.
---

# Skill: sprawista-document-ingestion (Przyjmowanie Akt i Selektywna Ekstrakcja)

Odpowiada za bezpieczny i precyzyjny proces transformacji surowych plików sprawy (PDF, skany, załączniki) w uporządkowany zbiór weryfikowalnych fragmentów tekstowych ze stabilnymi koordynatami.

## 1. Kiedy Uruchamiać (Triggers)
- Przy implementacji endpointów i zadań uploadu dokumentów (`/api/cases/[id]/documents`).
- Przy konfiguracji pipeline'u przetwarzania PDF i selektywnego silnika OCR.
- Przy generowaniu Raportu Kompletności Akt (Ingestion Completeness Report).

## 2. Wymagane Dane Wejściowe
- Plik źródłowy (strumień binarny PDF / obraz).
- Metadane sprawy (`caseId`, `organizationId`, nazwa pliku, typ dokumentu).

## 3. Procedura Krok po Kroku
1. **Walidacja Bezpieczeństwa Pliku**:
   - Sprawdź MIME-type i sygnaturę binarną (Magic Bytes: `%PDF-`).
   - Odrzuć pliki zaszyfrowane hasłem lub zawierające zagnieżdżone skrypty JavaScript (ochrona przed exploitami czytników PDF).
   - Ogranicz maksymalny rozmiar pojedynczego pliku (np. 100 MB).
2. **Selektywna Ekstrakcja i OCR**:
   - Przeanalizuj każdą stronę dokumentu pod kątem obecności wbudowanej warstwy tekstowej.
   - Jeśli strona posiada cyfrowy tekst wysokiej jakości — wyodrębnij go bezpośrednio (oszczędność czasu i kosztów).
   - Jeśli strona jest skanem lub zawiera mniej niż 50 znaków tekstu — uruchom selektywny OCR o wysokiej dokładności dla języka polskiego.
3. **Generowanie Stabilnych Identyfikatorów Fragmentów (Chunking)**:
   - Podziel tekst na logiczne fragmenty (akapity, punkty umowy, pozycje faktury).
   - Każdy fragment otrzymuje unikalny, deterministyczny identyfikator:
     `chunkId = hash(documentId + pageNumber + paragraphIndex)`.
   - Zapisz koordynaty geometrii fragmentu na stronie (`boundingBox: {x, y, width, height}`).
4. **Generowanie Raportu Kompletności Odczytu**:
   - Podsumuj: łączna liczba stron, strony w pełni odczytane, strony z OCR, strony o niskiej pewności (<75% confidence score).
   - Wyeksponuj listę stron nieczytelnych lub wymagających ręcznej weryfikacji prawnika.

## 4. Wymagany Wynik
- Rekord dokumentu w bazie danych ze statusem `PROCESSED`.
- Kolekcja rekordów `document_chunks` w Supabase z wektorami i koordynatami.
- Zapisany w bazie i widoczny w UI Raport Kompletności Akt.

## 5. Warunki Odrzucenia Wyniku
- Maskowanie nieczytelnych stron — system nie może udawać, że odczytał stronę, która w rzeczywistości jest czarnym skanem.
- Brak stabilnych identyfikatorów uniemożliwiający powrót z projektu pisma do źródła.
- Przetwarzanie wielostronicowego pliku w wątku synchronicznym HTTP (powodujące błąd timeout).

## 6. Sposób Weryfikacji
- Test jednostkowy parsera PDF z mockowanymi plikami (skan vs cyfrowy PDF).
- Sprawdzenie poprawności przypisania numerów stron i generowania `chunkId`.

## 7. Odnośniki do Materiałów
- Reguła: [04-legal-provenance.md](../../rules/04-legal-provenance.md)
- Reguła: [05-security-privacy.md](../../rules/05-security-privacy.md)
- Specyfikacja: [architecture/ingestion.md](../../../docs/architecture/ingestion.md)
