import { supabase } from "@/services/supabase/supabaseClient";
import { useUserStore } from "@/stores/UserStore";

export async function signOut() {
  await supabase.auth.signOut();
  useUserStore.getState().signOut();
}
