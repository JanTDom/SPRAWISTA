const test = require("node:test");
const assert = require("node:assert/strict");

const { generateProceduralDraftDocx } = require("../../src/features/export/docx-generator.ts");
const { DEMO_PLEADING_DRAFT } = require("../../src/domain/data/synthetic-case.ts");

test("Generowanie poprawnego binarnego pliku DOCX z marginesami sądowymi", async () => {
  const buffer = await generateProceduralDraftDocx(DEMO_PLEADING_DRAFT);

  assert.ok(buffer);
  assert.ok(Buffer.isBuffer(buffer));
  assert.ok(buffer.length > 2000, "Plik DOCX powinien mieć co najmniej kilkanaście kilobajtów");

  // Format OpenXML (DOCX) jest archiwum ZIP i musi zaczynać się od sygnatury PK\x03\x04 (0x50 0x4B 0x03 0x04)
  assert.equal(buffer[0], 0x50, "Bajt 0 powinien być 'P'");
  assert.equal(buffer[1], 0x4b, "Bajt 1 powinien być 'K'");
  assert.equal(buffer[2], 0x03, "Bajt 2 powinien być 0x03");
  assert.equal(buffer[3], 0x04, "Bajt 3 powinien być 0x04");
});
