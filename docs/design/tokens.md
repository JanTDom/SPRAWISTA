# Tokeny Projektowe Editorial Precision (Design Tokens)

Zestaw tokenów wizualnych definiujący kolory, typografię, odstępy i cienie w systemie Sprawista.

---

## 1. Paleta Podstawowa (Brand & Canvas)

Token CSS | Wartość Hex / OKLCH | Zastosowanie
:--- | :--- | :---
`--sprawista-canvas` | `#F6F5F1` | Główne tło aplikacji (ciepły papier archiwalny)
`--sprawista-paper` | `#FFFFFF` | Arkusze pism procesowych i podglądu dokumentów
`--sprawista-ink-primary` | `#172338` | Główny tekst, nagłówki, ikony dominujące
`--sprawista-ink-secondary`| `#5F6774` | Tekst pomocniczy, metadane, etykiety formularzy
`--sprawista-cobalt` | `#355CFF` | Akcent precyzji, aktywne kontrolki, zaznaczenia źródeł
`--sprawista-cobalt-hover` | `#2849D9` | Stan hover elementów akcentowych
`--sprawista-divider` | `#E1E3E7` | Subtelne linie podziału, ramki arkuszy

---

## 2. Kolory Semantyczne (Statusy Sprawy i Weryfikacji)

Token CSS | Kolor Tekstu / Ikony | Tło Kontenera | Znaczenie Semantyczne
:--- | :--- | :--- | :---
`--status-verified` | `#137333` | `#E6F4EA` | Dowód zweryfikowany, fakt bezsporny
`--status-warning` | `#B06000` | `#FEF7E0` | Wymaga weryfikacji prawnika, słaby dowód
`--status-critical` | `#C5221F` | `#FCE8E6` | Rozbieżność, ryzyko prekluzji, sprzeczność
`--status-citation` | `#1A73E8` | `#E8F0FE` | Aktywny odsyłacz do karty akt

---

## 3. Siatka Odstępów (Spacing Scale)
- `space-1`: `4px`
- `space-2`: `8px`
- `space-3`: `12px`
- `space-4`: `16px`
- `space-6`: `24px`
- `space-8`: `32px`
- `space-12`: `48px`
- `space-16`: `64px`

---

## 4. Cienie i Krawędzie Arkusza (Paper Sheet Elevations)
- `--shadow-paper`: `0 1px 3px rgba(23, 35, 56, 0.05), 0 8px 24px rgba(23, 35, 56, 0.04);`
- `--radius-sheet`: `4px` (subtelne, szlachetne zaokrąglenie; brak przesadnego `rounded-3xl`).
