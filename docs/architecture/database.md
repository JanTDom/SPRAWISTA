# Model Bazy Danych i Polityki RLS (Supabase PostgreSQL)

Dokument definiuje relacyjny model danych Sprawisty oraz reguły bezpieczeństwa w PostgreSQL.

---

## 1. Kluczowe Tabele Systemowe

Tabela | Klucz Główny | Klucze Obce & Relacje | Rola
:--- | :--- | :--- | :---
`organizations` | `id (UUID)` | - | Kancelaria prawna (najwyższy tenant)
`organization_members` | `id (UUID)` | `org_id`, `user_id` | Członkostwo prawników i personelu kancelarii
`cases` | `id (UUID)` | `organization_id` | Sprawa procesowa (sygnatura, sąd, strony, WPS)
`case_memberships` | `id (UUID)` | `case_id`, `user_id` | Uprawnienia dostępu do konkretnej sprawy
`documents` | `id (UUID)` | `case_id`, `organization_id` | Akta sprawy (PDF, skany, raport kompletności)
`document_chunks` | `id (UUID)` | `document_id`, `case_id` | Wyekstrahowane fragmenty tekstowe z koordynatami
`case_facts` | `id (UUID)` | `case_id` | Wydobyte fakty, daty, statusy ontologiczne
`procedural_drafts` | `id (UUID)` | `case_id` | Wersjonowany projekt odpowiedzi na pozew

---

## 2. Architektura Izolacji Danych (RLS Policies)
- Wszystkie tabele domenowe posiadają wymuszoną blokadę `ENABLE ROW LEVEL SECURITY`.
- Zasada dwupoziomowej weryfikacji:
  1. Zapytanie musi zgadzać się z identyfikatorem `organization_id` w tokenie JWT użytkownika.
  2. Dostęp do tabeli `cases`, `documents` i `procedural_drafts` wymaga dodatkowo wpisu w `case_memberships` (ochrona tajemnicy radcowskiej wewnątrz kancelarii).
