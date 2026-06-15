export type SponsorTier = "bronze" | "prata" | "ouro" | "platina" | "diamante";

export const TIER_META: Record<SponsorTier, { label: string; basePrice: number; color: string; perks: string[] }> = {
  diamante: {
    label: "Diamante",
    basePrice: 2490,
    color: "from-cyan-300 to-blue-500",
    perks: [
      "Logo fixo no topo da home (todas as visitas)",
      "Banner exclusivo na página de detalhes de cada veículo",
      "Menção da Camila (IA) em conversas",
      "Card destacado em /patrocinadores",
      "Bloco no rodapé de todas as páginas",
      "Relatório de impressões e cliques em tempo real",
    ],
  },
  platina: {
    label: "Platina",
    basePrice: 1290,
    color: "from-slate-200 to-slate-400",
    perks: [
      "Logo na faixa de patrocinadores da home",
      "Card destacado em /patrocinadores",
      "Banner rotativo na listagem /carros (1 a cada 6 anúncios)",
      "Bloco no rodapé de todas as páginas",
      "Relatório mensal de impressões e cliques",
    ],
  },
  ouro: {
    label: "Ouro",
    basePrice: 690,
    color: "from-amber-300 to-yellow-600",
    perks: [
      "Logo rotativo na faixa de patrocinadores da home",
      "Card destacado em /patrocinadores",
      "Aparição na listagem de carros",
      "Link rastreável (UTM automático)",
    ],
  },
  prata: {
    label: "Prata",
    basePrice: 349,
    color: "from-zinc-300 to-zinc-500",
    perks: [
      "Logo no grid de /patrocinadores",
      "Bloco no rodapé do site",
      "Link com UTM automático",
      "Relatório trimestral",
    ],
  },
  bronze: {
    label: "Bronze",
    basePrice: 149,
    color: "from-orange-400 to-amber-700",
    perks: [
      "Listagem em /patrocinadores",
      "Link com UTM",
    ],
  },
};

export const TIER_ORDER: SponsorTier[] = ["diamante", "platina", "ouro", "prata", "bronze"];

export type BillingCycleId = "monthly" | "quarterly" | "semestral" | "annual";

export const BILLING_CYCLES: {
  id: BillingCycleId;
  label: string;
  short: string;
  months: number;
  discount: number; // 0 a 1
  badge?: string;
  bonuses: string[];
}[] = [
  {
    id: "monthly",
    label: "Mensal",
    short: "1 mês",
    months: 1,
    discount: 0,
    bonuses: ["Cancelamento flexível a qualquer momento"],
  },
  {
    id: "quarterly",
    label: "Trimestral",
    short: "3 meses",
    months: 3,
    discount: 0.1,
    badge: "10% OFF",
    bonuses: [
      "10% de desconto no valor mensal",
      "1 post patrocinado nas redes do Portal",
      "Relatório de performance mensal",
    ],
  },
  {
    id: "semestral",
    label: "Semestral",
    short: "6 meses",
    months: 6,
    discount: 0.18,
    badge: "Mais escolhido · 18% OFF",
    bonuses: [
      "18% de desconto no valor mensal",
      "3 posts patrocinados nas redes do Portal",
      "Banner extra rotativo por 30 dias",
      "Camila white-label menciona sua marca",
      "Relatório quinzenal com leads qualificados",
    ],
  },
  {
    id: "annual",
    label: "Anual",
    short: "12 meses",
    months: 12,
    discount: 0.28,
    badge: "Melhor custo · 28% OFF",
    bonuses: [
      "28% de desconto no valor mensal",
      "2 meses grátis equivalentes",
      "Vídeo institucional gerado por IA (1x)",
      "Newsletter exclusiva 2x ao ano",
      "Upgrade gratuito ao tier superior por 30 dias",
      "Gestor de conta dedicado",
      "Prioridade em campanhas sazonais",
    ],
  },
];

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export function priceFor(tier: SponsorTier, cycleId: BillingCycleId) {
  const tierMeta = TIER_META[tier];
  const cycle = BILLING_CYCLES.find((c) => c.id === cycleId)!;
  const monthly = Math.round(tierMeta.basePrice * (1 - cycle.discount));
  const total = monthly * cycle.months;
  const savings = tierMeta.basePrice * cycle.months - total;
  return { monthly, total, savings, cycle };
}
