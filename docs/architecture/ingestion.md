# Pipeline Ekstrakcji Akt i Selektywnego OCR (Document Ingestion)

Dokument opisuje architekturę przyjmowania akt, przetwarzania plików PDF oraz kategoryzacji fragmentów.

---

## 1. Etapy Ekstrakcji Pliku
```
Upload pliku PDF przez prawnika
              ↓
Sprawdzenie MIME i nagłówka binarnego (%PDF-)
              ↓
Zapis do prywatnego zasobnika: cases/{org_id}/{case_id}/{doc_id}.pdf
              ↓
Przekazanie zadania do Trigger.dev (processCaseDossierTask)
              ↓
Pętla po stronach dokumentu:
┌─────────────────────────────────────────────────────────────┐
│ Czy strona zawiera cyfrową warstwę tekstową (>50 znaków)?   │
│  ├─ TAK: Bezpośrednia ekstrakcja tekstu (pdfjs)             │
│  └─ NIE: Selektywny silnik OCR dla języka polskiego         │
└─────────────────────────────────────────────────────────────┘
              ↓
Normalizacja tekstu i czyszczenie polskich znaków
              ↓
Chunking: podział na akapity z unikalnym chunkId i koordynatami
              ↓
Zapis do tabeli document_chunks + wygenerowanie Raportu Kompletności
```

---

## 2. Raport Kompletności Akt (Ingestion Completeness Report)
System po przetworzeniu pliku generuje zestaw metryk:
- `totalPages`: łączna liczba stron w aktach.
- `digitallyParsedPages`: strony odczytane bezpośrednio z warstwy cyfrowej.
- `ocrProcessedPages`: strony przetworzone przez silnik OCR.
- `degradedPages`: strony z nieczytelnym pismem ręcznym lub zagiętymi rogami wymagające uwagi pełnomocnika.
