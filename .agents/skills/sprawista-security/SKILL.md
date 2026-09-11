---
name: sprawista-security
description: >-
  Sprawdza model zagrożeń, uprawnienia, pliki niezaufane, obronę przed prompt injection, XSS, SSRF, sekrety, logowanie i usuwanie danych.
  Używaj tego skilla przy audytach bezpieczeństwa, przeglądach kodu przed wdrożeniem, konfiguracji nagłówków HTTP oraz weryfikacji ochrony tajemnicy kancelaryjnej.
---

# Skill: sprawista-security (Audyt Bezpieczeństwa, Ochrona Tajemnicy i Hardening)

Odpowiada za kompleksowe bezpieczeństwo aplikacji Sprawista. Chroni poufne akta sądowe przed wyciekiem, atakami typu Prompt Injection, naruszeniami integralności danych i nieautoryzowanym dostępem.

## 1. Kiedy Uruchamiać (Triggers)
- Przed każdym wdrożeniem do środowiska stagingowego i produkcyjnego.
- Po modyfikacji polityk RLS, logiki autoryzacji lub obsługi plików.
- Podczas dodawania nowej integracji zewnętrznej (API, webhooki).
- W ramach regularnego audytu bezpieczeństwa kodu i zależności.

## 2. Wymagane Dane Wejściowe
- Kod źródłowy komponentu, trasy API lub migracji bazy danych.
- Model zagrożeń (Threat Model) dla danego wektora ataku.

## 3. Procedura Krok po Kroku
1. **Audyt Niezaufanych Danych Wejściowych (PDF & Ingestion)**:
   - Sprawdź, czy wgrane pliki PDF nie są traktowane jako instrukcje wykonawcze.
   - Zweryfikuj obronę przed pośrednim Prompt Injection (Indirect Prompt Injection): treść dokumentu musi być zawsze izolowana w ściśle zdefiniowanych tagach danych i nie może posiadać uprawnień do wywoływania narzędzi.
2. **Kontrola Wycieków do Logów i Telemetrii**:
   - Przeskanuj kod pod kątem `console.log`, loggerów Winston/Pino.
   - Upewnij się, że żadne dane osobowe (PESEL, imiona stron, kwoty roszczeń, numery kont bankowych) ani fragmenty pism nie trafiają do logów aplikacyjnych ani zewnętrznych systemów śledzenia błędów (np. Sentry).
3. **Weryfikacja Podatności Webowych (OWASP Top 10)**:
   - **XSS**: Weryfikacja sanityzacji wyjść w edytorze TipTap i podglądzie dokumentów (brak renderowania nieoczyszczonego HTML).
   - **SSRF**: Zakaz pobierania zewnętrznych URL-i podanych bezpośrednio przez użytkownika bez białej listy domen.
   - **CSRF**: Ochrona mutacji i weryfikacja origin przy Server Actions i API routes.
4. **Hardening Nagłówków HTTP i Polityki CSP**:
   - Skonfiguruj rygorystyczne nagłówki w `next.config.ts`:
     - `Content-Security-Policy` (blokada niezaufanych skryptów).
     - `X-Frame-Options: DENY`.
     - `X-Content-Type-Options: nosniff`.
     - `Referrer-Policy: strict-origin-when-cross-origin`.
5. **Procedura Trwałego Usuwania Danych (Right to be Forgotten)**:
   - Zweryfikuj, czy funkcja usunięcia sprawy usuwa kaskadowo: rekordy w bazie, fragmenty wektorowe, pliki w prywatnym Storage oraz wpisy w cache.

## 4. Wymagany Wynik
- Raport audytu bezpieczeństwa ze statusem `PASS` lub listą podatności do natychmiastowego usunięcia.
- Potwierdzona zgodność z regułą `05-security-privacy.md`.

## 5. Warunki Odrzucenia Wyniku
- Obecność kluczy API, tokenów serwisowych lub haseł zaszytych na sztywno w kodzie.
- Wykonywanie kodu JavaScript zaszytego wewnątrz dokumentu PDF.
- Brak sanityzacji danych użytkownika przed wstawieniem do bazy danych lub interfejsu.

## 6. Sposób Weryfikacji
- Automatyczne skanowanie podatności zależności (`npm audit`).
- Testy penetracyjne ze spreparowanymi payloadami (np. prompt injection w teście ekstrakcji).

## 7. Odnośniki do Materiałów
- Reguła: [05-security-privacy.md](../../rules/05-security-privacy.md)
- Standardy OWASP: [docs/security/threat-model.md](../../../docs/security/threat-model.md)
