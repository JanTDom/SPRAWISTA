# 03-engineering: Zasady Inżynieryjne i Architektura Systemu

## 1. Stos Technologiczny (Production Stack)
- **Framework**: Next.js (App Router, React Server Components).
- **Język**: TypeScript w najostrzejszym trybie (`strict: true`, zakaz typu `any`).
- **Styling**: Tailwind CSS + system tokenów oparty na OKLCH / CSS variables.
- **Komponenty bazowe**: Radix UI / shadcn/ui (pełna dostępność, focus management, ARIA).
- **Baza danych i Auth**: Supabase (PostgreSQL 15+, Row Level Security, Supabase Auth).
- **Prywatne Storage**: Supabase Storage z szyfrowaniem i podpisanymi adresami URL (Signed URLs).
- **Kolejki i zadania trwałe**: Trigger.dev v3 (odporne na timeouty, wznawialne, monitorowane).
- **Generowanie dokumentów**: Dedykowany moduł DOCX oparty na bibliotece `docx` z walidacją struktury XML.
- **Edytor tekstu**: TipTap / ProseMirror z własnymi rozszerzeniami dla znaczników dowodowych i cytowań.
- **Płatności**: Stripe Checkout & Billing (webhooki z weryfikacją podpisu, idempotencja zdarzeń).

## 2. Architektura i Separacja Warstw (Modular Monolith)
Stosujemy architekturę pionowych wycinków (Vertical Slice) w ramach modularnego monolitu:
- `src/domain/`: Czysta logika biznesowa i procesowa, reguły prawne, kalkulatory terminów i odsetek, walidatory. Zero zależności od Reacta i bazy danych.
- `src/application/`: Przypadki użycia (use cases), orkiestracja zadań AI, pipeline ekstrakcji, koordynacja workflow.
- `src/infrastructure/`: Adaptery bazodanowe (Supabase/Prisma/Drizzle), klienci AI, OCR, storage, systemy kolejkowe, maile.
- `src/presentation/`: Komponenty React (Server Components jako szkielet, Client Components wyłącznie na liściach interakcji).

## 3. Żelazne Zasady Implementacji
1. **Server-First**: Każdy komponent jest domyślnie Server Componentem. Dyrektywa `'use client'` trafia wyłącznie tam, gdzie zachodzi mutacja stanu w przeglądarce, nasłuchiwanie zdarzeń lub integracja z edytorem.
2. **Pełne Bezpieczeństwo Typów (End-to-End Type Safety)**: Wszystkie dane wejściowe z formularzy, API, webhooków i odpowiedzi LLM są walidowane za pomocą schematów `Zod`.
3. **Izolacja Długich Zadań (Durable Jobs)**: Przetwarzanie wielostronicowych akt, OCR, ekstrakcja wektorowa i analiza wieloetapowa NIE MOGĄ działać w zwykłym zapytaniu HTTP (ryzyko 504 Gateway Timeout). Muszą być zlecane do Trigger.dev z raportowaniem postępu przez Server-Sent Events (SSE) lub polling stanu zadania.
4. **Idempotencja**: Każde zadanie analityczne lub płatnicze posiada unikalny `idempotencyKey`. Ponowne kliknięcie nie może podwoić kosztu ani wygenerować zduplikowanych zarzutów w sprawie.
5. **Zero Sekretów po Stronie Klienta**: Zmienne środowiskowe z kluczami API (OpenAI, Anthropic, Gemini, Supabase Service Role, Stripe Secret) są rygorystycznie chronione przed wyciekiem do bundla przeglądarki (`NEXT_PUBLIC_` wyłącznie dla publicznych adresów).
6. **Zero Danych Klienta w Publicznym Cache**: Standardowy cache Next.js (`unstable_cache`, `fetch cache`) musi być precyzyjnie skonfigurowany z `cache: 'no-store'` dla wszystkich danych akt i projektów pism.
7. **Brak Danych w localStorage**: Przeglądarkowy `localStorage` nie służy do przechowywania akt, treści pozwów ani danych osobowych. Służy wyłącznie do preferencji interfejsu (np. szerokość zwiniętego panelu).
