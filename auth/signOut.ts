import { supabase } from "@/services/supabase/supabaseClient";

export async function signOut() {
  await supabase.auth.signOut();
}
