import { NextResponse } from "next/server";
export const runtime = "nodejs";
export async function GET(){
  const configured=Boolean(process.env.OPENAI_API_KEY);
  return NextResponse.json({
    mode:configured?"ai-configured":"demo",
    configured,
    message:configured?"AI key is configured; requests will attempt model-powered tool use.":"No API key configured. The research tools run in clearly labeled deterministic demo mode."
  },{headers:{"Cache-Control":"no-store"}});
}
