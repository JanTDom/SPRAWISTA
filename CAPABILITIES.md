# CAPABILITIES.md — Rejestr Dostępności Narzędzi i Integracji Środowiska

**Data weryfikacji**: 2026-09-11  
**Środowisko bazowe**: macOS (Darwin), Shell: zsh, Git repo: zainicjalizowane.

---

## 1. Narzędzia Środowiska Uruchomieniowego (Lokalne CLI)

Narzędzie / Runtime | Status | Wersja | Wynik Testu | Ograniczenia i Uwagi
:--- | :--- | :--- | :--- | :---
**Node.js** | DOSTĘPNY | v24.14.0 | PASS (`node -v`) | Pełne wsparcie dla nowoczesnego ES / Next.js
**NPM** | DOSTĘPNY | 11.9.0 | PASS (`npm -v`) | Menedżer pakietów domyślny
**Python 3** | DOSTĘPNY | 3.14.3 | PASS (`python3 --version`) | Do skryptów analitycznych i audytowych
**Git** | DOSTĘPNY | 2.50.1 | PASS (`git status`) | Repozytorium zainicjalizowane na `main`
**pnpm / bun** | NIEDOSTĘPNY | - | FAIL (not found) | Należy korzystać z `npm` lub zainstalować lokalnie
**Supabase CLI** | NIEDOSTĘPNY | - | Brak w PATH | Integracja przez biblioteki klienta `@supabase/supabase-js`
**Vercel CLI** | NIEDOSTĘPNY | - | Brak w PATH | Wdrożenia przez Git repozytorium lub `npx vercel`
**Stripe CLI** | NIEDOSTĘPNY | - | Brak w PATH | Testowanie webhooków przez test runner lub `npx stripe`
**Trigger.dev CLI** | NIEDOSTĘPNY | - | Brak w PATH | Konfiguracja przez SDK `@trigger.dev/sdk` w Next.js
**GitHub CLI (gh)** | NIEDOSTĘPNY | - | Brak w PATH | Integracja przez MCP Server `github` lub Git

---

## 2. Zdolności Wbudowane Agenta (Agent Tools)

Zdolność / Narzędzie | Status | Sposób Użycia | Zastosowanie w Projekcie
:--- | :--- | :--- | :---
**Generowanie Obrazów** | DOSTĘPNE | `generate_image` | Tworzenie materiałów marki, ilustracji, grafik koncepcyjnych
**Automatyzacja Przeglądarki** | DOSTĘPNA | MCP `puppeteer` (`call_mcp_tool`) | Rzeczywiste zrzuty ekranu, testy wizualne, badanie interakcji
**Integracja GitHub** | DOSTĘPNA | MCP `github` (`call_mcp_tool`) | Zarządzanie repozytorium, PR, issues
**Odczyt Dokumentacji Web** | DOSTĘPNY | `read_url_content`, `search_web` | Sprawdzanie oficjalnych dokumentacji (Next.js, Supabase, ELI API)
**System Subagentów** | DOSTĘPNY | `invoke_subagent`, `manage_subagents` | Równoległe, izolowane zadania badawcze i weryfikacyjne
**Terminal Sandbox** | DOSTĘPNY | `run_command` | Wykonywanie poleceń w sandboksie lub z bypass na żądanie

---

## 3. Audyt Sekretów i Kluczy Zewnętrznych (Status Obecności)

Zmienna Środowiskowa | Status | Zakres Zastosowania | Wymagana Akcja
:--- | :--- | :--- | :---
`SUPABASE_ACCESS_TOKEN` | BRAK | Zarządzanie projektami Supabase | Wymaga konfiguracji przed migracją bazy
`SUPABASE_URL` / `ANON_KEY` | BRAK | Połączenie aplikacji z bazą i Auth | Wymaga dodania do `.env.local`
`VERCEL_TOKEN` | BRAK | Zautomatyzowane wdrożenia z poziomu CLI | Wymaga konfiguracji w fazie deploymentu
`TRIGGER_API_KEY` | BRAK | Kolejki zadań i długie joby OCR/AI | Wymaga konfiguracji w fazie zadań trwałych
`STRIPE_SECRET_KEY` | BRAK | Płatności i obsługa subskrypcji | Wymaga konfiguracji w fazie billing
`OPENAI_API_KEY` | BRAK | Dostęp do modeli OpenAI | Wymaga konfiguracji w fazie AI pipeline
`ANTHROPIC_API_KEY` | BRAK | Dostęp do modeli Claude | Wymaga konfiguracji w fazie AI pipeline
`GEMINI_API_KEY` | BRAK | Dostęp do modeli Gemini | Wymaga konfiguracji w fazie AI pipeline
`GITHUB_TOKEN` | BRAK | Dostęp do GitHub API przez MCP | Dostęp zależny od autoryzacji MCP

*Uwaga: Wartości sekretów nigdy nie są logowane ani wypisywane w raportach.*

---

## 4. Dostęp do Oficjalnych Dokumentacji
- `https://antigravity.google/docs` — dostępne przez narzędzia webowe.
- `https://nextjs.org/docs` — dostępne przez `read_url_content`.
- `https://supabase.com/docs` — dostępne przez `read_url_content`.
- `https://trigger.dev/docs` — dostępne przez `read_url_content`.
- `https://docs.stripe.com` — dostępne przez `read_url_content`.
- `https://api.sejm.gov.pl/eli_pl.html` — publiczne API polskiego prawa (ISAP).
