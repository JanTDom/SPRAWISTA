import { NextRequest, NextResponse } from "next/server";
import { defaultQuantumStrategyOptimizer } from "@/domain/services/quantum-strategy-optimizer";
import { CaseIssue } from "@/domain/models/evidence";
import { Matter } from "@/domain/models/matter";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const matter: Matter = body.matter;
    const issues: CaseIssue[] = body.issues || [];

    if (!matter || !issues) {
      return NextResponse.json(
        { error: "Wymagane parametry: matter oraz issues" },
        { status: 400 }
      );
    }

    const result = await defaultQuantumStrategyOptimizer.optimizeDefenseStrategy(
      matter,
      issues
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Błąd kwantowej optymalizacji strategii:", error);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas obliczeń optymalizacyjnych" },
      { status: 500 }
    );
  }
}
