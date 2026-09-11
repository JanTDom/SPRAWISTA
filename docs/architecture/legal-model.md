# Model Ontologiczny Informacji Prawnej (Legal Knowledge Model)

Dokument określa sposób reprezentacji wiedzy prawniczej i faktów procesowych w systemie Sprawista.

---

## 1. Statusy Ontologiczne (Ontological Categories)
Każdy element wiedzy w systemie posiada przypisany jeden z siedmiu niezmiennych typów:

```typescript
export type FactStatus =
  | 'CLAIM_CLAIMANT'      // Twierdzenie powoda z pozwu
  | 'CLAIM_DEFENDANT'     // Twierdzenie pozwanego
  | 'DOCUMENT_CONTENT'    // Dosłowna treść dokumentu z akt (umowa, faktura)
  | 'RULING_FINDING'      // Teza z weryfikowalnego orzeczenia SN/SA
  | 'AI_HYPOTHESIS'       // Wstępna hipoteza analityczna systemu
  | 'LAWYER_ASSESSMENT'   // Merytoryczne stanowisko pełnomocnika
  | 'ACCEPTED_FINDING';   // Zaakceptowany fakt bezsporny
```

---

## 2. Rygor Prekluzji Dowodowej w Postępowaniu Gospodarczym
Zgodnie z art. 458[5] § 1 K.p.c.:
„Pozwany jest obowiązany powołać wszystkie twierdzenia i dowody w odpowiedzi na pozew”.
Sprawista automatycznie wymusza ten rygor, tworząc dla spraw gospodarczych listę kontrolną weryfikującą, czy każdy sporny fakt z pozwu został wyraźnie zaprzeczony (art. 230 K.p.c.) oraz czy załączono dowód z dokumentu.
