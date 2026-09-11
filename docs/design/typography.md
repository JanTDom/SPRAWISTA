# Specyfikacja Typograficzna Sprawisty

---

## 1. Wybór Rodzin Krojów (Font Families)

Krój | Rola | Odmiany | Licencja & Pochodzenie
:--- | :--- | :--- | :---
**Newsreader** | Szeryfowy krój redakcyjny (Nagłówki, Petitum pisma, Sentencje prawne) | 400, 500, 600, Italic (Optical Size 16-72) | Google Fonts / SIL Open Font License
**Manrope** | Geometryczny sans-serif (Interfejs, kontrolki, metadane, formularze) | 400, 500, 600, 700 | Google Fonts / SIL Open Font License
**JetBrains Mono**| Stała szerokość (Sygnatury akt, identyfikatory chunków, sumy finansowe) | 400, 500 (tabular numbers) | JetBrains / SIL Open Font License

---

## 2. Skala Wielkości i Interlinii (Type Scale)

Poziom | Rozmiar / Line Height | Zastosowanie | Krój
:--- | :--- | :--- | :---
`display` | `32px / 1.2` | Tytuł widoku sprawy, nagłówek nadrzędny | Newsreader
`heading-1` | `24px / 1.25` | Tytuł pisma procesowego, sekcje główne | Newsreader
`heading-2` | `18px / 1.3` | Śródtytuły uzasadnienia, zarzuty | Newsreader 600
`body-prose` | `15px / 1.55` | Tekst ciągły uzasadnienia odpowiedzi na pozew | Newsreader / Manrope
`body-ui` | `14px / 1.4` | Formularze, opisy list, etykiety zakładek | Manrope 400/500
`caption` | `12px / 1.3` | Metadane, numery stron akt, statusy | Manrope 500
`mono-id` | `12px / 1.3` | `Sygn. akt`, identyfikatory chunków, kwoty | JetBrains Mono `tabular-nums`

---

## 3. Standardy Polskiego Składu Tekstu (Polish Microtypography)
- **Obsługa sierotek**: Jednoliterowe spójniki i przyimki (`a, i, o, u, w, z`) nie mogą pozostawać na końcu wiersza. Automatyczne wstawianie twardej spacji `\u00A0`.
- **Cudzysłowy**: Klasyczny cudzysłów polski `„tekst cytatu”` (kod `\u201E` i `\u201D`). Zakaz stosowania prostych cudzysłowów programistycznych `"` w tekście pism.
- **Pauzy i myślniki**: Wtrącenia w tekście zapisywane półpauzą ze spacjami: ` – ` (`\u2013`).
