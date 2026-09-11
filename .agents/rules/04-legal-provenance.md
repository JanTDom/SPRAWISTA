# 04-legal-provenance: Zasady Pracy na Prawie, Faktach i Dowodach

## 1. Kategoryzacja Faktów i Twierdzeń (Epistemologia Procesowa)
W systemie Sprawista każdy fragment informacji ma ściśle określony status ontologiczny. Bezwzględnie zakazuje się ich utożsamiania:
1. `CLAIM_CLAIMANT` (**Twierdzenie powoda**): Stanowisko wyrażone w pozwie lub pismach procesowych powoda. Wymaga weryfikacji w dowodach lub podniesienia zaprzeczenia (art. 230 K.p.c.).
2. `CLAIM_DEFENDANT` (**Twierdzenie pozwanego / klienta**): Informacje przekazane przez klienta lub jego pełnomocnika, wymagające poparcia dowodami.
3. `DOCUMENT_CONTENT` (**Treść dokumentu źródłowego**): Bezpośredni, dosłowny cytat lub ekstrahowana treść umowy, faktury, protokołu, potwierdzenia odbioru wraz z podaniem karty akt.
4. `RULING_FINDING` (**Ustalenie z orzeczenia**): Teza lub ustalenie prawne wynikające z konkretnego orzeczenia SN lub SA, powiązane z weryfikowalną sygnaturą i datą.
5. `AI_HYPOTHESIS` (**Hipoteza analityczna AI**): Sugestia systemowa dotycząca potencjalnego zarzutu (np. zarzut przedawnienia, potrącenia), podlegająca obowiązkowej weryfikacji prawnika.
6. `LAWYER_ASSESSMENT` (**Ocena prawnika**): Stanowisko merytoryczne wprowadzone lub zatwierdzone przez radcę prawnego / adwokata.
7. `ACCEPTED_FINDING` (**Ustalenie robocze**): Fakt bezsporny między stronami, zaakceptowany przez pełnomocnika do uwzględnienia w petitum pisma.

## 2. Zakaz Halucynacji i Zasada Jawnego Źródła
- **Zakaz zmyślania**: Bezwzględny zakaz wymyślania orzeczeń, sygnatur akt, artykułów ustaw, dat doręczeń, treści oświadczeń woli czy kwot.
- **Wymóg weryfikowalności**: Każde powołanie się na dowód w projekcie pisma musi posiadać odnośnik do stabilnego identyfikatora fragmentu (`chunkId` / `pageNumber` / `documentId`).
- **Oznaczanie braku podstawy**: Jeżeli pełnomocnik podnosi twierdzenie, dla którego w aktach brak dokumentu, system oznacza je wprost: `[Brak bezpośredniego dowodu w aktach sprawy — wniosek o zobowiązanie przeciwnika lub przesłuchanie stron]`.
- **Raport braków i nieczytelności**: Strony nieczytelne, uszkodzone skany, ucięte marginesy czy błędy OCR muszą być wyeksponowane w Raporcie Kompletności Akt, a nie maskowane.

## 3. Czasowy Kontekst Prawny (Zasada Intertemporalna)
- W prawie cywilnym i gospodarczym stan prawny ocenia się według chwili zaistnienia zdarzenia prawnego (zawarcie umowy, termin płatności, doręczenie wezwania, wniesienie pozwu).
- Nie wolno automatycznie stosować aktualnego brzmienia Kodeksu cywilnego lub K.p.c. do zdarzeń z lat ubiegłych bez weryfikacji przepisów przejściowych.
- Weryfikacja aktów prawnych bazuje na oficjalnym rejestrze ISAP / Sejm ELI API (`https://api.sejm.gov.pl/eli_pl.html`).

## 4. Deterministyczne Obliczenia Finansowe i Kalendarzowe
- **ZAKAZ obliczania odsetek i terminów przez model językowy.** LLM ma tendencję do błędów arytmetycznych i kalendarzowych.
- Wszelkie obliczenia:
  - Termin na odpowiedź na pozew (14 dni od doręczenia, z uwzględnieniem sobót i dni ustawowo wolnych — art. 115 K.c. i art. 165 K.p.c.);
  - Przedawnienie roszczeń (art. 118 K.c., koniec roku kalendarzowego, roszczenia okresowe i gospodarcze 3 lata, sprzedaż 2 lata itp.);
  - Odsetki ustawowe za opóźnienie w transakcjach handlowych vs odsetki ustawowe za opóźnienie (K.c.);
  - Koszty procesu i opłaty sądowe (ustawa o kosztach sądowych w sprawach cywilnych);
  muszą być realizowane przez dedykowane, w 100% testowane funkcje deterministyczne w module `src/domain/calculators/`.

## 5. Etyka Analityczna i Odrzucenie Marketingu AI
- Analiza drugiego modelu NIE stanowi dowodu prawdziwości.
- Zabrania się wyświetlania klientom procentowych „szans na wygraną” bez certyfikowanego, walidowanego modelu empirycznego.
- Szanujemy prawa autorskie: nie kopiujemy nielegalnie komercyjnych komentarzy i monografii.
