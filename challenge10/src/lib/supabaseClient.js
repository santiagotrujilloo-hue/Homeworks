import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const configurado =
  supabaseUrl?.startsWith("https://") &&
  supabaseKey &&
  !supabaseKey.includes("PEGA_AQUI");

// Evitar que la aplicación quede en blanco si falta .env.local
export const supabase = configurado
  ? createClient(supabaseUrl, supabaseKey)
  : null;