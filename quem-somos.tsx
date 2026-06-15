import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SponsorBar } from "@/components/site/SponsorStrip";
import {
  ShieldCheck, Heart, Target, Eye, Handshake, Users, Award, MapPin, Clock, Phone, ArrowRight,
  Sparkles, Zap, BadgeCheck, Bot, Calculator, Bell, FileCheck, MessageSquare, Wrench, Headphones,
  Cpu, MonitorCog, Rocket, Lightbulb,
} from "lucide-react";

const WA_PHONE = "5511937321847";
const WA_DISPLAY = "(11) 93732-1847";

export const Route = createFileRoute("/quem-somos")({
  component: QuemSomosPage,
  head: () => ({
    meta: [
      { title: "Quem Somos · Portal da Serra" },
      { name: "description", content: "O marketplace automotivo mais completo e inteligente de Santa Catarina. Mais de 1 ano em desenvolvimento, IA proprietária, suporte humano seg–sex e operação 100% catarinense." },
      { property: "og:title", content: "Quem Somos · Portal da Serra" },
      { property: "og:description", content: "O marketplace mais completo e inteligente de Santa Catarina. Tecnologia, IA e suporte humano." },
    ],
  }),
});

const TECH_FEATURES = [
  { icon: Bot, title: "IA Camila 24/7", desc: "Atendente virtual treinada que responde leads como uma pessoa real, dia e noite, fim de semana e feriado. Já filtra, qualifica e direciona pra garagem certa." },
  { icon: Calculator, title: "Avaliação por IA", desc: "Particulares descobrem em segundos quanto vale o carro deles. Base FIPE + variação regional SC + estado de conservação, tudo calculado por IA." },
  { icon: Cpu, title: "Simulador inteligente", desc: "Simulação de financiamento com taxas reais de bancos parceiros. O comprador já vê parcela, juros e total antes de falar com a garagem." },
  { icon: Bell, title: "Alertas inteligentes", desc: "O comprador cadastra o carro dos sonhos uma vez. Quando algo compatível entra na plataforma, ele é notificado na hora." },
  { icon: FileCheck, title: "Selo de inspeção", desc: "Veículos com laudo cautelar aprovado recebem selo verificado. Comprador vê confiança, garagem vende mais rápido." },
  { icon: MessageSquare, title: "Bot multicanal", desc: "Integração com WhatsApp e Instagram. O lead chega no canal preferido do comprador e cai direto no painel da garagem." },
];

const TIMELINE = [
  { year: "2024", title: "A ideia nasce", desc: "Identificamos uma lacuna real: o mercado automotivo catarinense não tinha um marketplace pensado pra ele. Sites nacionais tratam SC como periferia, e os classificados locais não acompanharam a tecnologia." },
  { year: "2024/25", title: "1 ano de construção", desc: "Mais de 12 meses desenvolvendo do zero, com foco em tecnologia de ponta. Arquitetura escalável, banco de dados otimizado, integração com IA, painel administrativo robusto. Nada de template pronto." },
  { year: "2025", title: "Inteligência embarcada", desc: "Treinamos a Camila (IA), implementamos avaliação automática de veículos, simulador de financiamento real e o sistema de alertas. A plataforma deixou de ser um simples catálogo." },
  { year: "2026", title: "Lançamento oficial em SC", desc: "Estamos no ar. Operação 100% focada em Santa Catarina, com garagens parceiras verificadas e suporte humano todos os dias úteis. É só o começo." },
];

const REGIONS = [
  { name: "Serra Catarinense", desc: "Lages, São Joaquim, Urubici, Bom Jardim da Serra, Otacílio Costa, Correia Pinto." },
  { name: "Grande Florianópolis", desc: "Florianópolis, São José, Palhoça, Biguaçu, Santo Amaro." },
  { name: "Vale do Itajaí", desc: "Blumenau, Itajaí, Brusque, Indaial, Gaspar, Pomerode." },
  { name: "Norte e Oeste", desc: "Joinville, Jaraguá do Sul, Chapecó, Concórdia, Xanxerê." },
];

function QuemSomosPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[oklch(0.10_0.02_260)] text-white">
      <div className="dark contents">
        <Header />
      </div>

      <main className="flex-1">
        {/* ============ HERO ============ */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=2400&q=80"
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-screen"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.10_0.02_260)]/50 via-[oklch(0.10_0.02_260)]/90 to-[oklch(0.10_0.02_260)]" />
            <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[oklch(0.55_0.11_245)]/15 blur-[120px]" />
            <div className="absolute bottom-1/4 -left-32 h-[500px] w-[500px] rounded-full bg-[var(--gold)]/10 blur-[120px]" />
          </div>

          <div className="container mx-auto px-4 relative pt-32 md:pt-40 pb-24">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--gold)] mb-8">
                <Rocket className="h-3.5 w-3.5" />
                Lançamento Oficial · Santa Catarina
              </div>

              <h1 className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
                O marketplace mais
                <br />
                <span className="bg-gradient-to-r from-[oklch(0.92_0.13_85)] via-[var(--gold)] to-[oklch(0.65_0.15_60)] bg-clip-text text-transparent">
                  completo e inteligente
                </span>
                <br />
                de Santa Catarina.
              </h1>

              <p className="mt-8 text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto">
                Mais de <span className="text-white font-semibold">1 ano em desenvolvimento</span> para
                entregar a plataforma automotiva que SC merece. IA proprietária, suporte humano
                seg–sex e foco 100% no mercado catarinense.
              </p>

              <div className="mt-12 flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="h-14 px-8 rounded-full bg-[var(--gold)] text-[oklch(0.14_0.025_260)] hover:bg-[var(--gold)]/90 font-bold">
                  <Link to="/planos">
                    Quero anunciar <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-full border-white/20 text-white hover:bg-white/5 font-bold">
                  <a href={`https://wa.me/${WA_PHONE}`} target="_blank" rel="noopener noreferrer">
                    <Phone className="h-4 w-4" /> {WA_DISPLAY}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ============ PATROCINADORES — em destaque ============ */}
        <section className="container mx-auto px-4 -mt-4 mb-16">
          <SponsorBar variant="dark" />
        </section>

        {/* ============ STATS ============ */}
        <section className="container mx-auto px-4 py-12 border-y border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { n: "1+ ano", l: "Em desenvolvimento" },
              { n: "100% SC", l: "Foco exclusivo no estado" },
              { n: "Seg–Sex", l: "Suporte humano real" },
              { n: "6", l: "Tecnologias inteligentes ativas" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display font-extrabold text-3xl md:text-5xl tracking-tighter mb-2 text-[var(--gold)]">{s.n}</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ POR QUE SOMOS O MAIS COMPLETO ============ */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--gold)] mb-3">Tecnologia que ninguém tem</div>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight">Por que somos o mais completo</h2>
            <p className="mt-4 text-white/55 max-w-2xl mx-auto">Não somos só uma vitrine de carros. Somos uma plataforma de inteligência que conecta, qualifica e fecha negócios.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TECH_FEATURES.map((f) => (
              <div key={f.title} className="rounded-[1.8rem] border border-white/5 bg-[oklch(0.16_0.03_260)] p-8 hover:border-[var(--gold)]/30 transition-colors group">
                <div className="h-12 w-12 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/20 grid place-items-center mb-6 group-hover:bg-[var(--gold)]/20 transition-colors">
                  <f.icon className="h-5 w-5 text-[var(--gold)]" />
                </div>
                <h3 className="font-display font-bold text-lg mb-3">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============ SUPORTE HUMANO + PAINEL ============ */}
        <section className="container mx-auto px-4 py-12">
          <div className="rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-[oklch(0.19_0.035_260)] to-[oklch(0.14_0.025_260)] p-10 md:p-16 overflow-hidden relative">
            <div className="absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-[var(--gold)]/10 blur-[100px]" />

            <div className="relative grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--gold)] mb-3">Suporte humano de verdade</div>
                <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight mb-6 leading-tight">
                  Operadores reais.
                  <br />
                  <span className="text-[var(--gold)]">Erros corrigidos na hora.</span>
                </h2>
                <p className="text-white/60 leading-relaxed mb-8">
                  Nosso time atende de <strong className="text-white">segunda a sexta</strong> com pessoas reais
                  do outro lado — não bot, não formulário sem resposta. Temos um painel interno
                  onde qualquer falha reportada é vista em tempo real e corrigida em minutos.
                  Garagista e comprador nunca ficam no escuro.
                </p>

                <div className="space-y-4">
                  {[
                    { icon: Headphones, text: "Atendimento humano via WhatsApp seg–sex 8h–20h" },
                    { icon: MonitorCog, text: "Painel de monitoramento ativo 24/7 — vemos erros antes do usuário reclamar" },
                    { icon: Wrench, text: "Time técnico de plantão pra correções emergenciais" },
                    { icon: BadgeCheck, text: "SLA de resposta: 1h em horário comercial, 4h fora" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-start gap-3">
                      <item.icon className="h-5 w-5 text-[var(--gold)] shrink-0 mt-0.5" />
                      <span className="text-white/75 text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>

                <Button asChild className="mt-8 h-12 rounded-full bg-[var(--gold)] text-[oklch(0.14_0.025_260)] hover:bg-[var(--gold)]/90 font-bold px-6">
                  <a href={`https://wa.me/${WA_PHONE}?text=${encodeURIComponent("Olá! Vim pelo Portal da Serra e quero saber mais.")}`} target="_blank" rel="noopener noreferrer">
                    <Phone className="h-4 w-4" /> Falar com a gente: {WA_DISPLAY}
                  </a>
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Clock, label: "Seg–Sex", sub: "8h às 20h" },
                  { icon: Headphones, label: "Humano", sub: "Sem chatbot genérico" },
                  { icon: MonitorCog, label: "Painel ativo", sub: "Monitoramento 24/7" },
                  { icon: Zap, label: "1h SLA", sub: "Resposta comercial" },
                ].map((card) => (
                  <div key={card.label} className="rounded-[1.5rem] border border-white/5 bg-white/[0.03] p-6 text-center hover:border-[var(--gold)]/20 transition-colors">
                    <card.icon className="h-6 w-6 text-[var(--gold)] mx-auto mb-3" />
                    <div className="font-display font-bold text-base">{card.label}</div>
                    <div className="text-xs text-white/40 mt-1">{card.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============ EXCLUSIVO SANTA CATARINA ============ */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/30 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--gold)] mb-6">
              <MapPin className="h-3.5 w-3.5" /> Exclusivamente Santa Catarina
            </div>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight">
              SC inteiro. <span className="text-[var(--gold)]">Nada além.</span>
            </h2>
            <p className="mt-4 text-white/55 max-w-2xl mx-auto">
              Não somos um marketplace nacional fingindo conhecer a sua região. Somos catarinenses,
              focados no mercado catarinense — da Serra ao Litoral, do Vale ao Oeste.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {REGIONS.map((r) => (
              <div key={r.name} className="rounded-3xl border border-white/5 bg-[oklch(0.16_0.03_260)] p-6 hover:border-[var(--gold)]/30 transition-colors">
                <MapPin className="h-5 w-5 text-[var(--gold)] mb-3" />
                <div className="font-display font-bold text-base">{r.name}</div>
                <div className="text-xs text-white/45 mt-2 leading-relaxed">{r.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ JORNADA ============ */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[oklch(0.55_0.11_245)]/3 to-transparent" />
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-16">
              <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--gold)] mb-3">Nossa história</div>
              <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight">A jornada até aqui</h2>
              <p className="mt-4 text-white/50 max-w-2xl mx-auto">1 ano construindo a plataforma certa. Sem atalhos, sem template pronto, sem promessa furada.</p>
            </div>

            <div className="max-w-3xl mx-auto relative">
              <div className="absolute left-[19px] md:left-[27px] top-0 bottom-0 w-px bg-gradient-to-b from-[var(--gold)]/50 via-white/10 to-transparent" />

              {TIMELINE.map((step, i) => (
                <div key={step.year} className="relative flex gap-6 md:gap-10 mb-12 last:mb-0">
                  <div className="shrink-0 relative z-10">
                    <div className={`h-12 w-12 md:h-14 md:w-14 rounded-full border-2 grid place-items-center font-display font-extrabold text-[10px] md:text-xs ${
                      i === TIMELINE.length - 1
                        ? "bg-[var(--gold)] border-[var(--gold)] text-[oklch(0.14_0.025_260)]"
                        : "bg-[oklch(0.16_0.03_260)] border-[var(--gold)]/40 text-[var(--gold)]"
                    }`}>
                      {step.year}
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/5 bg-[oklch(0.16_0.03_260)] p-6 md:p-8 -mt-2 flex-1">
                    <h3 className="font-display font-bold text-xl mb-3">{step.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ VALORES ============ */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--gold)] mb-3">O que nos guia</div>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight">Princípios inegociáveis</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              { icon: ShieldCheck, title: "Transparência total", desc: "Cada veículo é auditado. Cada preço é justo. Não aceitamos enrolação — compradores e garagistas merecem a verdade." },
              { icon: Heart, title: "Paixão por carros", desc: "A gente entende de motor. Fundamos esse portal porque comprar e vender carro precisa ser experiência boa, não pesadelo." },
              { icon: Target, title: "Foco em resultados", desc: "Não medimos sucesso por cliques. Medimos por vendas reais. Se a garagem parceira não vende, a gente não dorme." },
              { icon: Handshake, title: "Parceria de verdade", desc: "Tratamos cada garagista como sócio. Seu sucesso é o nosso. Crescemos juntos ou não crescemos." },
            ].map((v) => (
              <div key={v.title} className="flex gap-6 rounded-[2rem] border border-white/5 bg-[oklch(0.16_0.03_260)] p-8 hover:border-white/10 transition-colors">
                <div className="shrink-0 h-12 w-12 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/20 grid place-items-center">
                  <v.icon className="h-5 w-5 text-[var(--gold)]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg mb-2">{v.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ MISSÃO / VISÃO ============ */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: "Missão", text: "Conectar compradores exigentes a garagistas sérios de Santa Catarina, com tecnologia, transparência e atendimento humanizado." },
              { icon: Eye, title: "Visão", text: "Ser o marketplace automotivo definitivo do estado, referência em SC pelo nível de inteligência embarcada e qualidade de atendimento." },
              { icon: Lightbulb, title: "Propósito", text: "Provar que dá pra unir tecnologia de ponta com cuidado humano, e que comprar/vender carro pode ser simples, rápido e seguro." },
            ].map((item) => (
              <div key={item.title} className="rounded-[2rem] border border-white/5 bg-[oklch(0.16_0.03_260)] p-10 hover:border-white/10 transition-colors group">
                <div className="h-14 w-14 rounded-2xl bg-[var(--gold)]/10 border border-[var(--gold)]/20 grid place-items-center mb-8 group-hover:bg-[var(--gold)]/20 transition-colors">
                  <item.icon className="h-6 w-6 text-[var(--gold)]" />
                </div>
                <h3 className="font-display font-extrabold text-2xl tracking-tight mb-4">Nossa {item.title}</h3>
                <p className="text-white/50 leading-relaxed text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============ CTA FINAL ============ */}
        <section className="container mx-auto px-4 py-24">
          <div className="rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-[oklch(0.22_0.06_260)] to-[oklch(0.16_0.03_260)] p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-[var(--gold)]/10 blur-[120px]" />
            <div className="absolute -left-32 -bottom-32 h-[400px] w-[400px] rounded-full bg-[oklch(0.55_0.11_245)]/10 blur-[100px]" />

            <div className="relative">
              <Badge className="bg-white/5 backdrop-blur-md border border-white/10 text-[var(--gold)] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 mb-6 inline-flex">
                <Handshake className="h-3 w-3 mr-1" /> Faça parte
              </Badge>
              <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight mb-6">
                Vamos conversar?
              </h2>
              <p className="text-white/55 max-w-2xl mx-auto mb-10 leading-relaxed">
                Garagista querendo vender mais, comprador buscando o carro ideal, ou marca querendo
                aparecer no maior marketplace catarinense — chama no WhatsApp.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="h-14 px-8 rounded-full bg-[var(--gold)] text-[oklch(0.14_0.025_260)] hover:bg-[var(--gold)]/90 font-bold">
                  <a href={`https://wa.me/${WA_PHONE}?text=${encodeURIComponent("Olá! Quero saber mais sobre o Portal da Serra.")}`} target="_blank" rel="noopener noreferrer">
                    <Phone className="h-4 w-4" /> {WA_DISPLAY}
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-full border-white/20 text-white hover:bg-white/5 font-bold">
                  <Link to="/planos">
                    Ver planos <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
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
