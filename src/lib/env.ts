/**
 * Safe Environment Variable Handler for Prismora
 * Validates presence of necessary Supabase and app environment variables.
 */

interface EnvConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  appUrl: string;
  isConfigured: boolean;
}

export function getClientEnv(): EnvConfig {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const isConfigured = Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("your-project-ref") &&
    !supabaseAnonKey.includes("your-supabase-anon-key")
  );

  return {
    supabaseUrl,
    supabaseAnonKey,
    appUrl,
    isConfigured,
  };
}

export function assertEnv(): EnvConfig {
  const env = getClientEnv();
  if (!env.isConfigured) {
    console.warn(
      "[Prismora Env Warning] Supabase credentials are not configured in .env.local. " +
      "Application is running in local preview/unconfigured mode."
    );
  }
  return env;
}
