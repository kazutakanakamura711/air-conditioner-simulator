import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Invalid simulation id" },
        { status: 400 },
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from("simulations")
      .select("id, params, created_at, expires_at")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Simulation not found" },
        { status: 404 },
      );
    }

    const expiresAt = new Date(data.expires_at);

    if (expiresAt.getTime() <= Date.now()) {
      return NextResponse.json(
        { error: "Simulation not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      id: data.id,
      params: data.params,
      createdAt: new Date(data.created_at).toISOString(),
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("Failed to get simulation", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
