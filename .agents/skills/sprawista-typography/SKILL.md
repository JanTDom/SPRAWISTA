---
name: sprawista-typography
description: >-
  Pilnuje polskich znaków, czytelności, skali typograficznej, długości wierszy, łamania tekstu, kontrastu i jakości interfejsu dokumentowego.
  Używaj tego skilla przy konfigurowaniu fontów, stylowaniu edytora pism, tabel finansowych i widoków akt sprawy.
---

# Skill: sprawista-typography (Typografia Prawnicza i Dokumentowa)

Odpowiada za bezbłędny skład tekstu w języku polskim, perfekcyjną czytelność wielostronicowych pism procesowych, cyfry tabelaryczne oraz właściwą hierarchię optyczną w interfejsie Sprawisty.

## 1. Kiedy Uruchamiać (Triggers)
- Przy doborze, konfiguracji i ładowaniu krojów pism (web fonts).
- Podczas stylowania edytora odpowiedzi na pozew, osi czasu i tabeli wierzytelności.
- Podczas kontroli jakości składu tekstu w języku polskim (sierotki, znaki diakrytyczne, dywiz vs półpauza).

## 2. Wymagane Dane Wejściowe
- Rola tekstu (nagłówek sądu, petitum pozwu, zarzut procesowy, tabela kwot, etykieta formularza).
- Docelowy nośnik (ekran laptopa, podgląd PDF, wygenerowany plik DOCX).

## 3. Procedura Krok po Kroku
1. **Konfiguracja Rodzin Krojów**:
   - `Newsreader`: szeryfowy krój redakcyjny (Display / Petitum / Uzasadnienie prawne).
   - `Manrope`: bezszeryfowy krój interfejsu (formularze, nawigacja, przyciski, statusy).
   - `JetBrains Mono`: krój o stałej szerokości dla identyfikatorów, sygnatur i numerów kart.
2. **Weryfikacja Obsługi Języka Polskiego**:
   - Sprawdź obecność i poprawność rysunku glifów: `ą, ć, ę, ł, ń, ó, ś, ź, ż` oraz wersalików: `Ą, Ć, Ę, Ł, Ń, Ó, Ś, Ź, Ż`.
   - Zweryfikuj ładowanie podzbioru `latin-ext`.
3. **Optymalizacja Cyfr i Danych Finansowych**:
   - W tabelach należności, odsetek i kosztów zastosuj cyfry tabelaryczne: `font-variant-numeric: tabular-nums;` (lub klasę Tailwind `tabular-nums`).
4. **Zasady Polskiego Składu Tekstu**:
   - Twarde spacje (`&nbsp;` / `\u00A0`) po jednoliterowych spójnikach i przyimkach (`w, z, i, o, a, u`).
   - Właściwe znaki interpunkcyjne: cudzysłów polski dolny i górny (`„...”`), półpauza z odstępami jako myślnik (` – `), dywiz wyłącznie do łączenia wyrazów (`-`).
5. **Skala Typograficzna i Długość Wiersza**:
   - Tekst dokumentu: rozmiar bazowy 15–16 px, interlinia 1.5–1.6 (`leading-relaxed`), maksymalna szerokość 65–75 znaków na wiersz.
   - Etykiety i metadane: 12–13 px, interlinia 1.3, wyrazisty kontrast (`#172338` na jasnym tle).

## 4. Wymagany Wynik
- Skonfigurowany moduł typograficzny w Tailwind CSS (`typography.config.ts`).
- Funkcja pomocnicza czyszcząca polskie sierotki w tekście (`formatPolishTypography`).

## 5. Warunki Odrzucenia Wyniku
- Brak polskich znaków diakrytycznych powodujący podmianę na font zastępczy (fallback glitch).
- „Latające” spójniki na końcach linii w kluczowych nagłówkach i orzeczeniach.
- Skaczące kolumny liczb z powodu braku cyfr tabelarycznych.

## 6. Sposób Weryfikacji
- Test jednostkowy funkcji formatowania polskich znaków i twardych spacji.
- Inspekcja wizualna w przeglądarce pod kątem renderowania glifów.

## 7. Odnośniki do Materiałów
- Reguła: [02-art-direction.md](../../rules/02-art-direction.md)
- Dokumentacja typografii: [typography.md](../../../docs/design/typography.md)
