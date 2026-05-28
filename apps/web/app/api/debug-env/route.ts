import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;

  return NextResponse.json({
    DATABASE_URL_present: !!dbUrl,
    DATABASE_URL_preview: dbUrl
      ? dbUrl.replace(/:([^:@]+)@/, ":***@").substring(0, 60) + "..."
      : "NOT SET",
    NODE_ENV: process.env.NODE_ENV,
  });
}