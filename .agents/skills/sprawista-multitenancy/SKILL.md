---
name: sprawista-multitenancy
description: >-
  Projektuje organizacje, członkostwa, dostęp do spraw, polityki RLS w PostgreSQL oraz prywatne zasobniki Storage.
  Używaj tego skilla przy implementacji modelu uprawnień, migracji bazodanowych, izolacji tenantów oraz testów szczelności dostępu.
---

# Skill: sprawista-multitenancy (Architektura Wielodostępowa i Izolacja Danych Kancelarii)

Odpowiada za bezwzględną izolację danych pomiędzy kancelariami oraz wewnątrz zespołów prawnych. Zapobiega nieuprawnionemu dostępowi do akt sprawy i chroni tajemnicę radcowską i adwokacką.

## 1. Kiedy Uruchamiać (Triggers)
- Przy projektowaniu schematu bazy danych i pisaniu migracji Supabase.
- Przy wdrażaniu polityk Row Level Security (RLS) dla nowych tabel.
- Przy implementacji dostępu do plików w Supabase Storage.
- Podczas audytu bezpieczeństwa wyszukiwania, zadań w tle i cache.

## 2. Wymagane Dane Wejściowe
- Schemat relacji (`organizations`, `organization_memberships`, `cases`, `case_memberships`, `documents`).
- Identyfikator sesji użytkownika (`auth.uid()`).

## 3. Procedura Krok po Kroku
1. **Dwuwarstwowy Model Uprawnień**:
   - **Warstwa Organizacji (`organization_id`)**: Użytkownik ma dostęp wyłącznie do danych swojej kancelarii. Żadne zapytanie nie może zwrócić rekordu innej organizacji.
   - **Warstwa Sprawy (`case_id` / Case-Level Access)**: Przynależność do kancelarii nie wystarcza do otwarcia sprawy. Prawnik musi posiadać jawne uprawnienie w tabeli `case_memberships` (ochrona przed konfliktem interesów tzw. „chiński mur”).
2. **Implementacja Rygorystycznych Polityk RLS w PostgreSQL**:
   - Włącz RLS na każdej tabeli: `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`.
   - Zastosuj polityki oparte na funkcji pomocniczej:
     ```sql
     CREATE POLICY "Users can access only assigned cases in their organization"
     ON cases FOR ALL
     USING (
       organization_id = auth.jwt() ->> 'organization_id'
       AND (
         owner_id = auth.uid()
         OR EXISTS (
           SELECT 1 FROM case_memberships cm
           WHERE cm.case_id = cases.id AND cm.user_id = auth.uid()
         )
       )
     );
     ```
3. **Izolacja Prywatnych Zasobników Storage**:
   - Pliki akt przechowywane są w ścieżkach: `cases/{organization_id}/{case_id}/{document_id}.pdf`.
   - Dostęp wyłącznie przez podpisane adresy URL (Signed URLs) z krótkim czasem życia (np. 15 minut).
4. **Izolacja w Wyszukiwaniu Wektorowym i Kolejkach**:
   - Zapytania pgvector MUSZĄ zawierać filtr `WHERE organization_id = ... AND case_id = ...` przed obliczeniem odległości cosinusowej.
   - Zadania Trigger.dev otrzymują wyłącznie identyfikatory i weryfikują uprawnienia w momencie wykonania.

## 4. Wymagany Wynik
- Bezpieczny schemat SQL z włączonym RLS na 100% tabel domenowych.
- Zestaw testów integracyjnych potwierdzających blokadę dostępu cross-tenant.

## 5. Warunki Odrzucenia Wyniku
- Brak włączonego RLS na jakiejkolwiek tabeli przechowującej dane sprawy lub dokumenty.
- Poleganie wyłącznie na filtrze w zapytaniu `SELECT` w kodzie aplikacji bez zabezpieczenia w bazie danych.
- Możliwość pobrania pliku z Storage przez publiczny link bez autoryzacji.

## 6. Sposób Weryfikacji
- Test integracyjny: próba odczytu sprawy Kancelarii A przez token użytkownika Kancelarii B musi zwrócić błąd lub pusty zbiór.
- Audyt konfiguracji Supabase za pomocą testów jednostkowych SQL (pgTAP).

## 7. Odnośniki do Materiałów
- Reguła: [05-security-privacy.md](../../rules/05-security-privacy.md)
- Architektura bazy: [architecture/database.md](../../../docs/architecture/database.md)
