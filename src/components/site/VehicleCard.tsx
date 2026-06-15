import { Link } from "@tanstack/react-router";
import { Heart, MessageCircle, Gauge, Calendar, MapPin, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { brl, km, whatsappLink } from "@/lib/format";

type Props = {
  v: {
    id: string;
    title: string;
    year_model: number;
    price: number;
    mileage: number;
    transmission?: string | null;
    fuel?: string | null;
    city?: string | null;
    state?: string | null;
    is_featured?: boolean;
    inspection_approved?: boolean;
    image?: string;
    garage_name?: string;
    whatsapp?: string;
  };
};

export function VehicleCard({ v }: Props) {
  const message = `Olá, vi o anúncio do ${v.title} no Portal da Serra e tenho interesse. Ainda está disponível?`;
  return (
    <article className="group card-hover rounded-2xl border bg-card overflow-hidden flex flex-col">
      <Link to="/carros/$id" params={{ id: v.id }} className="relative block aspect-[16/10] overflow-hidden bg-muted">
        {v.image && (
          <img src={v.image} alt={v.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          {v.is_featured && (
            <Badge className="bg-gold text-[oklch(0.18_0.04_260)] border-0 shadow">DESTAQUE</Badge>
          )}
          {v.inspection_approved && (
            <Badge title="Inspeção aprovada pelo Portal da Serra"
              className="bg-success text-white border-0 shadow gap-1">
              <ShieldCheck className="h-3 w-3" /> INSPECIONADO
            </Badge>
          )}
        </div>
        <button
          aria-label="Favoritar"
          onClick={(e) => { e.preventDefault(); }}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur hover:bg-background transition"
        >
          <Heart className="h-4 w-4" />
        </button>
      </Link>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-display font-bold text-base leading-tight line-clamp-1">{v.title}</h3>
          {v.garage_name && <p className="text-xs text-muted-foreground mt-0.5">{v.garage_name}</p>}
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{v.year_model}</span>
          <span className="inline-flex items-center gap-1"><Gauge className="h-3 w-3" />{km(v.mileage)}</span>
          {v.transmission && <span>{v.transmission}</span>}
          {v.fuel && <span>{v.fuel}</span>}
        </div>

        {(v.city || v.state) && (
          <div className="text-xs inline-flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3 w-3" />{v.city}{v.state ? `/${v.state}` : ""}
          </div>
        )}

        <div className="mt-auto pt-2 flex items-end justify-between gap-2">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Por</div>
            <div className="font-display font-black text-xl">{brl(v.price)}</div>
          </div>
          <div className="flex gap-1.5">
            <Button asChild size="sm" variant="outline">
              <Link to="/carros/$id" params={{ id: v.id }}>Ver</Link>
            </Button>
            {v.whatsapp && (
              <Button size="sm" className="bg-success hover:bg-success/90 text-white" asChild>
                <a href={whatsappLink(v.whatsapp, message)} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-3.5 w-3.5" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
