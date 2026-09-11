# Procedura Wdrożenia i Utrzymania Systemu (Deployment & Operations)

Dokument określa standardy publikacji wydań i monitoringu Sprawisty.

---

## 1. Środowiska Uruchomieniowe
- **Development**: Lokalne środowisko z mockami lub instancją deweloperską Supabase.
- **Staging**: Izolowane środowisko przedprodukcyjne na subdomenie `staging.sprawista.pl`.
- **Production**: Środowisko produkcyjne `sprawista.pl` z geolokalizacją serwerów w Unii Europejskiej (Frankfurt / Warszawa).

---

## 2. Kolejność Wdrożenia Produkcyjnego (Pipeline CI/CD)
1. Sprawdzenie bramek jakości (`typecheck`, `lint`, `test`).
2. Migracja schematu bazy danych w Supabase (tryb non-breaking).
3. Zbudowanie i wdrożenie aplikacji w Vercel.
4. Uruchomienie zadań dymnych (Smoke Tests) weryfikujących endpoint `/api/health`.
5. Przełączenie ruchu i monitoring metryk błędów.
