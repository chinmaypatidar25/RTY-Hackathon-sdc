import { NextResponse } from "next/server";
import { researchProject } from "../../../lib/project-research.js";
import { answerProjectQuestion } from "../../../lib/project-chat.js";

export async function POST(request) {
  const input = await request.json().catch(() => null);
  const name = typeof input?.name === "string" ? input.name.trim() : "";
  const location = typeof input?.location === "string" ? input.location.trim() : "";
  if (name.length < 2 || name.length > 120 || location.length < 2 || location.length > 120) {
    return NextResponse.json({error:"Enter a project name and location, each between 2 and 120 characters."}, {status:400});
  }

  const report = researchProject(name, location);
  if (!report) {
    return NextResponse.json({
      error:"This project and location don’t match our current Gurugram research. Check the project phase and sector, or try one of the projects below."
    }, {status:404});
  }
  if (input.question === undefined) return NextResponse.json(report);

  const question = typeof input.question === "string" ? input.question.trim() : "";
  if (question.length < 3 || question.length > 1200) {
    return NextResponse.json({error:"Enter a question between 3 and 1,200 characters."}, {status:400});
  }
  return NextResponse.json(answerProjectQuestion(report, question));
}
