# Ergonomia Dzielonego Pulpitu Pracy (Document Workspace UX)

Specyfikacja interfejsu pracy z aktami i projektem odpowiedzi na pozew na ekranach laptopów (13–16 cali).

---

## 1. Układ Ekranu (Layout Grid)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Pasek Górny: Sygnatura | Strony | Status Sprawy | [Zapisz] [Pobierz DOCX]  │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ LEWA SZPALTA (55% szerokości)        │ PRAWA SZPALTA (45% szerokości)       │
│                                      │                                      │
│ Edytor Pisma Procesowego             │ Podgląd Akt Sprawy (PDF Dossier)     │
│ - Nawigacja sekcji pisma             │ - Lista załączników i tomów akt      │
│ - Petitum, Zarzuty, Uzasadnienie     │ - Renderowana strona PDF             │
│ - Klikalna odznaka dowodu:           │ - Podświetlenie żółte cytatu         │
│   [Karta 14, Zał. 3 ↗] ─────────────►│ - Narzędzia lupy i powiększenia      │
│                                      │                                      │
├──────────────────────────────────────┴──────────────────────────────────────┤
│ Dolny Pasek Analityczny: [Oś Czasu] [Mapa Sporu] [Analiza Przeciwna (3 uwagi)]│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Skróty Klawiszowe dla Prawnika
- `Cmd + S` / `Ctrl + S`: Bezpieczny zapis roboczy pisma.
- `Cmd + \`: Schowanie / pokazanie prawego panelu akt (tryb pełnego skupienia na pisaniu).
- `Cmd + Option + E`: Przejście fokusu do edytora odpowiedzi na pozew.
- `Cmd + Option + D`: Przejście fokusu do przeglądarki akt.
- `Cmd + E`: Eksport do pliku Word (DOCX).

---

## 3. Zasady Obsługi Błędów i Braku Połączenia
- Stan edytora jest buforowany lokalnie w pamięci sesji (Session Storage) w celu natychmiastowego przywrócenia w razie zerwania połączenia sieciowego.
- Zmiany są automatycznie zapisywane na serwerze (debounced autosave 1500ms) z widocznym wskaźnikiem: `Zapisano w chmurze`.
