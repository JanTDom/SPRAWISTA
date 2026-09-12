import { NextRequest, NextResponse } from "next/server";
import { defaultMatterRepository } from "@/domain/repositories/in-memory-matter-repository";
import { generateProceduralDraftDocx } from "@/features/export/docx-generator";
import { ProceduralDraft } from "@/domain/models/pleading";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ matterId: string }> }
) {
  try {
    const { matterId } = await params;
    const userId = "user-radca-adam";
    const orgId = "org-kancelaria-demo";

    const aggregate = await defaultMatterRepository.getMatterAggregate(
      matterId,
      userId,
      orgId
    );

    const docxBuffer = await generateProceduralDraftDocx(aggregate.draft);
    const safeCaseNum = aggregate.matter.caseNumber.replace(/[\/\s]/g, "_");
    const filename = `Odpowiedz_na_pozew_${safeCaseNum}.docx`;

    return new NextResponse(new Uint8Array(docxBuffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
        "Content-Length": docxBuffer.length.toString(),
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Błąd serwera";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

/**
 * Obsługa eksportu zmodyfikowanego w locie pisma przez prawnika (Lawyer-in-the-loop)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ matterId: string }> }
) {
  try {
    const { matterId } = await params;
    const body = await request.json();
    const draft: ProceduralDraft = body.draft;

    if (!draft) {
      return NextResponse.json({ error: "Brak obiektu draft" }, { status: 400 });
    }

    const docxBuffer = await generateProceduralDraftDocx(draft);
    const safeCaseNum = (draft.courtHeader?.caseNumber || matterId).replace(/[\/\s]/g, "_");
    const filename = `Odpowiedz_na_pozew_${safeCaseNum}.docx`;

    return new NextResponse(new Uint8Array(docxBuffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
        "Content-Length": docxBuffer.length.toString(),
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Błąd eksportu DOCX";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
