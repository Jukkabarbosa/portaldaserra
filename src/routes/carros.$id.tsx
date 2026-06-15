import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Check, MessageCircle, Heart, Share2, MapPin, Gauge, Calendar, Fuel, Settings2, Phone, ShieldCheck } from "lucide-react";
import { MOCK_VEHICLES } from "@/lib/mock";
import { brl, km, whatsappLink } from "@/lib/format";
import { VirtualAttendant } from "@/components/site/VirtualAttendant";

export const Route = createFileRoute("/carros/$id")({
  component: VehicleDetail,
  loader: ({ params }) => {
    const v = MOCK_VEHICLES.find((x) => x.id === params.id);
    if (!v) throw notFound();
    return { v };
  },
});

function VehicleDetail() {
  const { v } = Route.useLoaderData();
  const msg = `Olá, vi o anúncio do ${v.title} no Portal da Serra e tenho interesse. Ainda está disponível?`;
  const wpp = v.whatsapp ?? "";
  const specs = [
    { i: Calendar, l: "Ano", v: `${v.year_made}/${v.year_model}` },
    { i: Gauge, l: "Quilometragem", v: km(v.mileage) },
    { i: Settings2, l: "Câmbio", v: v.transmission ?? "—" },
    { i: Fuel, l: "Combustível", v: v.fuel ?? "—" },
  ];
  const features = ["IPVA pago","Único dono","Aceita troca","Financia","Licenciado","Manual e chave reserva","Laudo cautelar aprovado","Garantia"];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Link to="/carros" className="text-sm text-muted-foreground hover:text-foreground">← Voltar</Link>

        <div className="mt-4 grid lg:grid-cols-[1fr_380px] gap-8">
          <div>
            <div className="rounded-2xl overflow-hidden border bg-muted aspect-[16/10] relative">
              <img src={v.image} alt={v.title} className="absolute inset-0 w-full h-full object-cover" />
              {v.is_featured && <Badge className="absolute top-4 left-4 bg-gold text-[oklch(0.18_0.04_260)]">DESTAQUE</Badge>}
            </div>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="aspect-[4/3] rounded-lg overflow-hidden border bg-muted">
                  <img src={v.image} alt="" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition" />
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h1 className="font-display font-black text-3xl md:text-4xl">{v.title}</h1>
              <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{v.city}/{v.state}</span>
                <span>•</span>
                <span>Cor {v.color}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              {specs.map((s) => (
                <div key={s.l} className="rounded-xl border p-4 bg-card">
                  <s.i className="h-4 w-4 text-secondary" />
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-2">{s.l}</div>
                  <div className="font-display font-bold mt-0.5">{s.v}</div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h2 className="font-display font-bold text-xl mb-3">Descrição</h2>
              <p className="text-muted-foreground leading-relaxed">
                Veículo em estado impecável, revisões em dia, manual e chave reserva. Aceita troca e financia em até 60x.
                Agende sua visita e venha conhecer essa máquina pessoalmente.
              </p>
            </div>

            <div className="mt-8">
              <h2 className="font-display font-bold text-xl mb-3">Condição e documentação</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-success" /> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-20 self-start space-y-4">
            <Card className="p-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Por</div>
              <div className="font-display font-black text-4xl text-primary">{brl(v.price)}</div>
              <div className="text-xs text-muted-foreground mt-1">À vista ou financiado em até 60x</div>

              {wpp && (
                <Button asChild className="w-full mt-5 bg-success hover:bg-success/90 text-white" size="lg">
                  <a href={whatsappLink(wpp, msg)} target="_blank" rel="noreferrer">
                    <MessageCircle className="h-4 w-4" /> Chamar no WhatsApp
                  </a>
                </Button>
              )}
              <Button variant="outline" className="w-full mt-2" size="lg">
                <Phone className="h-4 w-4" /> Tenho interesse
              </Button>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button variant="ghost"><Heart className="h-4 w-4" /> Favoritar</Button>
                <Button variant="ghost"><Share2 className="h-4 w-4" /> Compartilhar</Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold">{v.garage_name}</h3>
                <ShieldCheck className="h-4 w-4 text-success" />
              </div>
              <div className="text-xs text-muted-foreground mt-1">Garagem verificada • {v.city}/{v.state}</div>
              <Button asChild variant="outline" className="w-full mt-4">
                <Link to="/garagens">Ver estoque da garagem</Link>
              </Button>
            </Card>
          </aside>
        </div>
      </main>
      <Footer />

      {/* Atendente virtual Camila — disponível em todos os anúncios */}
      <VirtualAttendant
        attendantName="Camila"
        vehicle={{
          title: v.title,
          brand: v.brand,
          model: v.model,
          year_made: v.year_made,
          year_model: v.year_model,
          price: v.price,
          mileage: v.mileage,
          transmission: v.transmission ?? undefined,
          fuel: v.fuel ?? undefined,
          color: v.color ?? undefined,
          city: v.city ?? undefined,
          state: v.state ?? undefined,
          garage_name: v.garage_name,
          features: ["IPVA pago", "Único dono", "Aceita troca", "Financia", "Laudo cautelar aprovado", "Garantia"],
          knowledge_base: (v as any).knowledge_base,
        }}
      />
    </div>
  );
}
