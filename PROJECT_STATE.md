# PROJECT_STATE.md — Stan Projektu SPRAWISTA

**Ostatnia aktualizacja**: 2026-09-12  
**Status fazy**: Faza Produkcyjna (Web Deployment & Live Production) — Zakończona Pełnym Sukcesem

---

## 1. Wdrożenie Produkcyjne (Live Web)
- **Domena Główna**: [https://sprawista.pl](https://sprawista.pl) (przekierowanie 308 do `https://www.sprawista.pl/`)
- **Domena WWW**: [https://www.sprawista.pl](https://www.sprawista.pl) (pełna aplikacja produkcyjna, status HTTP 200)
- **Vercel Alias**: `https://sprawista.vercel.app`
- **Certyfikat SSL**: Let's Encrypt / Vercel (automatyczny, aktywny, HTTPS)
- **Konfiguracja DNS (nazwa.pl)**:
  - `sprawista.pl` -> Typ `A` -> `216.150.1.1` (status: `wykonany`, `Valid Configuration`)
  - `*.sprawista.pl` -> Typ `A` -> `216.150.1.1` (status: `wykonany`, `Valid Configuration`)
  - `www.sprawista.pl` -> Typ `CNAME` -> `8be676ab9f71b6c0.vercel-dns-016.com` (status: `wykonany`, `Valid Configuration`)
- **Hosting / PaaS**: Vercel (zespół `Political Dark Matter`, projekt `sprawista`, Next.js 15.2.8)
- **GitHub**: [https://github.com/JanTDom/SPRAWISTA](https://github.com/JanTDom/SPRAWISTA) (gałąź `main`, pełna historia)
- **Baza Danych**: Supabase (`vrucfsiwlqywtbgrubxa`, region `aws-0-eu-west-2`, zmienne środowiskowe skonfigurowane w Vercel)
- **Warstwa AI**: Gemini 2.5 Flash (`GEMINI_API_KEY` skonfigurowany w Vercel Environment Variables)

---

## 2. Działające Elementy i Trasy Live
- [x] `https://www.sprawista.pl/` — Strona główna z demonstratorem „Od zdania do dowodu”, 3 etapami procesu, podglądem Adversarial Review, audytu przed podpisem, cennikiem i FAQ.
- [x] `https://www.sprawista.pl/demo` — Pełnowymiarowy pulpit pracy z nową zakładką „Rejestry i Prawo”.
- [x] `https://www.sprawista.pl/app/sprawy` — Pulpit spraw kancelarii z filtrami, statusami i metrykami.
- [x] `https://www.sprawista.pl/app/sprawy/matter-synth-001/workspace` — Dedykowany pulpit pracy ze sprawą.
- [x] `https://www.sprawista.pl/jak-dziala` — Szczegółowa specyfikacja wieloetapowego procesu merytorycznego.
- [x] `https://www.sprawista.pl/bezpieczenstwo` — 7 filarów ochrony tajemnicy kancelaryjnej i zgodności z RODO/EOG.
- [x] `https://www.sprawista.pl/cennik` — Transparentny plan Kancelaria Pro (599 zł netto / m-c) bez ukrytych opłat.
- [x] `https://www.sprawista.pl/api/export/docx/matter-synth-001` — Generator DOCX z uwzględnieniem orzecznictwa SN i zarzutu braku umocowania.
- [x] `https://www.sprawista.pl/api/legal-research` — Endpoint badania prawnego (ISAP ELI, SAOS, EUR-Lex, asystent Gemini 2.5 Flash).

---

## 3. Zestaw Testów i Jakość
- **43 testy jednostkowe i integracyjne**: 100% pass (`npm test`).
- **TypeScript strict**: 0 błędów (`npx tsc --noEmit`).
- **Next.js**: 15.2.8 (załatana podatność CVE-2025-66478).
