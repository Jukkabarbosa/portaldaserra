import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles } from "lucide-react";

type Sponsor = {
  id: string;
  name: string;
  slug: string;
  tier: "diamante" | "platina" | "ouro" | "prata" | "bronze";
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
};

const TIER_RANK: Record<Sponsor["tier"], number> = {
  diamante: 5, platina: 4, ouro: 3, prata: 2, bronze: 1,
};

function useSponsors(limit = 12) {
  return useQuery({
    queryKey: ["sponsors-active", limit],
    queryFn: async (): Promise<Sponsor[]> => {
      const { data } = await supabase
        .from("sponsors")
        .select("id,name,slug,tier,logo_url,website_url,description")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .limit(limit);
      const list = (data ?? []) as Sponsor[];
      return list.sort((a, b) => TIER_RANK[b.tier] - TIER_RANK[a.tier]);
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Faixa horizontal de patrocinadores — para a Home (logo de todo mundo).
 * Se não há patrocinadores ainda, mostra um CTA pra virar patrocinador.
 */
export function SponsorBar({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const { data: sponsors } = useSponsors(16);
  const dark = variant === "dark";

  const wrap = dark
    ? "border-white/5 bg-[oklch(0.13_0.025_260)]"
    : "border-border bg-card";
  const label = dark ? "text-white/40" : "text-muted-foreground";
  const tile = dark
    ? "border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"
    : "border-border bg-background hover:bg-accent";

  if (!sponsors || sponsors.length === 0) {
    return (
      <div className={`rounded-3xl border ${wrap} px-6 py-5 flex flex-wrap items-center justify-between gap-4`}>
        <div className="flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-[var(--gold)]" />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--gold)]">Patrocinadores oficiais</div>
            <div className={`text-sm ${dark ? "text-white/60" : "text-muted-foreground"}`}>Sua marca aqui na frente de milhares de compradores SC.</div>
          </div>
        </div>
        <Link to="/patrocinadores" className="text-xs font-bold uppercase tracking-wider text-[var(--gold)] hover:underline">
          Seja patrocinador →
        </Link>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl border ${wrap} px-6 py-5`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`text-[10px] font-bold uppercase tracking-[0.22em] ${label}`}>
          Quem apoia o Portal da Serra
        </div>
        <Link to="/patrocinadores" className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--gold)] hover:underline">
          Ver todos →
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {sponsors.map((s) => {
          const inner = s.logo_url ? (
            <img src={s.logo_url} alt={s.name} className="h-8 max-w-[120px] object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
          ) : (
            <span className={`text-sm font-display font-bold ${dark ? "text-white/70" : "text-foreground"} group-hover:text-[var(--gold)] transition-colors`}>
              {s.name}
            </span>
          );
          const className = `group inline-flex items-center justify-center h-14 px-5 rounded-2xl border ${tile} transition-colors`;
          return s.website_url ? (
            <a key={s.id} href={s.website_url} target="_blank" rel="noopener noreferrer" className={className} title={s.name}>
              {inner}
            </a>
          ) : (
            <div key={s.id} className={className} title={s.name}>
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Bloco compacto de patrocinadores para o rodapé do site (renderiza em todas as páginas).
 */
export function SponsorFooterBlock() {
  const { data: sponsors } = useSponsors(8);
  if (!sponsors || sponsors.length === 0) return null;
  return (
    <div className="border-t bg-background/60">
      <div className="container mx-auto px-4 py-6 flex flex-wrap items-center gap-x-8 gap-y-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
          Apoiadores oficiais
        </span>
        {sponsors.map((s) =>
          s.website_url ? (
            <a key={s.id} href={s.website_url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground font-medium" title={s.name}>
              {s.logo_url ? <img src={s.logo_url} alt={s.name} className="h-6 max-w-[90px] object-contain opacity-70 hover:opacity-100" /> : s.name}
            </a>
          ) : (
            <span key={s.id} className="text-xs text-muted-foreground font-medium" title={s.name}>
              {s.logo_url ? <img src={s.logo_url} alt={s.name} className="h-6 max-w-[90px] object-contain opacity-70" /> : s.name}
            </span>
          )
        )}
        <Link to="/patrocinadores" className="ml-auto text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--gold)] hover:underline">
          Anuncie sua marca →
        </Link>
      </div>
    </div>
  );
}

/**
 * Card de patrocinador destacado para inserir entre veículos na listagem.
 */
export function SponsorInlineCard() {
  const { data: sponsors } = useSponsors(5);
  if (!sponsors || sponsors.length === 0) return null;
  // Roda um aleatório a cada render para distribuir impressões entre tiers altos
  const top = sponsors.filter((s) => s.tier === "diamante" || s.tier === "platina" || s.tier === "ouro");
  const pool = top.length > 0 ? top : sponsors;
  const s = pool[Math.floor(Math.random() * pool.length)];

  const body = (
    <div className="relative h-full rounded-3xl overflow-hidden border border-[var(--gold)]/30 bg-gradient-to-br from-[oklch(0.18_0.04_260)] to-[oklch(0.12_0.02_260)] p-6 flex flex-col justify-between min-h-[260px]">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[var(--gold)]/15 blur-3xl" />
      <div className="relative">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--gold)]/15 border border-[var(--gold)]/30 text-[9px] font-bold uppercase tracking-widest text-[var(--gold)]">
          <Sparkles className="h-3 w-3" /> Patrocinador {s.tier}
        </div>
        {s.logo_url ? (
          <img src={s.logo_url} alt={s.name} className="mt-6 h-12 object-contain" />
        ) : (
          <div className="mt-6 font-display font-extrabold text-2xl text-white">{s.name}</div>
        )}
        {s.description && (
          <p className="mt-4 text-sm text-white/60 leading-relaxed line-clamp-3">{s.description}</p>
        )}
      </div>
      <div className="relative mt-6 inline-flex items-center text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
        Visitar parceiro →
      </div>
    </div>
  );

  return s.website_url ? (
    <a href={s.website_url} target="_blank" rel="noopener noreferrer" className="block h-full">{body}</a>
  ) : (
    <div className="h-full">{body}</div>
  );
}
