# Architektura Frontendu (Next.js App Router & Server Components)

Dokument opisuje architekturę warstwy prezentacji Sprawisty.

---

## 1. Struktura Katalogów Frontendu
```
src/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Trasy uwierzytelniania (login, register)
│   ├── (dashboard)/            # Trasy zalogowanej kancelarii
│   │   ├── cases/              # Lista spraw i filtracja
│   │   ├── cases/[id]/         # Widok sprawy
│   │   │   ├── workspace/      # Dzielony pulpit edycji odpowiedzi na pozew
│   │   │   ├── documents/      # Zarządzanie aktami i załącznikami
│   │   │   └── adversarial/    # Raport analizy przeciwnej
│   │   └── settings/           # Ustawienia organizacji i subskrypcja
│   └── api/                    # Endpointy API i obsługa webhooków
├── presentation/               # Komponenty interfejsu użytkownika
│   ├── components/ui/          # Prymitywy bazowe (Button, Dialog, Popover)
│   ├── components/workspace/   # Komponenty pulpitu pracy z dokumentem
│   ├── components/dossier/     # Przeglądarka akt i selektywny viewer PDF
│   └── hooks/                  # Hooki React (fokus, skróty klawiszowe, resize)
```

---

## 2. Podział Odpowiedzialności: Server vs Client Components
- **Server Components (RSC)**:
  - Weryfikacja sesji użytkownika i pobieranie metadanych sprawy z Supabase.
  - Generowanie wstępnego HTML szkieletu bez przesyłania kodu JS do przeglądarki.
- **Client Components (`'use client'`)**:
  - `DocumentEditor`: integracja TipTap z rozszerzeniami znaczników dowodowych.
  - `DossierViewer`: interaktywny renderer PDF z synchronizacją podświetleń.
  - `SplitPaneDivider`: obsługa przeciągania i zmiany szerokości szpalt myszą/klawiaturą.
