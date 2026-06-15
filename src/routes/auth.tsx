import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({ component: AuthPage });

async function getSupabaseBrowserClient() {
  const mod = await import("@/integrations/supabase/client");
  return mod.supabase;
}

function AuthPage() {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => { if (!loading && user) nav({ to: "/dashboard" }); }, [user, loading, nav]);

  async function onLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true);
    const f = new FormData(e.currentTarget);
    const supabase = await getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(f.get("email")), password: String(f.get("password")),
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Bem-vindo de volta!");
    nav({ to: "/dashboard" });
  }

  async function onSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true);
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    const password = String(f.get("password"));
    const fullName = String(f.get("name"));
    const garageName = String(f.get("garage"));
    const wantsGaragista = !!f.get("garagista");
    const supabase = await getSupabaseBrowserClient();

    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName },
      },
    });
    if (error) { setBusy(false); return toast.error(error.message); }

    if (wantsGaragista && data.user) {
      const slug = (garageName || fullName).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")
        .replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"") + "-" + Math.random().toString(36).slice(2,6);
      await supabase.from("garages").insert({ owner_id: data.user.id, name: garageName || "Minha Garagem", slug });
      await supabase.from("user_roles").insert({ user_id: data.user.id, role: "garagista" });
    }
    setBusy(false);
    toast.success("Conta criada! Verifique seu email se necessário.");
    nav({ to: "/dashboard" });
  }

  async function google() {
    const { lovable } = await import("@/integrations/lovable/index");
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) toast.error("Erro ao entrar com Google");
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative gradient-navy text-white p-12 flex-col justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="" className="h-10 w-10" />
          <div>
            <div className="font-display font-black tracking-tight">PORTAL DA SERRA</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/70">Marketplace Automotivo</div>
          </div>
        </Link>
        <div>
          <h2 className="font-display font-black text-4xl leading-tight">
            "Clientes encontram. <br /><span className="gradient-gold-text">Garagens vendem.</span> <br />A plataforma conecta."
          </h2>
          <p className="text-white/70 mt-3 text-sm">Junte-se às melhores garagens da serra gaúcha.</p>
        </div>
        <div className="text-xs text-white/60">© {new Date().getFullYear()} Portal da Serra</div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <Card className="w-full max-w-md p-8">
          <h1 className="font-display font-black text-2xl">Acesse sua conta</h1>
          <p className="text-sm text-muted-foreground mt-1">Faça login ou crie sua conta de garagista.</p>

          <Tabs defaultValue="login" className="mt-6">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={onLogin} className="space-y-3 mt-4">
                <div><Label>Email</Label><Input name="email" type="email" required /></div>
                <div><Label>Senha</Label><Input name="password" type="password" required minLength={6} /></div>
                <Button type="submit" className="w-full" disabled={busy}>{busy ? "Entrando..." : "Entrar"}</Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={onSignup} className="space-y-3 mt-4">
                <div><Label>Nome completo</Label><Input name="name" required /></div>
                <div><Label>Email</Label><Input name="email" type="email" required /></div>
                <div><Label>Senha</Label><Input name="password" type="password" required minLength={6} /></div>
                <label className="flex items-center gap-2 text-sm pt-1">
                  <input type="checkbox" name="garagista" defaultChecked /> Sou garagista / quero anunciar
                </label>
                <div><Label>Nome da garagem</Label><Input name="garage" placeholder="Opcional" /></div>
                <Button type="submit" className="w-full" disabled={busy}>{busy ? "Criando..." : "Criar conta"}</Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Ou</span></div>
          </div>
          <Button variant="outline" className="w-full" onClick={google}>
            Continuar com Google
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Ao continuar, você concorda com nossos termos e política de privacidade.
          </p>
        </Card>
      </div>
    </div>
  );
}
