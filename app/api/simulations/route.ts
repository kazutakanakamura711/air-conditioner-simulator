import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import type { SimulationParams } from "@/types/simulation";

const EXPIRES_DAYS = 30;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function buildPublicUrl(id: string): string {
  const fallback = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const baseUrl = fallback.endsWith("/") ? fallback.slice(0, -1) : fallback;
  return `${baseUrl}/result/${id}`;
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!isObject(body) || !isObject(body.params)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const expiresAt = new Date(Date.now() + EXPIRES_DAYS * 24 * 60 * 60 * 1000);
    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from("simulations")
      .insert({
        params: body.params as SimulationParams,
        expires_at: expiresAt.toISOString(),
      })
      .select("id, expires_at")
      .single();

    if (error || !data) {
      console.error("Failed to create simulation", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }

    const createdExpiresAt = new Date(data.expires_at);

    return NextResponse.json({
      id: data.id,
      url: buildPublicUrl(data.id),
      expiresAt: createdExpiresAt.toISOString(),
    });
  } catch (error) {
    console.error("Failed to create simulation", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
