import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Check, Sparkles, Bot, Crown, Zap, Rocket, Gem, ShieldCheck,
  Video, Camera, BadgeCheck, TrendingUp, Bell, Lock, Star, ChevronDown,
  Megaphone, Share2, Globe2,
} from "lucide-react";

export const Route = createFileRoute("/planos")({ component: Plans });

type Plan = {
  name: string;
  price: number;
  icon: any;
  tagline: string;
  desc: string;
  badge?: string;
  badgeTone?: "gold" | "primary" | "black";
  features: string[];
  highlight?: boolean;
  ai?: boolean;
  elite?: boolean;
};

const GARAGE_PLANS: Plan[] = [
  {
    name: "Start", price: 149, icon: Rocket,
    tagline: "Comece a vender",
    desc: "Para garagens entrando no digital, já com a Camila atendendo.",
    ai: true,
    features: [
      "Até 10 veículos ativos",
      "Camila — atendente virtual humana inclusa",
      "Página da garagem básica",
      "Contato direto via WhatsApp",
      "Fotos em carrossel (até 8)",
      "Indexação no Google",
      "Suporte por e-mail",
    ],
  },
  {
    name: "Pro", price: 349, icon: Zap,
    tagline: "Cresça com método",
    desc: "Para garagens em expansão, com IA e métricas profissionais.",
    badge: "MAIS POPULAR", badgeTone: "gold",
    highlight: true, ai: true,
    features: [
      "Até 50 veículos ativos",
      "Camila treinada com sua base de conhecimento",
      "3 anúncios em destaque rotativo",
      "Métricas de visualização e leads",
      "Página personalizada com tema",
      "Prioridade na listagem",
      "Suporte prioritário (chat)",
    ],
  },
  {
    name: "Premium", price: 799, icon: Megaphone,
    tagline: "Bot de Anúncios Multicanal",
    desc: "Tudo do Pro + nosso bot publica seus carros automaticamente em outras plataformas.",
    badge: "ANÚNCIOS NO PILOTO AUTOMÁTICO", badgeTone: "primary",
    ai: true,
    features: [
      "Veículos ilimitados",
      "Camila Premium — respostas instantâneas 24/7",
      "Bot Multicanal: Instagram, Facebook & Marketplace",
      "Bot Multicanal: OLX e Mercado Livre",
      "Republicação automática semanal (anti-queda de ranking)",
      "Geração automática de copy + hashtags por veículo",
      "Destaques fixos na home",
      "Relatórios avançados de funil e origem de leads",
      "Selo Premium verificado",
      "Suporte VIP (WhatsApp dedicado)",
    ],
  },
  {
    name: "Elite Black", price: 1890, icon: Crown,
    tagline: "Concierge total + Bot Pro",
    desc: "Operação white-glove para garagens de alto padrão e premium imports.",
    badge: "INDICAÇÃO LIMITADA", badgeTone: "black",
    elite: true, ai: true,
    features: [
      "Tudo do Premium incluso",
      "Bot Multicanal Pro: TikTok, YouTube Shorts & Google Ads",
      "Disparo automático em grupos VIP de WhatsApp e Telegram",
      "Camila Concierge multilíngue (PT/EN/ES)",
      "Match inteligente comprador × estoque",
      "Produção de vídeo + tour 360° por veículo",
      "Inspeção certificada Portal (selo Black)",
      "Gestor de conta dedicado",
      "Acesso ao Clube de compradores VIP",
      "API + integração DMS",
    ],
  },
];

const ADD_ONS = [
  { name: "Boost Turbo 24h", price: 49, icon: TrendingUp, desc: "Topo da listagem por 24h, em qualquer plano." },
  { name: "Vídeo Profissional", price: 290, icon: Video, desc: "Equipe vai à garagem gravar e editar o veículo." },
  { name: "Sessão de Fotos", price: 180, icon: Camera, desc: "Pacote com 25 fotos profissionais por veículo." },
  { name: "Selo Inspeção+", price: 120, icon: BadgeCheck, desc: "Laudo cautelar e selo de inspeção verificada." },
  { name: "Tour Virtual 360°", price: 220, icon: Sparkles, desc: "Experiência imersiva do interior do carro." },
  { name: "Garantia Estendida", price: 350, icon: ShieldCheck, desc: "Cobertura extra de 6 meses pós-venda." },
];

const BUYER_PLAN = {
  name: "Clube Portal+",
  price: 19,
  desc: "Para compradores exigentes: veja oportunidades antes de todo mundo.",
  features: [
    "Alertas inteligentes com IA do carro dos sonhos",
    "Acesso 48h antecipado a novos veículos",
    "Histórico veicular premium incluso (3/mês)",
    "Negociação assistida por especialista",
    "Convites para test drives exclusivos",
  ],
};

function Plans() {
  const [annual, setAnnual] = useState(false);
  const [vehiclesSold, setVehiclesSold] = useState(8);
  const [avgTicket, setAvgTicket] = useState(45000);

  const discount = 0.2;
  const factor = annual ? (1 - discount) : 1;

  const projection = useMemo(() => {
    const leadsExtra = vehiclesSold * 3.2;
    const conversion = 0.18;
    const extraSales = Math.round(leadsExtra * conversion);
    const margin = 0.08;
    const extraRevenue = Math.round(extraSales * avgTicket * margin);
    return { leadsExtra: Math.round(leadsExtra), extraSales, extraRevenue };
  }, [vehiclesSold, avgTicket]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* HERO */}
        <section className="gradient-navy text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 pointer-events-none"
               style={{background: "radial-gradient(60% 60% at 20% 10%, oklch(0.6 0.18 80 / 0.25), transparent), radial-gradient(50% 50% at 80% 30%, oklch(0.55 0.22 260 / 0.35), transparent)"}} />
          <div className="container mx-auto px-4 py-20 text-center relative">
            <Badge className="bg-white/10 border border-white/15 text-white mb-5">
              <Sparkles className="h-3 w-3 mr-1 text-gold" /> Monetização inteligente
            </Badge>
            <h1 className="font-display font-black text-4xl md:text-6xl max-w-4xl mx-auto leading-tight">
              Planos que pagam por si mesmos em <span className="gradient-gold-text">menos de um veículo vendido.</span>
            </h1>
            <p className="mt-4 text-white/80 max-w-xl mx-auto">
              Quatro tiers, add-ons sob demanda e um clube exclusivo para compradores. Escolha o tamanho do seu crescimento.
            </p>

            {/* Toggle */}
            <div className="mt-8 inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full p-1.5 backdrop-blur">
              <button
                onClick={() => setAnnual(false)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition ${!annual ? "bg-white text-[oklch(0.18_0.04_260)]" : "text-white/80"}`}>
                Mensal
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition inline-flex items-center gap-2 ${annual ? "bg-gold text-[oklch(0.18_0.04_260)]" : "text-white/80"}`}>
                Anual <span className="text-[10px] bg-success/30 text-success px-1.5 py-0.5 rounded-full">-20%</span>
              </button>
            </div>
          </div>
        </section>

        {/* GARAGE PLANS */}
        <section className="container mx-auto px-4 py-16 -mt-14">
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
            {GARAGE_PLANS.map((p) => {
              const Icon = p.icon;
              const price = Math.round(p.price * factor);
              const isBlack = p.elite;
              return (
                <Card
                  key={p.name}
                  className={`relative p-7 card-hover transition flex flex-col ${
                    p.highlight ? "border-gold border-2 shadow-xl scale-[1.02]" : ""
                  } ${p.ai ? "border-primary/30" : ""} ${
                    isBlack
                      ? "bg-[oklch(0.15_0.03_260)] text-white border-gold/40 shadow-2xl"
                      : ""
                  }`}
                >
                  {p.badge && (
                    <Badge
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap inline-flex items-center gap-1.5 ${
                        p.badgeTone === "gold" ? "bg-gold text-[oklch(0.18_0.04_260)]" :
                        p.badgeTone === "primary" ? "bg-primary text-primary-foreground" :
                        "bg-gradient-to-r from-gold to-amber-400 text-[oklch(0.18_0.04_260)]"
                      }`}
                    >
                      {p.ai && <Bot className="h-3 w-3" />}
                      {isBlack && <Crown className="h-3 w-3" />}
                      {p.badge}
                    </Badge>
                  )}

                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center mb-4 ${
                    isBlack ? "bg-gold/20 text-gold" :
                    p.ai ? "bg-primary/10 text-primary" :
                    p.highlight ? "bg-gold/15 text-gold" : "bg-muted text-foreground"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className={`text-xs uppercase tracking-wider ${isBlack ? "text-gold/80" : "text-secondary"}`}>{p.tagline}</div>
                  <h3 className="font-display font-black text-3xl mt-1">{p.name}</h3>
                  <p className={`text-sm mt-1 ${isBlack ? "text-white/70" : "text-muted-foreground"}`}>{p.desc}</p>

                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="font-display font-black text-5xl">R${price}</span>
                    <span className={isBlack ? "text-white/60" : "text-muted-foreground"}>/mês</span>
                  </div>
                  {annual && (
                    <div className="text-xs text-success mt-1">Economize R${(p.price - price) * 12}/ano</div>
                  )}

                  <Button asChild
                    className={`w-full mt-6 ${
                      isBlack ? "bg-gold text-[oklch(0.18_0.04_260)] hover:bg-gold/90" :
                      p.highlight ? "bg-gold text-[oklch(0.18_0.04_260)] hover:bg-gold/90" :
                      p.ai ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
                    }`}
                    size="lg"
                    variant={!isBlack && !p.highlight && !p.ai ? "outline" : "default"}>
                    <Link to="/auth">{isBlack ? "Solicitar convite" : "Assinar agora"}</Link>
                  </Button>

                  <ul className="mt-6 space-y-2.5 flex-1">
                    {p.features.map((f) => {
                      const low = f.toLowerCase();
                      const isAi = low.includes("camila") || low.includes("atendente");
                      const isBot = low.includes("bot ") || low.includes("disparo") || low.includes("republicação") || low.includes("copy");
                      const highlighted = isAi || isBot;
                      const ItemIcon = isBot ? Megaphone : isAi ? Bot : Check;
                      return (
                        <li key={f} className={`flex items-start gap-2 text-sm ${
                          highlighted ? (isBlack ? "text-gold font-semibold" : "text-primary font-semibold") : ""
                        }`}>
                          <ItemIcon className={`h-4 w-4 mt-0.5 shrink-0 ${!highlighted ? (isBlack ? "text-gold" : "text-success") : ""}`} />
                          <span className={isBlack && !highlighted ? "text-white/85" : ""}>{f}</span>
                        </li>
                      );
                    })}
                  </ul>
                </Card>
              );
            })}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Todos os planos incluem hospedagem, SSL, backups e atualizações. Cancele quando quiser.
          </p>
        </section>

        {/* ADD-ONS */}
        <section className="bg-muted/30 border-y">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <Badge variant="outline" className="mb-3"><Zap className="h-3 w-3 mr-1 text-gold" /> Sob demanda</Badge>
              <h2 className="font-display font-black text-3xl md:text-4xl">Boosters & Add-ons</h2>
              <p className="text-muted-foreground mt-2">
                Combine com qualquer plano. Pague apenas quando precisar acelerar uma venda específica.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ADD_ONS.map((a) => {
                const Icon = a.icon;
                return (
                  <Card key={a.name} className="p-5 card-hover flex items-start gap-4">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-semibold">{a.name}</h4>
                        <span className="font-display font-black text-lg">R${a.price}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{a.desc}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* BOT MULTICANAL */}
        <section className="bg-[oklch(0.16_0.03_260)] text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-40 pointer-events-none"
               style={{background: "radial-gradient(60% 60% at 80% 20%, oklch(0.6 0.18 80 / 0.2), transparent), radial-gradient(50% 50% at 10% 80%, oklch(0.55 0.22 260 / 0.3), transparent)"}} />
          <div className="container mx-auto px-4 py-20 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-gold/15 text-gold border-gold/30 mb-3">
                  <Megaphone className="h-3 w-3 mr-1" /> Exclusivo Premium & Elite Black
                </Badge>
                <h2 className="font-display font-black text-3xl md:text-5xl leading-tight">
                  Seu anúncio vira <span className="gradient-gold-text">propaganda em todas as plataformas</span>, no piloto automático.
                </h2>
                <p className="text-white/70 mt-4 text-lg">
                  Você publica o veículo aqui — nosso Bot Multicanal dispara automaticamente em Instagram, Facebook,
                  Marketplace, OLX, Mercado Livre e mais. Copy gerada por IA, hashtags certas, republicação semanal
                  pra nunca cair no ranking.
                </p>

                <div className="mt-8 grid sm:grid-cols-2 gap-3">
                  {[
                    { icon: Share2, t: "Distribuição automática", d: "1 clique, 6+ canais simultâneos" },
                    { icon: Bot, t: "Copy gerada por IA", d: "Texto, hashtags e CTA por veículo" },
                    { icon: TrendingUp, t: "Republicação semanal", d: "Mantém o anúncio sempre no topo" },
                    { icon: Globe2, t: "Pro: TikTok & Shorts", d: "Vídeos verticais automáticos (Elite)" },
                  ].map((b) => (
                    <div key={b.t} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="h-9 w-9 rounded-lg bg-gold/15 text-gold flex items-center justify-center shrink-0">
                        <b.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{b.t}</div>
                        <div className="text-xs text-white/60 mt-0.5">{b.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="p-7 bg-white/5 border-white/10 backdrop-blur text-white">
                <div className="text-xs uppercase tracking-widest text-gold mb-3">Canais incluídos</div>
                <div className="space-y-3">
                  {[
                    { name: "Instagram (Feed + Stories)", tier: "Premium" },
                    { name: "Facebook + Marketplace", tier: "Premium" },
                    { name: "OLX", tier: "Premium" },
                    { name: "Mercado Livre", tier: "Premium" },
                    { name: "WhatsApp Status & grupos parceiros", tier: "Premium" },
                    { name: "TikTok & YouTube Shorts (vídeo IA)", tier: "Elite" },
                    { name: "Google Ads (campanhas dinâmicas)", tier: "Elite" },
                    { name: "Telegram (canais de revenda VIP)", tier: "Elite" },
                  ].map((c) => (
                    <div key={c.name} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-2.5 text-sm">
                        <Check className={`h-4 w-4 ${c.tier === "Elite" ? "text-gold" : "text-success"}`} />
                        {c.name}
                      </div>
                      <Badge variant="outline" className={`text-[10px] ${
                        c.tier === "Elite" ? "border-gold/40 text-gold" : "border-primary/40 text-primary"
                      }`}>
                        {c.tier}
                      </Badge>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white/50 mt-5">
                  Você conecta suas contas uma vez. O bot cuida do resto, respeitando os limites de cada plataforma.
                </p>
              </Card>
            </div>
          </div>
        </section>


        {/* BUYER CLUB */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">
                <Star className="h-3 w-3 mr-1" /> Nova fonte de receita recorrente
              </Badge>
              <h2 className="font-display font-black text-3xl md:text-5xl leading-tight">
                Clube <span className="gradient-gold-text">Portal+</span> para compradores
              </h2>
              <p className="text-muted-foreground mt-3 text-lg">
                Não monetize só os garagistas. Compradores exigentes pagam para ver oportunidades primeiro,
                receber alertas com IA e ter negociação assistida.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="px-4 py-2 rounded-full bg-muted text-sm inline-flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" /> Alertas IA
                </div>
                <div className="px-4 py-2 rounded-full bg-muted text-sm inline-flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" /> Acesso antecipado 48h
                </div>
                <div className="px-4 py-2 rounded-full bg-muted text-sm inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Histórico veicular
                </div>
              </div>
            </div>

            <Card className="p-8 bg-gradient-to-br from-primary/5 to-gold/10 border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                  <Gem className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-primary">Para compradores</div>
                  <h3 className="font-display font-black text-2xl">{BUYER_PLAN.name}</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{BUYER_PLAN.desc}</p>

              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-display font-black text-5xl">R${BUYER_PLAN.price}</span>
                <span className="text-muted-foreground">/mês</span>
              </div>

              <ul className="mt-5 space-y-2.5">
                {BUYER_PLAN.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button asChild className="w-full mt-6" size="lg">
                <Link to="/auth">Entrar no Clube</Link>
              </Button>
            </Card>
          </div>
        </section>

        {/* ROI CALCULATOR */}
        <section className="bg-[oklch(0.15_0.03_260)] text-white">
          <div className="container mx-auto px-4 py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-gold/20 text-gold border-gold/30 mb-3">
                  <TrendingUp className="h-3 w-3 mr-1" /> Calculadora de ROI
                </Badge>
                <h2 className="font-display font-black text-3xl md:text-5xl leading-tight">
                  Veja quanto o Portal pode <span className="gradient-gold-text">somar ao seu caixa.</span>
                </h2>
                <p className="text-white/70 mt-3">
                  Estimativa baseada em garagens parceiras: 3,2 leads extras por veículo ativo,
                  18% de conversão em visita, 8% de margem líquida.
                </p>

                <div className="mt-8 space-y-5">
                  <div>
                    <label className="text-sm text-white/70">Veículos vendidos hoje/mês</label>
                    <Input type="number" value={vehiclesSold}
                      onChange={(e) => setVehiclesSold(Math.max(0, +e.target.value || 0))}
                      className="mt-1 bg-white/5 border-white/15 text-white text-lg" />
                  </div>
                  <div>
                    <label className="text-sm text-white/70">Ticket médio (R$)</label>
                    <Input type="number" value={avgTicket}
                      onChange={(e) => setAvgTicket(Math.max(0, +e.target.value || 0))}
                      className="mt-1 bg-white/5 border-white/15 text-white text-lg" />
                  </div>
                </div>
              </div>

              <Card className="p-8 bg-white/5 border-white/10 backdrop-blur text-white">
                <div className="text-sm text-white/60 uppercase tracking-wider">Projeção mensal extra</div>
                <div className="mt-2">
                  <div className="font-display font-black text-6xl gradient-gold-text">
                    R${projection.extraRevenue.toLocaleString("pt-BR")}
                  </div>
                  <div className="text-sm text-white/70 mt-1">em margem líquida adicional</div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-3xl font-black">{projection.leadsExtra}</div>
                    <div className="text-xs text-white/60 mt-1">Leads/mês extras</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-3xl font-black">+{projection.extraSales}</div>
                    <div className="text-xs text-white/60 mt-1">Vendas/mês</div>
                  </div>
                </div>
                <p className="text-xs text-white/50 mt-6">
                  Resultados podem variar. Garantia de 30 dias: se não trouxer leads qualificados, devolvemos 100%.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* GUARANTEE / FAQ */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-3 gap-5 mb-12">
            <Card className="p-6 text-center">
              <ShieldCheck className="h-8 w-8 text-success mx-auto mb-3" />
              <h4 className="font-bold">Garantia 30 dias</h4>
              <p className="text-sm text-muted-foreground mt-1">Cancele e receba 100% de volta no primeiro mês.</p>
            </Card>
            <Card className="p-6 text-center">
              <Bot className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-bold">IA treinada por você</h4>
              <p className="text-sm text-muted-foreground mt-1">A Camila aprende com a base que você preencher.</p>
            </Card>
            <Card className="p-6 text-center">
              <BadgeCheck className="h-8 w-8 text-gold mx-auto mb-3" />
              <h4 className="font-bold">Curadoria de garagens</h4>
              <p className="text-sm text-muted-foreground mt-1">Só anuncia quem é verificado. Reputação preservada.</p>
            </Card>
          </div>

          <div className="max-w-3xl mx-auto">
            <h3 className="font-display font-black text-2xl md:text-3xl text-center mb-6">Perguntas frequentes</h3>
            {[
              { q: "A Camila está em todos os planos?", a: "Sim! Desde o Start a Camila atende seus clientes 24/7. Nos planos Pro e acima ela é treinada com a base de conhecimento que você preencher de cada veículo." },
              { q: "Como funciona o Bot de Anúncios Multicanal?", a: "Disponível nos planos Premium e Elite Black. Você conecta suas contas (Instagram, Facebook, OLX, Mercado Livre, etc.) e a cada novo veículo nosso bot publica automaticamente com copy gerada por IA. Republica semanalmente pra manter no topo." },
              { q: "Posso mudar de plano a qualquer momento?", a: "Sim. Upgrade vale na hora, downgrade no próximo ciclo. Sem multas." },
              { q: "O Elite Black é para qualquer garagem?", a: "É indicação limitada para garagens premium e de importados. Avaliamos portfólio antes de liberar." },
              { q: "A IA realmente parece humana?", a: "A Camila usa modelos de última geração e contexto do seu estoque. A maioria dos clientes não percebe que é IA." },
              { q: "O Clube Portal+ canibaliza as vendas?", a: "Pelo contrário: acelera. Compradores VIP pagam para ver primeiro, e leads quentes chegam direto à garagem." },
            ].map((f, i) => (
              <details key={i} className="border-b py-4 group">
                <summary className="flex items-center justify-between cursor-pointer font-semibold list-none">
                  {f.q}
                  <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                </summary>
                <p className="text-sm text-muted-foreground mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
