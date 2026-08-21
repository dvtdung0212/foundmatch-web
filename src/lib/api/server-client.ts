import "server-only";

import { getApiClient } from "./client";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";

export async function getServerApiClient() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return getApiClient(session?.access_token);
}
