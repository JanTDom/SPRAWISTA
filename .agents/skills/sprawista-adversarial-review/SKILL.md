---
name: sprawista-adversarial-review
description: >-
  Sprawdza argumentację z perspektywy przeciwnika procesowego. Wykrywa sprzeczności, słabe założenia, pominięte dowody i nieuprawnione wnioski.
  Używaj tego skilla po wygenerowaniu wstępnego projektu pisma w celu identyfikacji luk w linii obrony i symulacji riposty powoda.
---

# Skill: sprawista-adversarial-review (Analiza Przeciwna i Test Odporności Argumentacji)

Odpowiada za bezlitosną, ale merytoryczną weryfikację projektu odpowiedzi na pozew z punktu widzenia doświadczonego pełnomocnika powoda. Pozwala wyeliminować słabe punkty obrony zanim pismo trafi do sądu.

## 1. Kiedy Uruchamiać (Triggers)
- Po skompletowaniu pierwszej wersji projektu odpowiedzi na pozew.
- Przed zatwierdzeniem argumentacji prawnej przez adwokata / radcę prawnego.
- Gdy użytkownik uruchamia funkcję „Sprawdź argumenty drugiej strony” w obszarze roboczym.

## 2. Wymagane Dane Wejściowe
- Projekt odpowiedzi na pozew (zarzuty, uzasadnienie, powołane dowody).
- Treść pozwu powoda z załącznikami.
- Identyfikatory dowodów i fakty bezsporne.

## 3. Procedura Krok po Kroku
1. **Analiza Ciężaru Dowodu (art. 6 K.c. i art. 232 K.p.c.)**:
   - Dla każdego podniesionego zarzutu (np. zarzut wykonania dzieła z wadami, zarzut potrącenia) sprawdź, czy to pozwany ma obowiązek udowodnienia faktu.
   - Wskaż, czy przedstawiony dowód jest wystarczający w świetle polskiego orzecznictwa.
2. **Identyfikacja Sprzeczności Wewnętrznych**:
   - Sprawdź, czy twierdzenia pozwanego nie wykluczają się wzajemnie (np. jednoczesne twierdzenie „umowy nigdy nie zawarto” i „umowa została należycie wykonana”).
3. **Symulacja Riposty Pełnomocnika Powoda**:
   - Jak zareaguje powód na podniesione zarzuty?
   - Czy zarzut przedawnienia nie zostanie obalony przerwaniem biegu przez wcześniejsze zawezwanie do próby ugodowej lub uznanie długu w korespondencji e-mail?
   - Czy reklamacja nie została złożona po terminie umownym / ustawowym?
4. **Weryfikacja Prekluzji i Wymogów Formalnych**:
   - Czy zarzut potrącenia spełnia rygorystyczne warunki z art. 203[1] K.p.c. (wierzytelność niesporna, z tego samego stosunku prawnego lub udokumentowana dokumentem wskazanym w ustawie)?
5. **Generowanie Rzetelnego Raportu Ryzyk**:
   - Ogranicz raport wyłącznie do realnych, procesowych zagrożeń (maksymalnie 3–5 najważniejszych punktów).
   - Nie twórz pozornych problemów dla sztucznego zapełnienia listy.
   - Do każdego zidentyfikowanego ryzyka dołącz rekomendację naprawczą (np. „Dołącz dowód nadania pisma z dnia...”, „Zmień kwalifikację zarzutu na...”).

## 4. Wymagany Wynik
- Struktura `AdversarialReviewReport` zawierająca zidentyfikowane luki, stopień ryzyka (Krytyczne / Średnie / Drobne) oraz konkretne propozycje wzmocnienia argumentacji.

## 5. Warunki Odrzucenia Wyniku
- Generowanie fikcyjnych lub banalnych uwag o charakterze stylistycznym zamiast zarzutów procesowych.
- Pominięcie kluczowych instytucji procesowych (np. brak analizy rygorów art. 203[1] K.p.c. przy potrąceniu).
- Obiecywanie „wygrania sprawy” w przypadku zastosowania się do uwag.

## 6. Sposób Weryfikacji
- Test poprawności wykrywania znanych słabości procesowych na zestawie testowym (benchmark spraw ze spreparowanymi błędami formalnymi).
- Ocena ekspercka zgodności z polską procedurą cywilną.

## 7. Odnośniki do Materiałów
- Reguła: [04-legal-provenance.md](../../rules/04-legal-provenance.md)
- Dokumentacja: [architecture/adversarial-review.md](../../../docs/architecture/adversarial-review.md)
