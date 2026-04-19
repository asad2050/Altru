import { createBrowserClient as createSupabaseBrowserClient, createServerClient as createSupabaseServerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

let browserClientInstance: any;

// Client for use in Client Components
export const createBrowserClient = () => {
  if (browserClientInstance) return browserClientInstance;

  browserClientInstance = createSupabaseBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  );

  return browserClientInstance;
};

// Client for use in Server Components/Actions/Middleware
export const createServerClient = (cookieStore: any) => createSupabaseServerClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: any) {
        try {
          cookiesToSet.forEach(({ name, value, options }: any) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  }
);

// General purpose client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
