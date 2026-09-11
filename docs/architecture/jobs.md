# Architektura Zadań Trwałych (Trigger.dev v3)

Dokument opisuje przetwarzanie asynchroniczne i odporność operacyjną w Sprawiście.

---

## 1. Dlaczego Trigger.dev v3?
- Standardowe środowiska bezserwerowe (np. Vercel Serverless Functions) posiadają limity czasu trwania pojedynczego żądania (15s–60s).
- Przetworzenie 100 stron akt sprawy z selektywnym OCR i analizą wielokrokową zajmuje od 30 do 180 sekund.
- Trigger.dev zapewnia wykonanie bez limitów HTTP, automatyczne wznawianie po awarii oraz bezpieczne punkty kontrolne (checkpoints).

---

## 2. Rejestr Głównych Zadań w Tle
1. `dossier.ingest`: Walidacja pliku PDF, selektywny OCR, generowanie chunków i raportu kompletności.
2. `ai.analyze-case`: Uruchomienie wielokrokowego pipeline'u ekstrakcji faktów i generowania zarzutów.
3. `ai.adversarial-review`: Symulacja riposty powoda i ocena słabych punktów linii obrony.
4. `export.docx-generation`: Wygenerowanie pliku Word i zapisanie do tymczasowego zasobnika z podpisanym adresem do pobrania.
