import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import * as React from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Users, Car, DollarSign, Activity, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/admin")({ component: Admin });

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

function Admin() {
  const nav = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  React.useEffect(() => {
    if (!loading && (!user || !isAdmin)) nav({ to: "/" });
  }, [user, isAdmin, loading, nav]);
  if (loading || !user || !isAdmin) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="h-5 w-5 text-gold" />
          <span className="text-xs uppercase tracking-[0.2em] text-secondary">Painel Administrativo</span>
        </div>
        <h1 className="font-display font-black text-3xl">Visão geral da plataforma</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <Stat icon={Users} label="Garagens" value="0" hint="0 ativas" />
          <Stat icon={Car} label="Veículos" value="0" hint="0 anúncios ativos" />
          <Stat icon={DollarSign} label="Receita estimada" value="R$ 0" hint="mês atual" />
          <Stat icon={Activity} label="Leads gerados" value="0" hint="últimos 30 dias" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          <Card className="p-6 bg-gradient-to-br from-[var(--gold)]/15 to-transparent border-[var(--gold)]/30">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-2"><Sparkles className="h-3 w-3" /> Receita publicitária</div>
            <h3 className="font-display font-bold text-xl">Patrocinadores</h3>
            <p className="text-sm text-muted-foreground mt-1">Marcas parceiras, níveis e métricas.</p>
            <Button asChild className="mt-4" size="sm"><Link to="/admin/patrocinadores">Gerenciar <ArrowRight className="h-4 w-4 ml-1" /></Link></Button>
          </Card>

          <Card className="p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-secondary mb-2">Leads de financiamento</div>
            <h3 className="font-display font-bold text-xl">Simulações</h3>
            <p className="text-sm text-muted-foreground mt-1">Pedidos de proposta vindos do simulador.</p>
            <Button asChild variant="outline" className="mt-4" size="sm"><Link to="/admin/simulacoes">Ver lista <ArrowRight className="h-4 w-4 ml-1" /></Link></Button>
          </Card>

          <Card className="p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-secondary mb-2">Inteligência</div>
            <h3 className="font-display font-bold text-xl">Alertas inteligentes</h3>
            <p className="text-sm text-muted-foreground mt-1">Pessoas aguardando carro compatível.</p>
            <Button asChild variant="outline" className="mt-4" size="sm"><Link to="/admin/alertas">Ver lista <ArrowRight className="h-4 w-4 ml-1" /></Link></Button>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
