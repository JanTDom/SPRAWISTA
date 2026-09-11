---
name: sprawista-billing
description: >-
  Implementuje prosty, zrozumiały plan subskrypcyjny, limity, webhooki Stripe, portal klienta i rozliczanie kancelarii.
  Używaj tego skilla przy integracji ze Stripe, obsłudze zdarzeń płatniczych, zarządzaniu subskrypcjami i rozdzielaniu trybu testowego od produkcji.
---

# Skill: sprawista-billing (Subskrypcje Kancelaryjne i Integracja Stripe)

Odpowiada za monetyzację Sprawisty w modelu B2B SaaS. Zapewnia przejrzyste plany subskrypcyjne dla kancelarii, bezpieczną obsługę płatności przez Stripe Checkout & Billing oraz automatyczną obsługę cyklu życia konta.

## 1. Kiedy Uruchamiać (Triggers)
- Przy implementacji tras płatności (`/api/billing/checkout`, `/api/billing/portal`).
- Przy konfiguracji i obsłudze webhooków Stripe (`/api/webhooks/stripe`).
- Przy wdrażaniu sprawdzania limitów spraw lub pakietów stron akt w kancelarii.

## 2. Wymagane Dane Wejściowe
- Model organizacji (`organizationId`, `stripeCustomerId`, `subscriptionStatus`).
- Identyfikator wybranego planu (Stripe Price ID).
- Klucze API Stripe (z rozróżnieniem środowiska Test vs Live).

## 3. Procedura Krok po Kroku
1. **Zasada Jednego Zrozumiałego Planu**:
   - Skoncentruj się na jednym, transparentnym planie dla kancelarii (np. Kancelaria Pro: ryczałt miesięczny/roczny obejmujący do 5 stanowisk prawników i nielimitowane podstawowe analizy odpowiedzi na pozew).
2. **Bezpieczna Obsługa Stripe Checkout & Customer Portal**:
   - Utwórz sesję Stripe Checkout z przekazaniem `client_reference_id = organizationId`.
   - Zapewnij odnośnik do Stripe Customer Portal umożliwiający samodzielne pobieranie faktur VAT i zmianę karty płatniczej.
3. **Idempotentna Obsługa Webhooków Stripe**:
   - Zweryfikuj podpis cyfrowy zdarzenia (`stripe.webhooks.constructEvent(body, signature, secret)`).
   - Obsłuż kluczowe typy zdarzeń:
     - `checkout.session.completed`: aktywacja subskrypcji organizacji.
     - `customer.subscription.updated`: aktualizacja statusu (np. `active`, `past_due`).
     - `customer.subscription.deleted`: dezaktywacja uprawnień po zakończeniu okresu.
     - `invoice.payment_succeeded`: przedłużenie ważności konta.
     - `invoice.payment_failed`: ostrzeżenie i okres karencji bez natychmiastowej blokady dostępu do trwających spraw.
   - Zapisz `eventId` w tabeli zdarzeń przetworzonych, aby zapobiec wielokrotnemu wykonaniu tej samej operacji.
4. **Ścisła Separacja Trybu Testowego i Produkcji**:
   - Klucze `sk_test_...` oraz `pk_test_...` mogą być używane wyłącznie w środowisku development/staging.
   - Zakaz łączenia bazy stagingowej z produkcyjnym kontem Stripe i odwrotnie.

## 4. Wymagany Wynik
- Działający moduł subskrypcyjny w `src/infrastructure/billing/`.
- Zabezpieczony endpoint webhooka z pełną weryfikacją podpisów.

## 5. Warunki Odrzucenia Wyniku
- Brak weryfikacji podpisu cyfrowego webhooka Stripe (podatność na fałszywe powiadomienia).
- Przetwarzanie numerów kart kredytowych na własnych serwerach (złamanie wymogów PCI-DSS — płatności muszą być w 100% delegowane do Stripe).
- Zablokowanie dostępu do historycznych spraw bez okresu karencji w przypadku nieudanego obciążenia karty.

## 6. Sposób Weryfikacji
- Test integracyjny symulujący nadejście webhooka `checkout.session.completed` z poprawnym podpisem Stripe.
- Sprawdzenie prawidłowej zmiany statusu w bazie danych organizacji.

## 7. Odnośniki do Materiałów
- Oficjalna dokumentacja: `https://docs.stripe.com`
- Reguła: [03-engineering.md](../../rules/03-engineering.md)
- Architektura rozliczeń: [architecture/billing.md](../../../docs/architecture/billing.md)
