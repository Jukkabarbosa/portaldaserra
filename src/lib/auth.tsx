import * as React from "react";
import type { Session, User } from "@supabase/supabase-js";

type Role = "admin" | "garagista" | "cliente";

type AuthState = {
  user: User | null;
  session: Session | null;
  roles: Role[];
  loading: boolean;
  isAdmin: boolean;
  isGaragista: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const Ctx = React.createContext<AuthState>({
  user: null, session: null, roles: [], loading: true,
  isAdmin: false, isGaragista: false,
  signOut: async () => {}, refresh: async () => {},
});

async function getSupabaseBrowserClient() {
  const mod = await import("@/integrations/supabase/client");
  return mod.supabase;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadRoles = React.useCallback(async (uid: string | undefined) => {
    if (!uid) { setRoles([]); return; }
    const supabase = await getSupabaseBrowserClient();
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    setRoles((data ?? []).map((r: any) => r.role as Role));
  }, []);

  React.useEffect(() => {
    let mounted = true;
    let unsubscribe: (() => void) | undefined;

    void (async () => {
      const supabase = await getSupabaseBrowserClient();
      if (!mounted) return;

      const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
        setSession(s);
        setTimeout(() => {
          void loadRoles(s?.user?.id);
        }, 0);
      });

      unsubscribe = () => sub.subscription.unsubscribe();

      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      setSession(data.session);
      await loadRoles(data.session?.user?.id);
      if (mounted) setLoading(false);
    })().catch(() => {
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      unsubscribe?.();
    };
  }, [loadRoles]);

  const value: AuthState = {
    user: session?.user ?? null,
    session,
    roles,
    loading,
    isAdmin: roles.includes("admin"),
    isGaragista: roles.includes("garagista"),
    signOut: async () => {
      const supabase = await getSupabaseBrowserClient();
      await supabase.auth.signOut();
    },
    refresh: async () => { await loadRoles(session?.user?.id); },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAuth = () => React.useContext(Ctx);
