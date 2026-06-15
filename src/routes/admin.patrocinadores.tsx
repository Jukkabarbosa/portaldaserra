import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import * as React from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { TIER_META, TIER_ORDER, type SponsorTier } from "@/lib/sponsor-utils";
import { Plus, Pencil, Trash2, ExternalLink, ArrowLeft, ShieldCheck, Activity } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/patrocinadores")({ component: AdminSponsors });

type Sponsor = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
  category: string | null;
  tier: SponsorTier;
  monthly_price: number;
  contact_email: string | null;
  contact_phone: string | null;
  sort_order: number;
  is_active: boolean;
  is_featured: boolean;
  clicks_count: number;
  impressions_count: number;
  created_at: string;
};

type LogRow = {
  id: string;
  action: string;
  entity: string;
  description: string | null;
  created_at: string;
};

const emptyForm = {
  id: "",
  name: "",
  slug: "",
  logo_url: "",
  website_url: "",
  description: "",
  category: "",
  tier: "bronze" as SponsorTier,
  monthly_price: 0,
  contact_email: "",
  contact_phone: "",
  sort_order: 0,
  is_active: true,
  is_featured: false,
};

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function AdminSponsors() {
  const nav = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [sponsors, setSponsors] = React.useState<Sponsor[]>([]);
  const [logs, setLogs] = React.useState<LogRow[]>([]);
  const [form, setForm] = React.useState(emptyForm);
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!loading && (!user || !isAdmin)) nav({ to: "/" });
  }, [user, isAdmin, loading, nav]);

  const load = React.useCallback(async () => {
    const [{ data: s, error: e1 }, { data: l, error: e2 }] = await Promise.all([
      supabase.from("sponsors").select("*").order("sort_order", { ascending: true }),
      supabase.from("admin_logs").select("id,action,entity,description,created_at").eq("entity", "sponsor").order("created_at", { ascending: false }).limit(20),
    ]);
    if (e1) console.error("[admin/sponsors] load", e1);
    if (e2) console.error("[admin/logs] load", e2);
    setSponsors((s ?? []) as Sponsor[]);
    setLogs((l ?? []) as LogRow[]);
  }, []);

  React.useEffect(() => { if (isAdmin) void load(); }, [isAdmin, load]);

  if (loading || !user || !isAdmin) return null;

  const writeLog = async (action: string, description: string, entity_id?: string, payload?: any) => {
    const { error } = await supabase.from("admin_logs").insert({
      action, entity: "sponsor", entity_id: entity_id ?? null,
      description, payload: payload ?? {}, actor_id: user.id,
    });
    if (error) console.error("[admin_logs] insert", error);
  };

  const openNew = () => { setForm(emptyForm); setOpen(true); };
  const openEdit = (s: Sponsor) => {
    setForm({
      id: s.id, name: s.name, slug: s.slug, logo_url: s.logo_url ?? "", website_url: s.website_url ?? "",
      description: s.description ?? "", category: s.category ?? "", tier: s.tier,
      monthly_price: Number(s.monthly_price), contact_email: s.contact_email ?? "", contact_phone: s.contact_phone ?? "",
      sort_order: s.sort_order, is_active: s.is_active, is_featured: s.is_featured,
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.name.trim()) { toast.error("Nome obrigatório"); return; }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      slug: (form.slug || slugify(form.name)).trim(),
      logo_url: form.logo_url || null,
      website_url: form.website_url || null,
      description: form.description || null,
      category: form.category || null,
      tier: form.tier,
      monthly_price: Number(form.monthly_price) || 0,
      contact_email: form.contact_email || null,
      contact_phone: form.contact_phone || null,
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active,
      is_featured: form.is_featured,
    };

    if (form.id) {
      const { error } = await supabase.from("sponsors").update(payload).eq("id", form.id);
      if (error) { console.error(error); toast.error("Erro ao salvar"); setSaving(false); return; }
      await writeLog("update", `Atualizou patrocinador "${payload.name}"`, form.id, payload);
      toast.success("Patrocinador atualizado");
    } else {
      const { data, error } = await supabase.from("sponsors").insert(payload).select("id").single();
      if (error) { console.error(error); toast.error("Erro ao criar"); setSaving(false); return; }
      await writeLog("create", `Criou patrocinador "${payload.name}"`, data?.id, payload);
      toast.success("Patrocinador criado");
    }
    setOpen(false); setSaving(false); await load();
  };

  const toggleActive = async (s: Sponsor) => {
    const { error } = await supabase.from("sponsors").update({ is_active: !s.is_active }).eq("id", s.id);
    if (error) { toast.error("Erro ao alterar"); return; }
    await writeLog(s.is_active ? "deactivate" : "activate", `${s.is_active ? "Desativou" : "Ativou"} "${s.name}"`, s.id);
    await load();
  };

  const remove = async (s: Sponsor) => {
    if (!confirm(`Remover patrocinador "${s.name}"?`)) return;
    const { error } = await supabase.from("sponsors").delete().eq("id", s.id);
    if (error) { toast.error("Erro ao remover"); return; }
    await writeLog("delete", `Removeu patrocinador "${s.name}"`, s.id);
    toast.success("Removido");
    await load();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <Button asChild variant="ghost" size="sm" className="mb-4"><Link to="/admin"><ArrowLeft className="h-4 w-4 mr-1" /> Voltar</Link></Button>

        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="h-4 w-4 text-[var(--gold)]" />
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Admin · Patrocinadores</span>
            </div>
            <h1 className="font-display font-black text-3xl">Gestão de patrocinadores</h1>
            <p className="text-sm text-muted-foreground mt-1">{sponsors.length} patrocinador(es) cadastrados.</p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Novo patrocinador</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{form.id ? "Editar" : "Novo"} patrocinador</DialogTitle>
              </DialogHeader>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label>Nome *</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: form.id ? form.slug : slugify(e.target.value) })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Slug</Label>
                  <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Categoria</Label>
                  <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Financeira, Seguros..." />
                </div>
                <div className="space-y-1.5">
                  <Label>Nível</Label>
                  <Select value={form.tier} onValueChange={(v) => setForm({ ...form, tier: v as SponsorTier })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TIER_ORDER.map((t) => <SelectItem key={t} value={t}>{TIER_META[t].label} — R$ {TIER_META[t].basePrice.toLocaleString("pt-BR")}/mês</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Mensalidade (R$)</Label>
                  <Input type="number" value={form.monthly_price} onChange={(e) => setForm({ ...form, monthly_price: Number(e.target.value) })} />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label>URL do logo</Label>
                  <Input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} placeholder="https://..." />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label>Site</Label>
                  <Input value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} placeholder="https://..." />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label>Descrição</Label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
                </div>
                <div className="space-y-1.5">
                  <Label>E-mail contato</Label>
                  <Input type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Telefone</Label>
                  <Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Ordem</Label>
                  <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
                </div>
                <div className="flex flex-col gap-3 justify-center">
                  <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} /><Label>Ativo</Label></div>
                  <div className="flex items-center gap-2"><Switch checked={form.is_featured} onCheckedChange={(v) => setForm({ ...form, is_featured: v })} /><Label>Destaque</Label></div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button onClick={save} disabled={saving}>{saving ? "Salvando..." : "Salvar"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* TABELA */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30">
                <tr className="text-left">
                  <th className="px-4 py-3">Patrocinador</th>
                  <th className="px-4 py-3">Nível</th>
                  <th className="px-4 py-3">Mensal</th>
                  <th className="px-4 py-3">Cliques</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {sponsors.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">Nenhum patrocinador cadastrado.</td></tr>
                )}
                {sponsors.map((s) => (
                  <tr key={s.id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {s.logo_url && <img src={s.logo_url} alt="" className="h-10 w-10 rounded-lg object-cover bg-muted" />}
                        <div>
                          <div className="font-medium">{s.name} {s.is_featured && <Badge className="ml-1 bg-[var(--gold)]/20 text-[var(--gold)] border-0 text-[10px]">Destaque</Badge>}</div>
                          <div className="text-xs text-muted-foreground">{s.category || "—"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge variant="outline">{TIER_META[s.tier].label}</Badge></td>
                    <td className="px-4 py-3">R$ {Number(s.monthly_price).toLocaleString("pt-BR")}</td>
                    <td className="px-4 py-3">{s.clicks_count}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(s)} className={`text-xs px-2 py-1 rounded-full ${s.is_active ? "bg-emerald-500/15 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                        {s.is_active ? "Ativo" : "Inativo"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        {s.website_url && <a href={s.website_url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-accent rounded"><ExternalLink className="h-4 w-4" /></a>}
                        <button onClick={() => openEdit(s)} className="p-2 hover:bg-accent rounded"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => remove(s)} className="p-2 hover:bg-destructive/10 text-destructive rounded"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* LOGS */}
        <div className="flex items-center gap-2 mt-10 mb-3">
          <Activity className="h-4 w-4 text-[var(--gold)]" />
          <h2 className="font-display font-bold text-xl">Histórico de ações</h2>
        </div>
        <Card className="p-4">
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Nenhum registro ainda.</p>
          ) : (
            <ul className="divide-y">
              {logs.map((l) => (
                <li key={l.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm">{l.description}</div>
                    <div className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString("pt-BR")}</div>
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase">{l.action}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  );
}
