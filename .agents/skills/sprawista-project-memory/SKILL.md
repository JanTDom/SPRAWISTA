---
name: sprawista-project-memory
description: >-
  Zapisuje zatwierdzone decyzje, sprawdzone wzorce inżynieryjne, przyczyny błędów i sposoby ich naprawy.
  Używaj tego skilla po zakończeniu istotnego etapu prac, rozwiązaniu trudnego problemu technicznego lub zmianie założeń architektonicznych.
---

# Skill: sprawista-project-memory (Pamięć Projektu i Retrospekcja Inżynieryjna)

Odpowiada za systemowe gromadzenie i utrwalanie wiedzy o projekcie Sprawista. Zapewnia, że wypracowane wzorce, decyzje i rozwiązania problemów pozostają trwale dostępne dla całego zespołu bez powielania błędów z przeszłości.

## 1. Kiedy Uruchamiać (Triggers)
- Po zakończeniu każdego etapu z `IMPLEMENTATION_PLAN.md`.
- Po podjęciu istotnej decyzji architektonicznej, technologicznej lub biznesowej.
- Po zdiagnozowaniu i rozwiązaniu nietrywialnego błędu (Post-Mortem).
- Gdy zachodzi potrzeba konsolidacji wiedzy i usunięcia przestarzałych instrukcji.

## 2. Wymagane Dane Wejściowe
- Kontekst podjętej decyzji lub opis rozwiązanego problemu.
- Zweryfikowane fakty i kod, który przyniósł oczekiwany rezultat.
- Żadnych poufnych danych spraw, nazwisk klientów ani sekretów.

## 3. Procedura Krok po Kroku
1. **Rejestracja Decyzji Architektonicznej (ADR)**:
   - Jeśli zmiana dotyczy wyboru biblioteki, struktury danych, modelu uprawnień lub kierunku UI:
   - Dopisz nowy rekord do pliku `DECISIONS.md` według szablonu:
     - `ADR-XXX: Tytuł`
     - `Data`, `Status`, `Kontekst`, `Decyzja`, `Konsekwencje`, `Warunek ponownej oceny`.
2. **Aktualizacja Stanu Projektu**:
   - Zaktualizuj `PROJECT_STATE.md`:
     - Oznacz ukończone elementy listy kontrolnej.
     - Wpisz aktualne blokady lub braki konfiguracyjne.
     - Zdefiniuj najbliższy precyzyjny cel operacyjny.
3. **Zapis Sprawdzonych Wzorców (Knowledge Base)**:
   - Jeśli wypracowano powtarzalny schemat (np. obsługa polskich twardych spacji, kalkulator terminów procesowych, bezpieczna konfiguracja RLS):
   - Zapisz wzorzec w odpowiednim podkatalogu `docs/architecture/` lub `docs/quality/`.
4. **Higiena Pamięci i Usuwanie Przestarzałych Zapisów**:
   - Sprawdź, czy nowe wpisy nie stoją w sprzeczności z istniejącymi regułami.
   - W kontrolowany sposób zaktualizuj lub zdeprecjonuj stare zapisy, nie tworząc dwóch alternatywnych wersji prawdy.

## 4. Wymagany Wynik
- Zaktualizowany `PROJECT_STATE.md` oraz `DECISIONS.md`.
- Zwięzły, zweryfikowany opis rozwiązania bez zbędnego szumu informacyjnego.

## 5. Warunki Odrzucenia Wyniku
- Zapisywanie do pamięci projektu surowych stenogramów rozmów lub długich nieprzetworzonych logów.
- Zapisywanie danych wrażliwych, akt klientów lub kluczy API.
- Deklarowanie, że „cały model nauczył się czegoś”, gdy zmiana ograniczyła się do edycji pliku.

## 6. Sposób Weryfikacji
- Weryfikacja spójności między `DECISIONS.md`, `PROJECT_STATE.md` a plikami reguł `.agents/rules/`.
- Sprawdzenie braku sekretów i danych poufnych w commitowanym diffie.

## 7. Odnośniki do Materiałów
- Rejestr decyzji: [DECISIONS.md](../../../DECISIONS.md)
- Stan projektu: [PROJECT_STATE.md](../../../PROJECT_STATE.md)
- Reguła rdzenia: [00-sprawista-core.md](../../rules/00-sprawista-core.md)
