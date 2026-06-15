import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { TIER_META, TIER_ORDER, BILLING_CYCLES, priceFor, formatBRL, type SponsorTier, type BillingCycleId } from "@/lib/sponsor-utils";
import { ExternalLink, Sparkles, Trophy, Crown, Star, Award, Medal, Mail, TrendingUp, Eye, MousePointerClick, ShieldCheck, Check, Zap, Gift } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/patrocinadores")({
  component: PatrocinadoresPage,
  head: () => ({
    meta: [
      { title: "Patrocinadores · Portal da Serra" },
      { name: "description", content: "Empresas parceiras que apoiam o maior marketplace automotivo da serra gaúcha. Conheça as marcas e seja um patrocinador." },
      { property: "og:title", content: "Patrocinadores · Portal da Serra" },
      { property: "og:description", content: "Conheça as marcas parceiras e os planos de patrocínio do Portal da Serra." },
    ],
  }),
});

type Sponsor = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
  category: string | null;
  tier: SponsorTier;
  is_featured: boolean;
};

const TIER_ICON: Record<SponsorTier, React.ElementType> = {
  diamante: Crown,
  platina: Trophy,
  ouro: Star,
  prata: Award,
  bronze: Medal,
};

function PatrocinadoresPage() {
  const [sponsors, setSponsors] = React.useState<Sponsor[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [cycle, setCycle] = React.useState<BillingCycleId>("semestral");

  React.useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("sponsors")
        .select("id,name,slug,logo_url,website_url,description,category,tier,is_featured")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) console.error("[patrocinadores] load error:", error);
      setSponsors((data ?? []) as Sponsor[]);
      setLoading(false);
    })();
  }, []);

  const grouped = React.useMemo(() => {
    const map = new Map<SponsorTier, Sponsor[]>();
    TIER_ORDER.forEach((t) => map.set(t, []));
    sponsors.forEach((s) => map.get(s.tier)?.push(s));
    return map;
  }, [sponsors]);

  const trackClick = (sponsor: Sponsor) => {
    console.log("[patrocinadores] click", sponsor.slug);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[oklch(0.10_0.02_260)] text-white">
      <div className="dark contents"><Header /></div>

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-white/5">
          <div className="absolute inset-0">
            <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[var(--gold)]/10 blur-[120px]" />
            <div className="absolute top-1/4 -right-32 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />
          </div>
          <div className="container mx-auto px-4 relative pt-28 pb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--gold)] mb-6">
              <Sparkles className="h-3 w-3" /> Marcas parceiras
            </div>
            <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-tight max-w-4xl">
              Quem caminha junto com o{" "}
              <span className="bg-gradient-to-r from-[oklch(0.92_0.13_85)] to-[var(--gold)] bg-clip-text text-transparent">Portal da Serra</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mt-4">
              Empresas e marcas que apoiam o marketplace automotivo da serra gaúcha e ganham visibilidade qualificada com nossa audiência.
            </p>
            <div className="flex gap-3 mt-8">
              <Button asChild className="bg-[var(--gold)] text-black hover:bg-[var(--gold)]/90"><a href="#planos">Quero patrocinar</a></Button>
              <Button asChild variant="outline" className="border-white/15 text-white hover:bg-white/5"><Link to="/planos">Sou garagista</Link></Button>
            </div>
          </div>
        </section>

        {/* DIAMANTE / PLATINA destaque */}
        <section className="container mx-auto px-4 py-16">
          {loading ? (
            <div className="text-center text-white/50 py-20">Carregando patrocinadores…</div>
          ) : (
            TIER_ORDER.map((tier) => {
              const list = grouped.get(tier) ?? [];
              if (!list.length) return null;
              const Icon = TIER_ICON[tier];
              const meta = TIER_META[tier];
              return (
                <div key={tier} className="mb-14">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${meta.color} grid place-items-center text-black shadow-lg`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-2xl">Patrocínio {meta.label}</h2>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/40">{list.length} parceiro{list.length > 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <div className={`grid gap-4 ${tier === "diamante" || tier === "platina" ? "md:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}`}>
                    {list.map((s) => (
                      <Card key={s.id} className="bg-white/5 border-white/10 p-6 hover:bg-white/[0.07] transition group">
                        <div className="flex items-start gap-4">
                          {s.logo_url && (
                            <img src={s.logo_url} alt={s.name} className="h-16 w-16 rounded-xl object-cover bg-white/10 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-display font-bold text-lg text-white truncate">{s.name}</h3>
                              {s.is_featured && <Badge className="bg-[var(--gold)]/20 text-[var(--gold)] border-0 text-[10px]">Destaque</Badge>}
                            </div>
                            {s.category && <div className="text-xs text-white/40 uppercase tracking-wider mt-0.5">{s.category}</div>}
                            {s.description && <p className="text-sm text-white/60 mt-2 line-clamp-2">{s.description}</p>}
                            {s.website_url && (
                              <a
                                href={s.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackClick(s)}
                                className="inline-flex items-center gap-1 text-xs text-[var(--gold)] mt-3 hover:underline"
                              >
                                Visitar site <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </section>

        {/* PLANOS DE PATROCÍNIO */}
        <section id="planos" className="border-t border-white/5 bg-black/30">
          <div className="container mx-auto px-4 py-20">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                <TrendingUp className="h-3 w-3" /> Para sua marca
              </div>
              <h2 className="font-display font-extrabold text-3xl md:text-5xl">Seja um patrocinador</h2>
              <p className="text-white/60 mt-4">Quanto maior o compromisso, maior o desconto e os benefícios. Escolha o ciclo ideal.</p>
            </div>

            {/* Seletor de ciclo */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex flex-wrap justify-center gap-1 p-1.5 rounded-full bg-white/5 border border-white/10">
                {BILLING_CYCLES.map((c) => {
                  const active = c.id === cycle;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setCycle(c.id)}
                      className={`relative px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition ${active ? "bg-[var(--gold)] text-black shadow-lg" : "text-white/70 hover:text-white hover:bg-white/5"}`}
                    >
                      {c.label}
                      {c.badge && !active && (
                        <span className="ml-2 text-[9px] uppercase tracking-wider text-[var(--gold)]">{c.badge.split("·").pop()?.trim()}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bônus do ciclo selecionado */}
            {(() => {
              const c = BILLING_CYCLES.find((x) => x.id === cycle)!;
              return (
                <div className="max-w-3xl mx-auto mb-10">
                  <Card className="bg-gradient-to-br from-[var(--gold)]/10 to-white/5 border-[var(--gold)]/30 p-5">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[var(--gold)]/20 grid place-items-center text-[var(--gold)] flex-shrink-0">
                        <Gift className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="font-display font-bold text-white">Bônus do plano {c.label.toLowerCase()}</div>
                          {c.badge && <Badge className="bg-[var(--gold)] text-black border-0 text-[10px]">{c.badge}</Badge>}
                        </div>
                        <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5 mt-3 text-sm text-white/75">
                          {c.bonuses.map((b) => (
                            <li key={b} className="flex gap-2"><Check className="h-4 w-4 text-[var(--gold)] mt-0.5 flex-shrink-0" />{b}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })()}

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {TIER_ORDER.map((tier) => {
                const meta = TIER_META[tier];
                const Icon = TIER_ICON[tier];
                const top = tier === "diamante";
                const { monthly, total, savings, cycle: cy } = priceFor(tier, cycle);
                return (
                  <Card key={tier} className={`p-6 flex flex-col relative ${top ? "bg-gradient-to-b from-[var(--gold)]/20 to-white/5 border-[var(--gold)]/40 lg:scale-105" : "bg-white/5 border-white/10"}`}>
                    {cy.discount > 0 && (
                      <div className="absolute -top-2 right-4 bg-[var(--gold)] text-black text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1">
                        <Zap className="h-3 w-3" />-{Math.round(cy.discount * 100)}%
                      </div>
                    )}
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${meta.color} grid place-items-center text-black mb-4 shadow-lg`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="text-xs uppercase tracking-[0.2em] text-white/40">{meta.label}</div>

                    <div className="mt-2">
                      {cy.discount > 0 && (
                        <div className="text-xs text-white/40 line-through">{formatBRL(meta.basePrice)}/mês</div>
                      )}
                      <div className="font-display font-black text-2xl text-white leading-tight">
                        {formatBRL(monthly)}<span className="text-sm font-normal text-white/50">/mês</span>
                      </div>
                      <div className="text-[11px] text-white/50 mt-1">
                        {cy.months > 1 ? <>Total {cy.short}: <span className="text-white/80">{formatBRL(total)}</span></> : "Sem fidelidade"}
                      </div>
                      {savings > 0 && (
                        <div className="text-[11px] text-[var(--gold)] font-semibold mt-0.5">Economia de {formatBRL(savings)}</div>
                      )}
                    </div>

                    <ul className="space-y-2 mt-5 text-sm text-white/70 flex-1">
                      {meta.perks.map((p) => (
                        <li key={p} className="flex gap-2"><span className="text-[var(--gold)] mt-0.5">•</span>{p}</li>
                      ))}
                    </ul>
                    <Button asChild className={`mt-6 w-full ${top ? "bg-[var(--gold)] text-black hover:bg-[var(--gold)]/90" : "bg-white/10 hover:bg-white/15"}`}>
                      <a href={`mailto:patrocinio@portaldaserra.com.br?subject=Patrocínio ${meta.label} - ${cy.label}`}><Mail className="h-4 w-4 mr-2" />Quero esse plano</a>
                    </Button>
                  </Card>
                );
              })}
            </div>

            {/* Comparativo de ciclos */}
            <div className="mt-14 max-w-4xl mx-auto">
              <h3 className="font-display font-bold text-xl text-center mb-6">Comparativo de fidelidade</h3>
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
                <table className="w-full text-sm">
                  <thead className="bg-white/5">
                    <tr className="text-left text-white/60 text-xs uppercase tracking-wider">
                      <th className="p-4">Ciclo</th>
                      <th className="p-4">Desconto</th>
                      <th className="p-4">Ex.: Ouro / mês</th>
                      <th className="p-4">Bônus inclusos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BILLING_CYCLES.map((c) => {
                      const { monthly } = priceFor("ouro", c.id);
                      return (
                        <tr key={c.id} className="border-t border-white/10 hover:bg-white/[0.03]">
                          <td className="p-4 font-semibold text-white">{c.label}<div className="text-xs text-white/40">{c.short}</div></td>
                          <td className="p-4">{c.discount > 0 ? <span className="text-[var(--gold)] font-bold">-{Math.round(c.discount * 100)}%</span> : <span className="text-white/40">—</span>}</td>
                          <td className="p-4 text-white">{formatBRL(monthly)}</td>
                          <td className="p-4 text-white/70">{c.bonuses.length} benefício{c.bonuses.length > 1 ? "s" : ""} extra{c.bonuses.length > 1 ? "s" : ""}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Benefícios extras */}
            <div className="grid md:grid-cols-3 gap-4 mt-12">
              {[
                { icon: Eye, title: "+120k impressões/mês", desc: "Audiência segmentada de compradores e garagistas reais." },
                { icon: MousePointerClick, title: "Cliques rastreados", desc: "UTM automático e relatório de performance no painel." },
                { icon: ShieldCheck, title: "Marca selada", desc: "Selo de patrocinador oficial validado pelo Portal." },
              ].map((b) => (
                <Card key={b.title} className="bg-white/5 border-white/10 p-6">
                  <b.icon className="h-6 w-6 text-[var(--gold)] mb-3" />
                  <div className="font-display font-bold text-white">{b.title}</div>
                  <div className="text-sm text-white/60 mt-1">{b.desc}</div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
