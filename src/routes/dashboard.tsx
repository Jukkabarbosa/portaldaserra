import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Car, MessageCircle, Eye, TrendingUp, Plus, Settings, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function Stat({ icon: Icon, label, value, hint }: any) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <Icon className="h-4 w-4 text-secondary" />
      </div>
      <div className="font-display font-black text-3xl mt-2">{value}</div>
      {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
    </Card>
  );
}

function Dashboard() {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  React.useEffect(() => { if (!loading && !user) nav({ to: "/auth" }); }, [user, loading, nav]);
  if (loading || !user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-secondary mb-1">Painel do garagista</div>
            <h1 className="font-display font-black text-3xl">Olá, {user.email?.split("@")[0]}</h1>
            <p className="text-muted-foreground text-sm mt-1">Aqui está um resumo da sua garagem hoje.</p>
          </div>
          <Button className="bg-primary"><Plus className="h-4 w-4" /> Cadastrar veículo</Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat icon={Car} label="Veículos ativos" value="0" hint="de 10 do seu plano" />
          <Stat icon={Eye} label="Visualizações (30d)" value="0" hint="—" />
          <Stat icon={MessageCircle} label="Contatos recebidos" value="0" hint="—" />
          <Stat icon={TrendingUp} label="Taxa de conversão" value="0%" hint="—" />
        </div>

        <div className="grid lg:grid-cols-3 gap-4 mt-6">
          <Card className="p-6 lg:col-span-2">
            <h3 className="font-display font-bold text-lg mb-1">Comece a vender hoje</h3>
            <p className="text-sm text-muted-foreground">Cadastre seu primeiro veículo, organize sua garagem e ative seu plano.</p>
            <div className="grid sm:grid-cols-3 gap-3 mt-5">
              <Button variant="outline" className="justify-start h-auto py-3"><Plus className="h-4 w-4" /> Novo veículo</Button>
              <Button variant="outline" className="justify-start h-auto py-3"><Settings className="h-4 w-4" /> Minha garagem</Button>
              <Button variant="outline" asChild className="justify-start h-auto py-3"><Link to="/planos"><BarChart3 className="h-4 w-4" /> Ver planos</Link></Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-display font-bold text-lg mb-1">Status da assinatura</h3>
            <p className="text-sm text-muted-foreground">Você ainda não possui um plano ativo.</p>
            <Button asChild className="w-full mt-4 bg-gold text-[oklch(0.18_0.04_260)] hover:bg-gold/90"><Link to="/planos">Escolher plano</Link></Button>
          </Card>
        </div>

        <Card className="p-10 mt-6 text-center">
          <Car className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="font-display font-bold text-xl mt-4">Você ainda não tem veículos cadastrados</h3>
          <p className="text-muted-foreground text-sm mt-1 max-w-md mx-auto">
            Cadastre seu primeiro veículo para começar a receber contatos e visualizações.
          </p>
          <Button className="mt-5"><Plus className="h-4 w-4" /> Cadastrar primeiro veículo</Button>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
