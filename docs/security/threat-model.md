# Model Zagrożeń i Standardy Bezpieczeństwa (Threat Model)

Dokument określa wektory ataków, podatności oraz mechanizmy obronne w systemie Sprawista.

---

## 1. Wektory Zagrożeń i Środki Zaradcze

Wektor Zagrożenia | Prawdopodobieństwo / Wpływ | Zastosowany Środek Zaradczy
:--- | :--- | :---
**Indirect Prompt Injection z pliku PDF** | Wysokie / Krytyczny | Ścisła separacja danych od instrukcji systemowych (tagi XML `<dossier_content>`), zakaz wywoływania narzędzi przez tekst z akt.
**Dostęp nieuprawniony do akt innej kancelarii (Cross-tenant leak)** | Niskie / Katastrofalny | Wymuszone Row Level Security w PostgreSQL na poziomie `organization_id` + `case_id`.
**Wyciek danych osobowych do logów (PII Leak)** | Średnie / Poważny | Maskowanie danych w loggerze, brak logowania surowych fragmentów pism i plików PDF.
**Przejęcie konta prawnika (Account Takeover)** | Niskie / Poważny | Uwierzytelnianie przez Supabase Auth z wymogiem MFA, bezpieczne ciasteczka HTTP-only.
**Nieautoryzowany dostęp do plików w Storage** | Niskie / Krytyczny | Prywatne buckety S3/Supabase Storage, dostęp wyłącznie przez krótkotrwałe Signed URLs (15 min).
