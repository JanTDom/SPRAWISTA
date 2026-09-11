# System Wymiarów i Komponentów Interfejsu (Design System)

---

## 1. Skala Wielkości i Typografia
- **Font szeryfowy (Nagłówki i pismo)**: `Newsreader` (400, 600)
- **Font bezszeryfowy (Interfejs)**: `Manrope` (400, 500, 600, 700)
- **Font o stałej szerokości (Sygnatury i liczby)**: `JetBrains Mono` z `tabular-nums`

### Responsywna Skala Nagłówków
- Desktop H1 Hero: `clamp(44px, 5.5vw, 76px)`, line-height: `1.15`, tracking: `-0.03em`.
- Mobile H1 Hero: `clamp(32px, 8vw, 42px)`, line-height: `1.2`.
- Śródtytuły sekcji (H2): `clamp(26px, 3.5vw, 40px)`.
- Tekst czytanego dokumentu: `15px` na ekranie, line-height: `1.55`.

---

## 2. Wysokości i Wymiary Kontrolek
- Przyciski główne (`Button` primary/secondary): wysokość `42px`, padding boczny `20px`, zaokrąglenie `6px`.
- Kontrolki formularzy (`Input`, `Select`): wysokość `42px`, tekst `14px`, obramowanie `1px solid #E1E3E7`.
- Etykiety i znaczniki dowodowe (`CitationBadge`): wysokość `22px`, padding `2px 8px`, czcionka `JetBrains Mono 11px`.

---

## 3. Standard Dostępności (WCAG 2.2 AA)
- Każdy element klikalny posiada wyraźny stan `:focus-visible` (ring 2px cobalt `#355CFF` z offsetem 2px).
- Kontrast tekstu do tła wynosi co najmniej 7:1 dla tekstu podstawowego (`#172338` na `#F6F5F1` lub `#FFFFFF`).
- Obsługa nawigacji wyłącznie za pomocą klawiatury (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`).
