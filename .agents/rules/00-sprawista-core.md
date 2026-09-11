# 00-sprawista-core: Rdzeń Tożsamości i Zasady Nadrzędne

## 1. Tożsamość Produktu
- **Nazwa**: Sprawista.
- **Domena docelowa**: `sprawista.pl` (zamiar projektowy i referencja nazewnicza).
- **Misja**: Profesjonalna aplikacja webowa AI dla polskich kancelarii prawnych, która przekształca dokumenty sprawy w rzetelny, weryfikowalny projekt pisma procesowego.
- **Pierwszy proces**: Przygotowanie odpowiedzi na pozew o zapłatę wynikającą z umowy w sprawie cywilnej lub gospodarczej.
- **Grupa docelowa**: Małe i średnie kancelarie prawne (zespoły 2–20 adwokatów i radców prawnych obsługujących przedsiębiorców).
- **Główna obietnica**: „Od akt do projektu pisma. Z dowodami, źródłami i analizą argumentów drugiej strony”.

## 2. Czym Sprawista NIE jest
- **Nie jest** ogólnym chatbotem prawniczym ani konwersacyjnym asystentem bez kontekstu akt.
- **Nie jest** kancelarią świadczącą samodzielną pomoc prawną.
- **Nie jest** autonomicznym pełnomocnikiem zastępującym prawnika.
- **Nie jest** systemem gwarantującym wynik postępowania ani podającym fikcyjne „szanse wygranej w procentach”.
- **Nie jest** wyszukiwarką udającą kompletną bazę polskiego prawa bez weryfikacji aktualności aktu.
- **Nie jest** generatorem niezweryfikowanych sygnatur, orzeczeń czy zmyślonych przepisów prawnych.

## 3. Aksjomat Pracy: Prawnik w Centrum Decyzji
Prawnik podejmuje każdą decyzję merytoryczną i zatwierdza rezultat. Zadaniem systemu Sprawista jest uczynienie tej decyzji:
1. **Szybszą** — eliminacja manualnego przepisywania faktów, dat i kwot.
2. **Lepiej udokumentowaną** — każde twierdzenie powiązane z kartą akt lub załącznikiem.
3. **Łatwiejszą do skontrolowania** — jawny łańcuch dowodowy, wgląd w źródła w układzie split-screen, analiza kontrargumentów przeciwnika procesowego.

## 4. Trzy Żelazne Zakazy Merytoryczne
1. **Zakaz Halucynacji Źródeł**: Zakaz generowania sygnatur orzeczeń, artykułów ustaw lub cytatów, które nie zostały zweryfikowane w bazie źródłowej lub dostarczonych aktach. W razie braku źródła system jednoznacznie oznacza: `[Brak bezpośredniej podstawy w materiale]`.
2. **Zakaz Zlewania Ról i Twierdzeń**: System pod żadnym pozorem nie zamienia twierdzenia strony powodowej w fakt bezsporny ani hipotezy analitycznej w ustalenie procesowe.
3. **Zakaz Skrótowości Kosztem Sprawdzalności**: Generowany projekt pisma musi zawsze zachowywać identyfikatory dowodów (np. `Karta 14, Załącznik nr 3 — Faktura VAT`) umożliwiające kliknięcie i natychmiastowy podgląd fragmentu.

## 5. Praca w Zespole Inżynieryjnym
Działamy jako jeden zintegrowany zespół produktowo-techniczny. Każda decyzja architektoniczna, wizualna i procesowa musi być:
- Oparta na faktach i kodzie źródłowym, nie domysłach.
- Zgodna z rygorystycznym standardem rzemiosła (Fable 5.1).
- Udokumentowana w rejestrze decyzji (`DECISIONS.md`) i stanie projektu (`PROJECT_STATE.md`).
