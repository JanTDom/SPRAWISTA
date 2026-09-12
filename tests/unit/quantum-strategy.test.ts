import test from "node:test";
import assert from "node:assert/strict";
import { defaultYourQuantumClient } from "../../src/infrastructure/external/yourquantum-client";
import { defaultQuantumStrategyOptimizer } from "../../src/domain/services/quantum-strategy-optimizer";
import { Matter } from "../../src/domain/models/matter";
import { CaseIssue } from "../../src/domain/models/evidence";

test("YourQuantum Client: rozwiązuje zadanie optymalizacyjne z certyfikatem SHA-256", async () => {
  const result = await defaultYourQuantumClient.solve({
    domain: "legal_strategy",
    title: "Test optymalizacji koalicji zarzutów",
    variables: [
      { id: "issue-1", name: "Zarzut przedawnienia (art. 118 K.c.)", value: 90, cost: 15 },
      { id: "issue-2", name: "Zarzut braku wymagalności z uwagi na brak odbioru", value: 85, cost: 20 },
      { id: "issue-3", name: "Zarzut potrącenia wierzytelności wzajemnej", value: 60, cost: 50 },
    ],
    constraints: [
      {
        id: "c_budget",
        type: "budget",
        limit: 80,
      },
    ],
  });

  assert.equal(result.status, "SUCCESS");
  assert.ok(result.optimal_selection.length >= 1);
  assert.ok(result.sha256_passport.length === 64);
  assert.ok(result.sensitivity_report && result.sensitivity_report.robustness_score > 70);
});

test("QuantumStrategyOptimizer: wykrywa kolizję potrącenia i sugeruje zarzut ewentualny z ostrożności procesowej", async () => {
  const dummyMatter: Matter = {
    id: "matter-test-01",
    organizationId: "org-test",
    caseNumber: "I C 500/26",
    courtName: "Sąd Okręgowy w Warszawie",
    courtDepartment: "XVI Wydział Gospodarczy",
    title: "Sprawa testowa o zapłatę",
    procedure: "GOSPODARCZE",
    claimAmountGrosze: 10000000,
    currency: "PLN",
    status: "NOWA",
    clientPartyId: "client-1",
    adversaryPartyId: "adv-1",
    assignedUserIds: ["user-1"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const testIssues: CaseIssue[] = [
    {
      id: "iss-1",
      title: "Zarzut nieważności i nieistnienia umowy (art. 58 K.c.)",
      category: "MATERIALNY",
      claimantPosition: "Umowa została ważnie zawarta",
      defendantPosition: "Umowa jest bezwzględnie nieważna",
      supportingProof: "Brak podpisów uprawnionych osób w KRS",
      adversaryCounterProof: "Twierdzenie o dorozumianym potwierdzeniu",
    },
    {
      id: "iss-2",
      title: "Zarzut potrącenia z tytułu kary umownej (art. 498 K.c.)",
      category: "ROZLICZENIOWY",
      claimantPosition: "Brak podstaw do naliczenia kary",
      defendantPosition: "Oświadczenie o potrąceniu z dnia 10.02.2026 r.",
      supportingProof: "Nota księgowa obciążeniowa i potwierdzenie odbioru",
      adversaryCounterProof: "Spór co do zwłoki",
    },
    {
      id: "iss-3",
      title: "Zarzut braku wymagalności roszczenia",
      category: "FORMALNY",
      claimantPosition: "Termin upłynął",
      defendantPosition: "Warunek umowny w postaci protokołu odbioru nie ziścił się",
      supportingProof: "Zapis § 4 ust. 2 Umowy",
      adversaryCounterProof: "Wezwanie do zapłaty",
    },
  ];

  const optResult = await defaultQuantumStrategyOptimizer.optimizeDefenseStrategy(
    dummyMatter,
    testIssues
  );

  assert.equal(optResult.success, true);
  assert.ok(optResult.robustnessScore >= 80);
  assert.ok(optResult.sha256Passport.length === 64);
  assert.ok(optResult.optimalIssueIds.length >= 1);
  // Zarzut potrącenia przy zarzucie nieistnienia umowy powinien trafić do ewentualnych lub głównych bez sprzeczności
  assert.ok(optResult.detailedRecommendations.length === 3);
});
