const test = require("node:test");
const assert = require("node:assert/strict");

const {
  InMemoryMatterRepository,
} = require("../../src/domain/repositories/in-memory-matter-repository.ts");
const { AuthorizationError } = require("../../src/domain/repositories/matter-repository.ts");

test("Bezpieczeństwo wielodostępowe (Multitenancy) i izolacja kancelarii", async () => {
  const repo = new InMemoryMatterRepository();
  const matterId = "matter-abc-vs-xyz";

  // 1. Prawnik przypisany do sprawy w swojej organizacji ma pełny dostęp
  const aggregate = await repo.getMatterAggregate(
    matterId,
    "user-radca-adam",
    "org-kancelaria-demo"
  );
  assert.ok(aggregate);
  assert.equal(aggregate.matter.id, matterId);
  assert.equal(aggregate.documents.length, 10);
  assert.equal(aggregate.timeline.length, 7);

  // 2. Użytkownik z OBCEJ kancelarii otrzymuje bezwzględną odmowę dostępu (Cross-tenant leak prevention)
  await assert.rejects(
    async () => {
      await repo.getMatterAggregate(
        matterId,
        "user-obcy-adwokat",
        "org-obca-kancelaria"
      );
    },
    (err) => {
      assert.ok(err instanceof AuthorizationError);
      assert.ok(err.message.includes("Odmowa dostępu"));
      return true;
    }
  );

  // 3. Użytkownik z TEJ SAMEJ kancelarii, ale bez przypisania do sprawy (Chiński mur), otrzymuje odmowę
  await assert.rejects(
    async () => {
      await repo.getMatterAggregate(
        matterId,
        "user-asystent-bez-dostepu",
        "org-kancelaria-demo"
      );
    },
    (err) => {
      assert.ok(err instanceof AuthorizationError);
      assert.ok(err.message.includes("Brak przypisania do akt tej sprawy"));
      return true;
    }
  );
});
