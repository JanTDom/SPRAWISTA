/**
 * Generator Pism Procesowych DOCX zgodny z polskim standardem sądownictwa cywilnego (K.p.c.)
 * Biblioteka: docx
 */

import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  convertMillimetersToTwip,
  Packer,
} from "docx";
import { ProceduralDraft } from "../../domain/models/pleading";

export async function generateProceduralDraftDocx(draft: ProceduralDraft): Promise<Buffer> {
  // Marginesy sądowe: Lewy 35mm (na oprawę akt), Prawy 15mm, Górny 25mm, Dolny 25mm
  const leftMarginTwip = convertMillimetersToTwip(35);
  const rightMarginTwip = convertMillimetersToTwip(15);
  const topMarginTwip = convertMillimetersToTwip(25);
  const bottomMarginTwip = convertMillimetersToTwip(25);

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Times New Roman",
            size: 24, // 12pt (24 half-points)
            color: "000000",
          },
          paragraph: {
            spacing: {
              line: 360, // Interlinia 1.5 wiersza (240 * 1.5 = 360 twips)
              after: 120, // 6pt po akapicie
            },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: topMarginTwip,
              bottom: bottomMarginTwip,
              left: leftMarginTwip,
              right: rightMarginTwip,
            },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "Strona ",
                    font: "Times New Roman",
                    size: 20,
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: "Times New Roman",
                    size: 20,
                  }),
                  new TextRun({
                    text: " z ",
                    font: "Times New Roman",
                    size: 20,
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    font: "Times New Roman",
                    size: 20,
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // 1. Miejscowość i data (wyrównane do prawej)
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: `${draft.courtHeader.city}, dnia ${draft.courtHeader.date}`,
                font: "Times New Roman",
                size: 24,
              }),
            ],
          }),

          // 2. Oznaczenie Sądu (do prawej/lewej)
          new Paragraph({
            spacing: { before: 240, after: 60 },
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: draft.courtHeader.courtName,
                bold: true,
                font: "Times New Roman",
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: draft.courtHeader.department,
                font: "Times New Roman",
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: `Sygn. akt: ${draft.courtHeader.caseNumber}`,
                bold: true,
                font: "Times New Roman",
                size: 24,
              }),
            ],
          }),

          // 3. Strony procesu (tabela bez ramek)
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: "auto" },
              bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
              left: { style: BorderStyle.NONE, size: 0, color: "auto" },
              right: { style: BorderStyle.NONE, size: 0, color: "auto" },
              insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
              insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Powód:", bold: true, size: 24 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 75, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: draft.claimantRepresentation, size: 24 })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "Pozwany:", bold: true, size: 24 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 75, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: draft.defendantRepresentation, size: 24 })],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: "W.P.S.:", bold: true, size: 24 })],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 75, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: draft.valueOfDispute, size: 24 })],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // 4. Tytuł pisma
          new Paragraph({
            spacing: { before: 360, after: 240 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: draft.title.toUpperCase(),
                bold: true,
                font: "Times New Roman",
                size: 28, // 14pt
              }),
            ],
          }),

          // 5. Wstęp i wnioski (Petitum)
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: "Działając w imieniu pozwanego, na podstawie załączonego pełnomocnictwa, niniejszym:",
                size: 24,
              }),
            ],
          }),

          // Punkty petitum
          ...draft.petitumPoints.map(
            (point, index) =>
              new Paragraph({
                spacing: { before: 60, after: 60 },
                alignment: AlignmentType.JUSTIFIED,
                indent: { left: convertMillimetersToTwip(10) },
                children: [
                  new TextRun({
                    text: `${index + 1}. `,
                    bold: true,
                    size: 24,
                  }),
                  new TextRun({
                    text: point,
                    size: 24,
                  }),
                ],
              })
          ),

          // Wnioski dowodowe
          new Paragraph({
            spacing: { before: 240, after: 120 },
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "WNIOSKI DOWODOWE",
                bold: true,
                size: 24,
              }),
            ],
          }),
          ...draft.evidentiaryMotions.map(
            (motion, index) =>
              new Paragraph({
                spacing: { before: 40, after: 40 },
                alignment: AlignmentType.JUSTIFIED,
                indent: { left: convertMillimetersToTwip(10) },
                children: [
                  new TextRun({
                    text: `• `,
                    bold: true,
                    size: 24,
                  }),
                  new TextRun({
                    text: motion,
                    size: 24,
                  }),
                ],
              })
          ),

          // 6. Uzasadnienie (rozdziały i akapity)
          ...draft.sections.flatMap((section) => [
            new Paragraph({
              spacing: { before: 300, after: 120 },
              alignment: AlignmentType.LEFT,
              children: [
                new TextRun({
                  text: section.title,
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            ...section.contentMarkdown.split("\n\n").map(
              (paraText) =>
                new Paragraph({
                  spacing: { before: 60, after: 60 },
                  alignment: AlignmentType.JUSTIFIED,
                  indent: { firstLine: convertMillimetersToTwip(12.5) }, // Wcięcie akapitowe 1.25 cm
                  children: [
                    new TextRun({
                      text: paraText.replace(/[*_#]/g, "").trim(),
                      size: 24,
                    }),
                  ],
                })
            ),
          ]),

          // 7. Podpis pełnomocnika
          new Paragraph({
            spacing: { before: 480, after: 360 },
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: "...........................................................\n(podpis pełnomocnika pozwanego)",
                font: "Times New Roman",
                size: 22,
                italics: true,
              }),
            ],
          }),

          // 8. Spis załączników
          new Paragraph({
            spacing: { before: 240, after: 120 },
            children: [
              new TextRun({
                text: "Załączniki:",
                bold: true,
                size: 24,
              }),
            ],
          }),
          ...draft.annexes.map(
            (annex, idx) =>
              new Paragraph({
                spacing: { before: 30, after: 30 },
                children: [
                  new TextRun({
                    text: `${idx + 1}. ${annex}`,
                    size: 22,
                  }),
                ],
              })
          ),
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}
