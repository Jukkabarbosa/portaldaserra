import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { brl } from "@/lib/format";

export const Route = createFileRoute("/admin/simulacoes")({
  component: SimulacoesAdmin,
});

function SimulacoesAdmin() {
  const nav = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  React.useEffect(() => {
    if (!loading && (!user || !isAdmin)) nav({ to: "/" });
  }, [user, isAdmin, loading, nav]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-simulacoes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financing_simulations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user && isAdmin,
  });

  if (loading || !user || !isAdmin) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-6xl">
        <div className="flex items-center gap-3 mb-2">
          <Calculator className="h-5 w-5 text-secondary" />
          <span className="text-xs uppercase tracking-[0.2em] text-secondary">Painel Admin</span>
        </div>
        <h1 className="font-display font-black text-3xl">Simulações de financiamento</h1>
        <p className="text-muted-foreground mt-1">{data?.length ?? 0} pedidos recebidos.</p>

        <div className="mt-6 space-y-3">
          {isLoading && <p className="text-sm text-muted-foreground">Carregando...</p>}
          {!isLoading && data?.length === 0 && (
            <Card className="p-10 text-center text-muted-foreground">Nenhuma simulação ainda.</Card>
          )}
          {data?.map((s) => (
            <Card key={s.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-display font-bold text-lg">{s.name}</div>
                  <div className="text-sm text-muted-foreground mt-0.5 flex flex-wrap gap-2">
                    {s.phone && <span>📱 {s.phone}</span>}
                    {s.email && <span>✉ {s.email}</span>}
                  </div>
                  {s.notes && <div className="text-sm mt-2"><strong>Interesse:</strong> {s.notes}</div>}
                </div>
                <Badge variant="outline" className="text-xs">
                  {new Date(s.created_at).toLocaleString("pt-BR")}
                </Badge>
              </div>
              <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                <div><div className="text-xs text-muted-foreground">Veículo</div><div className="font-bold">{brl(Number(s.vehicle_price))}</div></div>
                <div><div className="text-xs text-muted-foreground">Entrada</div><div className="font-bold">{brl(Number(s.down_payment))}</div></div>
                <div><div className="text-xs text-muted-foreground">Parcelas</div><div className="font-bold">{s.installments}x</div></div>
                <div><div className="text-xs text-muted-foreground">Parcela</div><div className="font-bold text-secondary">{brl(Number(s.monthly_payment))}</div></div>
                <div><div className="text-xs text-muted-foreground">Total</div><div className="font-bold">{brl(Number(s.total_amount))}</div></div>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
