import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Power, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { brl } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/alertas")({
  component: AlertasAdmin,
});

function AlertasAdmin() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const { user, isAdmin, loading } = useAuth();
  React.useEffect(() => {
    if (!loading && (!user || !isAdmin)) nav({ to: "/" });
  }, [user, isAdmin, loading, nav]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-alertas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicle_alerts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user && isAdmin,
  });

  async function toggle(id: string, current: boolean) {
    const { error } = await supabase.from("vehicle_alerts").update({ is_active: !current }).eq("id", id);
    if (error) toast.error("Erro ao atualizar.");
    else { toast.success(current ? "Alerta desativado." : "Alerta reativado."); qc.invalidateQueries({ queryKey: ["admin-alertas"] }); }
  }
  async function remove(id: string) {
    if (!confirm("Excluir alerta permanentemente?")) return;
    const { error } = await supabase.from("vehicle_alerts").delete().eq("id", id);
    if (error) toast.error("Erro ao excluir.");
    else { toast.success("Alerta excluído."); qc.invalidateQueries({ queryKey: ["admin-alertas"] }); }
  }

  if (loading || !user || !isAdmin) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-6xl">
        <div className="flex items-center gap-3 mb-2">
          <Bell className="h-5 w-5 text-secondary" />
          <span className="text-xs uppercase tracking-[0.2em] text-secondary">Painel Admin</span>
        </div>
        <h1 className="font-display font-black text-3xl">Alertas inteligentes</h1>
        <p className="text-muted-foreground mt-1">{data?.length ?? 0} pessoas aguardando carro compatível.</p>

        <div className="mt-6 space-y-3">
          {isLoading && <p className="text-sm text-muted-foreground">Carregando...</p>}
          {!isLoading && data?.length === 0 && (
            <Card className="p-10 text-center text-muted-foreground">Nenhum alerta criado ainda.</Card>
          )}
          {data?.map((a) => (
            <Card key={a.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-display font-bold text-lg">{a.name ?? "—"}</div>
                    <Badge variant={a.is_active ? "default" : "outline"} className="text-xs">
                      {a.is_active ? "Ativo" : "Pausado"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{a.email}</div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    {a.brand && <span><strong>Marca:</strong> {a.brand}</span>}
                    {a.model && <span><strong>Modelo:</strong> {a.model}</span>}
                    {a.city && <span><strong>Cidade:</strong> {a.city}</span>}
                    {(a.price_min || a.price_max) && <span><strong>Preço:</strong> {a.price_min ? brl(Number(a.price_min)) : "—"} a {a.price_max ? brl(Number(a.price_max)) : "—"}</span>}
                    {a.year_min && <span><strong>Ano mín:</strong> {a.year_min}</span>}
                    {a.mileage_max && <span><strong>Km máx:</strong> {Number(a.mileage_max).toLocaleString("pt-BR")}</span>}
                  </div>
                  {a.last_notified_at && (
                    <div className="text-xs text-muted-foreground mt-2">
                      Último envio: {new Date(a.last_notified_at).toLocaleString("pt-BR")}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toggle(a.id, a.is_active)}>
                    <Power className="h-3.5 w-3.5" />{a.is_active ? "Pausar" : "Ativar"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => remove(a.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
