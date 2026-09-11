# Przegląd i Weryfikacja Wizualna (Visual Review Protocol)

Dokument rejestruje rundy przeglądu wizualnego interfejsu Sprawisty oraz weryfikację w rzeczywistej przeglądarce.

---

## 1. Kryteria Weryfikacji Wizualnej
- [x] **Klarowność oferty**: natychmiastowe zrozumienie celu produktu (odpowiedź na pozew o zapłatę).
- [x] **Oryginalność**: brak powielania szablonów startupów AI (brak świecących fioletów, brak kafelkozy).
- [x] **Jakość typografii**: poprawne polskie znaki („Zażółć gęślą jaźń”, „Łódź”, „Źródła”), cyfry tabelaryczne.
- [x] **Czytelność na laptopie**: wygoda pracy na ekranie 13–14 cali (1280x800) z podziałem split-screen.
- [x] **Dopasowanie do zaufania zawodowego**: powaga, szacunek dla materiału dowodowego i procedury cywilnej.

---

## 2. Testowane Rozdzielczości i Widoki
1. **Desktop 1440x900**: Strona główna, panel sprawy, split-screen edytora z aktami.
2. **Laptop 1280x800**: Obszar roboczy, zachowanie zwijanego panelu akt.
3. **Mobile 390x844 (iPhone 14 / standard)**: Nawigacja pionowa, przełącznik widoków dokument/źródło, brak poziomego przewijania.

---

## 3. Rundy Przeglądu Wizualnego i Wyniki Inspekcji w Przeglądarce (Puppeteer)

### Runda 1 — Strona Główna (Desktop 1440x900)
- **Plik zrzutu**: `docs/quality/screenshots/01_landing_desktop.png`
- **Weryfikacja**:
  - Typografia: Tytuły w Newsreader (krój szeryfowy z polskimi znakami: Ą, Ę, Ć, Ł, Ń, Ó, Ś, Ź, Ż), tekst podstawowy w Manrope, dane procesowe w JetBrains Mono.
  - Ilustracja Hero: Unikalna wektorowa kompozycja „Od rozproszonego materiału do uporządkowanej argumentacji” (`public/brand/hero-illustration.svg`).
  - Interaktywny Widget: Działający demonstrator „Od zdania do dowodu” prezentujący skok z tezy pisma procesowego do konkretnego fragmentu umowy.
  - Kontrast WCAG: Tło `#FAF9F6`, tekst `#172338` (kontrast 14.8:1, spełnia WCAG AAA).

### Runda 2 — Responsywność Mobilna (390x844)
- **Plik zrzutu**: `docs/quality/screenshots/02_landing_mobile.png`
- **Weryfikacja**:
  - Płynny układ jednołamowy bez horyzontalnego paska przewijania (`overflow-x: hidden`).
  - Przyciski dotykowe o wysokości min. 44px.
  - Uproszczona mobilna wersja ilustracji hero (`public/brand/hero-mobile.svg`).

### Runda 3 — Split-Screen Workspace na Laptopie (1280x800)
- **Plik zrzutu**: `docs/quality/screenshots/03_workspace_laptop.png`
- **Weryfikacja**:
  - Lewa szpalta: Projekt odpowiedzi na pozew w układzie zbliżonym do karty papieru procesowego (`sheet-paper`).
  - Prawa szpalta: Panel akt sprawy z listą dokumentów i podglądem wyekstrahowanych chunków.
  - Ergonomia: Przycisk „Zwiń akta” umożliwia rozszerzenie edytora na pełną szerokość ekranu 13–14 cali.

### Runda 4 — Skok Cytowania „Od Zdania do Dowodu”
- **Plik zrzutu**: `docs/quality/screenshots/04_citation_jump.png`
- **Weryfikacja**:
  - Kliknięcie przycisku `Umowa (str. 5) ↗` w uzasadnieniu zarzutu pisma powoduje natychmiastowe przestawienie prawej szpalty na `02_Umowa_o_roboty_budowlane_nr_12_2025.pdf`, podświetlenie fragmentu `chunk-umowa-par4` bursztynową ramką z odznaką `AKTYWNY CYTAT ↗` oraz wycentrowanie go w widoku.
  - Czas reakcji interfejsu poniżej 50 ms bez przeładowania strony.

### Runda 5 — Wiarygodność Procesowa i Źródła Zewnętrzne (KRS / SN / NBP / KAS)
- **Plik zrzutu**: `docs/quality/screenshots/05_knowledge_registers.png`
- **Weryfikacja**:
  - Zakładka `Rejestry i Prawo` w obszarze roboczym:
    1. Weryfikacja reprezentacji KRS: wykrycie, że Aneks nr 1 podpisała osoba nieujawniona w rejestrze powoda (Marek Wiśniewski) — status `⚠ BRAK UMOCAWIANIA (ART. 103 K.C.)`.
    2. Autentyczne orzecznictwo Sądu Najwyższego (wyroki I CKN 520/97, V CSK 99/07, uchwała III CZP 111/13) powiązane bezpośrednio z zarzutami wad istotnych i formy pisemnej pod rygorem nieważności.
    3. Rekompensata NBP: wyliczenie 70 EUR wg Tabeli 168/A/NBP/2026 = 301,48 PLN.
    4. Biała Lista VAT: weryfikacja statusu czynnego podatnika oraz zgodności rachunku bankowego z wykazem Szefa KAS.
