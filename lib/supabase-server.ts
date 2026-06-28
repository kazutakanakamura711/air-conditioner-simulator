import { createClient } from "@supabase/supabase-js";

function normalizeEnvValue(value: string): string {
  const trimmed = value.trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

function getJwtRoleIfAny(key: string): string | null {
  const parts = key.split(".");

  if (parts.length < 2) {
    return null;
  }

  try {
    const payload = Buffer.from(parts[1], "base64url").toString("utf8");
    const decoded = JSON.parse(payload) as { role?: unknown };
    return typeof decoded.role === "string" ? decoded.role : null;
  } catch {
    return null;
  }
}

export function getSupabaseAdmin() {
  const rawSupabaseUrl = process.env.SUPABASE_URL;
  const rawSupabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const supabaseUrl = rawSupabaseUrl
    ? normalizeEnvValue(rawSupabaseUrl)
    : undefined;
  const supabaseServiceRoleKey = rawSupabaseServiceRoleKey
    ? normalizeEnvValue(rawSupabaseServiceRoleKey)
    : undefined;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  }

  const role = getJwtRoleIfAny(supabaseServiceRoleKey);
  if (role === "anon") {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is anon. Set service_role key from Supabase Dashboard -> Project Settings -> API.",
    );
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
