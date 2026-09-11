# Architektura Analizy Przeciwnej (Adversarial Review Architecture)

Dokument opisuje zasady działania modułu symulacji riposty procesowej pełnomocnika powoda.

---

## 1. Cel i Założenia
Analiza przeciwna nie jest „drugim modelem zgadującym wynik sprawy”. Jest narzędziem procesowego testu obciążeniowego (stress testing), które symuluje ripostę doświadczonego adwokata reprezentującego powoda.

---

## 2. Badane Wymiary Ryzyka
1. **Ciężar dowodu (art. 6 K.c.)**: Czy to my musimy udowodnić zarzut, i czy dysponujemy odpowiednim dokumentem?
2. **Prekluzja i spóźnienie (art. 458[5] K.p.c.)**: Czy dowód nie zostanie odrzucony jako spóźniony?
3. **Formalne rygory potrącenia (art. 203[1] K.p.c.)**: Czy wierzytelność przedstawiona do potrącenia jest udokumentowana zgodnie z ustawą?
4. **Zarzut przedawnienia i przerwanie biegu (art. 123 K.c.)**: Czy w aktach nie ma dowodu na wcześniejsze przerwanie biegu przedawnienia (np. uznanie długu, wezwanie do mediacji)?
