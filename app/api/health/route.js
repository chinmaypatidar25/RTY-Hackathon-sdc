import { NextResponse } from "next/server";

// Useful for validating a local installation and automated runtime smoke tests.
export const runtime = "nodejs";
export async function GET() {
  return NextResponse.json(
    {status:"ok", app:"DealLens AI", version:"0.1.0"},
    {headers:{"Cache-Control":"no-store"}}
  );
}
