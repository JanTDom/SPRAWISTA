# Architektura Rozliczeń i Płatności (Stripe Billing)

Dokument opisuje integrację ze Stripe Checkout & Billing oraz zarządzanie subskrypcjami kancelarii.

---

## 1. Model Subskrypcyjny B2B
- **Plan Kancelaria Pro**: Ryczałt miesięczny lub roczny dla zespołów 2–20 prawników.
- **Zakres**:
  - Dostęp do pełnego procesu odpowiedzi na pozew o zapłatę.
  - Generowanie nieograniczonej liczby wersji roboczych pism.
  - Pakiet stron OCR i zapytań AI w cenie subskrypcji.

---

## 2. Obsługa Webhooków i Idempotencja
- Każde przychodzące zdarzenie Stripe przechodzi weryfikację podpisu: `stripe.webhooks.constructEvent`.
- Tabela `billing_events` zapobiega podwójnemu procesowaniu (`ON CONFLICT (stripe_event_id) DO NOTHING`).
- Status subskrypcji w tabeli `organizations` jest synchronizowany natychmiast po otrzymaniu zdarzenia.
