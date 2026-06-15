import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ArrowRight, ArrowUpRight, ShieldCheck, Sparkles, Gauge, Fuel, Calendar, MapPin, Star, Plus, ChevronRight, Zap, BadgeCheck, TrendingUp, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MOCK_VEHICLES, MOCK_GARAGES } from "@/lib/mock";
import { SponsorBar } from "@/components/site/SponsorStrip";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({ component: Home });

const brl = (n: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(n);

function Home() {
  const featured = MOCK_VEHICLES.filter(v => v.is_featured);
  const hero = featured[0];
  const side = featured.slice(1, 3);
  const recent = MOCK_VEHICLES.slice(0, 4);

  // Stats reais — sem inflar números
  const { data: stats } = useQuery({
    queryKey: ["home-stats"],
    queryFn: async () => {
      const [v, g] = await Promise.all([
        supabase.from("vehicles").select("*", { count: "exact", head: true }).eq("status", "ativo"),
        supabase.from("garages").select("*", { count: "exact", head: true }),
      ]);
      return { vehicles: v.count ?? 0, garages: g.count ?? 0 };
    },
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="min-h-screen flex flex-col bg-[oklch(0.10_0.02_260)] text-white">
      <div className="dark contents">
        <Header />
      </div>

      <main className="flex-1">
        {/* ============ HERO ============ */}
        <section className="relative overflow-hidden">
          {/* layered backdrop */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=2400&q=80"
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.10_0.02_260)]/40 via-[oklch(0.10_0.02_260)]/85 to-[oklch(0.10_0.02_260)]" />
            <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-[oklch(0.55_0.11_245)]/20 blur-[120px]" />
            <div className="absolute top-1/3 -right-32 h-[500px] w-[500px] rounded-full bg-[var(--gold)]/15 blur-[120px]" />
          </div>

          <div className="container mx-auto px-4 relative pt-28 md:pt-36 pb-24">
            <div className="max-w-5xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--gold)] mb-10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--gold)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--gold)]" />
                </span>
                Marketplace Premium · Serra Catarinense
              </div>

              <h1 className="font-display font-extrabold text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tight">
                Encontre o{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-[oklch(0.92_0.13_85)] via-[var(--gold)] to-[oklch(0.65_0.15_60)] bg-clip-text text-transparent">
                    veículo ideal
                  </span>
                </span>
                <br />em garagens exclusivas.
              </h1>

              <p className="mt-7 text-lg md:text-xl text-white/55 leading-relaxed max-w-2xl">
                Curadoria premium de veículos verificados. Compare especificações, veja fotos em alta qualidade e fale direto com a garagem.
              </p>

              {/* premium search */}
              <div className="relative mt-12 max-w-3xl">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[oklch(0.55_0.11_245)]/40 via-[var(--gold)]/30 to-[oklch(0.55_0.11_245)]/40 rounded-[2rem] blur-xl opacity-40" />
                <div className="relative flex items-center bg-white/[0.04] backdrop-blur-2xl border border-white/10 p-2.5 rounded-[1.8rem] shadow-2xl">
                  <div className="flex-1 flex items-center px-5 gap-4">
                    <Search className="h-5 w-5 text-white/40" />
                    <Input
                      placeholder="Qual máquina você procura hoje?"
                      className="bg-transparent border-0 text-white placeholder:text-white/30 focus-visible:ring-0 h-14 text-base md:text-lg font-medium px-0"
                    />
                  </div>
                  <Button asChild size="lg" className="h-14 px-7 md:px-10 rounded-[1.4rem] bg-white text-[oklch(0.14_0.025_260)] hover:bg-[var(--gold)] hover:text-[oklch(0.14_0.025_260)] font-bold transition-all">
                    <Link to="/carros">
                      Buscar <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* trust strip */}
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-white/40 font-medium">
                <span className="inline-flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-[var(--gold)]" /> Procedência verificada</span>
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[var(--gold)]" /> Garagens auditadas</span>
                <span className="inline-flex items-center gap-2"><Zap className="h-4 w-4 text-[var(--gold)]" /> Contato direto via WhatsApp</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============ PATROCINADORES — faixa de visibilidade ============ */}
        <section className="container mx-auto px-4 pt-6">
          <SponsorBar variant="dark" />
        </section>

        {/* ============ BENTO — Curadoria ============ */}
        <section className="container mx-auto px-4 py-20 md:py-28">
          <div className="flex items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--gold)] mb-3">Curadoria</div>
              <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight">Destaques da temporada</h2>
            </div>
            <Button asChild variant="ghost" className="hidden md:inline-flex text-white/60 hover:text-white hover:bg-white/5">
              <Link to="/carros">Ver todo inventário <ArrowUpRight className="h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-12 gap-5 lg:h-[720px]">
            {/* Main featured */}
            <Link
              to="/carros/$id"
              params={{ id: hero.id }}
              className="col-span-12 lg:col-span-8 lg:row-span-2 group relative rounded-[2.5rem] overflow-hidden border border-white/5 bg-[oklch(0.16_0.03_260)] min-h-[420px]"
            >
              <img src={hero.image} alt={hero.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.10_0.02_260)] via-[oklch(0.10_0.02_260)]/30 to-transparent" />

              <div className="absolute top-6 left-6 right-6 flex items-start justify-between">
                <Badge className="bg-white/10 backdrop-blur-md border border-white/15 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5">
                  <Sparkles className="h-3 w-3 mr-1 text-[var(--gold)]" /> Destaque Premium
                </Badge>
                <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/15 grid place-items-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
              </div>

              <div className="absolute bottom-8 left-8 right-8">
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--gold)] mb-2">{hero.brand}</div>
                <h3 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight">
                  {hero.title}
                </h3>
                <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">A partir de</div>
                    <div className="font-display font-extrabold text-2xl md:text-3xl">{brl(hero.price)}</div>
                  </div>
                  <div className="flex gap-5 text-xs text-white/60 border-l border-white/15 pl-5">
                    <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{hero.year_model}</span>
                    <span className="inline-flex items-center gap-1.5"><Gauge className="h-3.5 w-3.5" />{(hero.mileage / 1000).toFixed(0)}k km</span>
                    <span className="inline-flex items-center gap-1.5"><Fuel className="h-3.5 w-3.5" />{hero.fuel}</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Side featured 1 */}
            {side[0] && (
              <Link
                to="/carros/$id"
                params={{ id: side[0].id }}
                className="col-span-12 sm:col-span-6 lg:col-span-4 lg:row-span-1 group relative rounded-[2.5rem] overflow-hidden border border-white/5 bg-[oklch(0.16_0.03_260)] min-h-[260px]"
              >
                <img src={side[0].image} alt={side[0].title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.10_0.02_260)] via-[oklch(0.10_0.02_260)]/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--gold)] mb-1">{side[0].brand}</div>
                  <h4 className="font-display font-bold text-xl leading-tight">{side[0].title}</h4>
                  <div className="mt-2 font-display font-extrabold text-lg">{brl(side[0].price)}</div>
                </div>
              </Link>
            )}

            {/* Side featured 2 / CTA */}
            <Link
              to="/carros"
              className="col-span-12 sm:col-span-6 lg:col-span-4 lg:row-span-1 group relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-gradient-to-br from-[oklch(0.22_0.06_260)] to-[oklch(0.16_0.03_260)] min-h-[260px] flex flex-col items-center justify-center text-center p-8"
            >
              <div className="absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-[var(--gold)]/10 blur-3xl group-hover:bg-[var(--gold)]/25 transition-colors" />
              <div className="relative">
                <div className="h-14 w-14 rounded-full border border-white/15 grid place-items-center mb-5 mx-auto group-hover:border-[var(--gold)] group-hover:bg-[var(--gold)]/10 transition-all">
                  <Plus className="h-6 w-6 text-[var(--gold)]" />
                </div>
                <div className="font-display font-bold text-xl">Ver inventário completo</div>
                <div className="text-sm text-white/40 mt-1">+1.200 veículos selecionados</div>
              </div>
            </Link>
          </div>

          {/* ============ STATS STRIP — números honestos ============ */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-14">
            {[
              { n: stats ? String(stats.vehicles) : "—", l: "Anúncios ativos" },
              { n: stats ? String(stats.garages) : "—", l: "Garagens cadastradas" },
              { n: "Seg–Sex", l: "Atendimento 8h às 23h", accent: true },
              { n: "100%", l: "Procedência verificada" },
            ].map((s) => (
              <div key={s.l}>
                <div className={`font-display font-extrabold text-4xl md:text-5xl tracking-tighter mb-2 ${s.accent ? "text-[var(--gold)]" : "text-white"}`}>{s.n}</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">{s.l}</div>
              </div>
            ))}
          </div>
        </section>


        {/* ============ INTELLIGENT SEARCH — categorias ============ */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-12 gap-5">
            <div className="lg:col-span-4 rounded-[2.5rem] border border-white/5 bg-[oklch(0.16_0.03_260)] p-10 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--gold)] mb-3">Busca Inteligente</div>
                <h3 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight leading-[1.05]">
                  Filtros avançados para encontrar exatamente o que você quer.
                </h3>
                <p className="mt-4 text-white/50 text-sm leading-relaxed">
                  Marca, modelo, ano, faixa de preço, quilometragem, combustível, câmbio, cor e cidade. Tudo em um só lugar.
                </p>
              </div>
              <Button asChild className="mt-8 bg-[var(--gold)] text-[oklch(0.14_0.025_260)] hover:bg-[var(--gold)]/90 font-bold rounded-full h-12 w-fit px-6">
                <Link to="/carros">Explorar agora <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>

            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { l: "SUVs", n: "320+", img: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&q=80" },
                { l: "Esportivos", n: "84", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80" },
                { l: "Sedans", n: "212", img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80" },
                { l: "Pickups", n: "156", img: "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=600&q=80" },
              ].map((c) => (
                <Link key={c.l} to="/carros" className="group relative rounded-3xl overflow-hidden border border-white/5 aspect-[3/4] bg-[oklch(0.16_0.03_260)]">
                  <img src={c.img} alt={c.l} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-110 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.10_0.02_260)] via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="font-display font-bold text-lg">{c.l}</div>
                    <div className="text-xs text-white/50">{c.n} disponíveis</div>
                  </div>
                  <div className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/10 backdrop-blur-md border border-white/15 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ============ RECENT ============ */}
        <section className="container mx-auto px-4 py-20">
          <div className="flex items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--gold)] mb-3">Recém-publicados</div>
              <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight">Últimos anúncios</h2>
            </div>
            <Button asChild variant="ghost" className="text-white/60 hover:text-white hover:bg-white/5">
              <Link to="/carros">Ver todos <ArrowUpRight className="h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recent.map((v) => (
              <Link key={v.id} to="/carros/$id" params={{ id: v.id }} className="group rounded-3xl overflow-hidden border border-white/5 bg-[oklch(0.16_0.03_260)] hover:border-white/15 transition-colors">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={v.image} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  {v.is_featured && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[var(--gold)] text-[oklch(0.14_0.025_260)] text-[9px] font-bold uppercase tracking-wider">Premium</div>
                  )}
                </div>
                <div className="p-5">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">{v.brand}</div>
                  <div className="font-display font-bold text-base mt-1 leading-tight truncate">{v.title}</div>
                  <div className="flex items-center gap-3 mt-3 text-[11px] text-white/40">
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{v.year_model}</span>
                    <span className="inline-flex items-center gap-1"><Gauge className="h-3 w-3" />{(v.mileage/1000).toFixed(0)}k</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{v.city}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="font-display font-extrabold text-lg">{brl(v.price)}</div>
                    <ArrowUpRight className="h-4 w-4 text-white/30 group-hover:text-[var(--gold)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ============ PARTNERS ============ */}
        <section className="container mx-auto px-4 py-20">
          <div className="flex items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--gold)] mb-3">Garagens Elite</div>
              <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight">Parceiros verificados</h2>
            </div>
            <Button asChild variant="ghost" className="text-white/60 hover:text-white hover:bg-white/5">
              <Link to="/garagens">Ver todas <ArrowUpRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MOCK_GARAGES.map((g) => (
              <Link key={g.id} to="/garagens" className="group rounded-3xl border border-white/5 bg-[oklch(0.16_0.03_260)] overflow-hidden hover:border-white/15 transition-colors">
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img src={g.cover} alt={g.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.16_0.03_260)] to-transparent" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold">{g.name}</h3>
                    {g.verified && <BadgeCheck className="h-4 w-4 text-[var(--gold)]" />}
                  </div>
                  <div className="text-xs text-white/40 mt-0.5">{g.city}/{g.state}</div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-white/60">{g.count} veículos</span>
                    <span className="inline-flex items-center gap-1 text-[var(--gold)]"><Star className="h-3 w-3 fill-current" />4.9</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ============ FOR GARAGISTAS ============ */}
        <section className="container mx-auto px-4 py-20">
          <div className="relative rounded-[2.5rem] overflow-hidden border border-white/5 bg-gradient-to-br from-[oklch(0.22_0.07_260)] via-[oklch(0.18_0.05_260)] to-[oklch(0.14_0.03_260)] p-10 md:p-16">
            <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-[var(--gold)]/15 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-[oklch(0.55_0.11_245)]/20 blur-3xl" />

            <div className="relative grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--gold)] mb-6">
                  <TrendingUp className="h-3 w-3" /> Para garagistas
                </div>
                <h2 className="font-display font-extrabold text-4xl md:text-6xl tracking-tight leading-[0.95]">
                  Sua vitrine digital,{" "}
                  <span className="bg-gradient-to-r from-[oklch(0.92_0.13_85)] to-[var(--gold)] bg-clip-text text-transparent">premium</span> e pronta para vender.
                </h2>
                <p className="mt-5 text-white/55 text-lg max-w-xl">
                  Publique seu estoque, receba contatos qualificados via WhatsApp e acompanhe métricas em tempo real. A partir de R$ 89/mês.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild size="lg" className="bg-[var(--gold)] text-[oklch(0.14_0.025_260)] hover:bg-[var(--gold)]/90 font-bold rounded-full h-12 px-7">
                    <Link to="/planos">Ver planos <ArrowRight className="h-4 w-4" /></Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white/15 text-white hover:bg-white/5 hover:text-white rounded-full h-12 px-7 bg-transparent">
                    <Link to="/auth">Criar conta</Link>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: ShieldCheck, t: "Selo verificado", d: "Confiança e autoridade" },
                  { icon: Phone, t: "Leads diretos", d: "WhatsApp em 1 clique" },
                  { icon: TrendingUp, t: "Mais visualizações", d: "SEO otimizado" },
                  { icon: Sparkles, t: "Destaque premium", d: "Anúncios em destaque" },
                ].map((f) => (
                  <div key={f.t} className="rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-5">
                    <div className="h-10 w-10 rounded-xl bg-[var(--gold)]/15 grid place-items-center mb-3">
                      <f.icon className="h-5 w-5 text-[var(--gold)]" />
                    </div>
                    <div className="font-display font-bold text-sm">{f.t}</div>
                    <div className="text-xs text-white/50 mt-1">{f.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="dark contents">
        <Footer />
      </div>
    </div>
  );
}
