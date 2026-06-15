import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Car, MessageCircle } from "lucide-react";
import { MOCK_GARAGES } from "@/lib/mock";
import { whatsappLink } from "@/lib/format";

export const Route = createFileRoute("/garagens")({ component: Garages });

function Garages() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <h1 className="font-display font-black text-3xl md:text-4xl">Garagens parceiras</h1>
        <p className="text-muted-foreground mt-1">Garagens verificadas e curadoria premium em toda a serra.</p>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MOCK_GARAGES.map((g) => (
            <Card key={g.id} className="overflow-hidden card-hover">
              <div className="aspect-[16/9] bg-muted relative">
                <img src={g.cover} alt={g.name} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-lg">{g.name}</h3>
                  {g.verified && <ShieldCheck className="h-4 w-4 text-success" />}
                </div>
                <div className="text-sm text-muted-foreground">{g.city}/{g.state}</div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm inline-flex items-center gap-1"><Car className="h-3.5 w-3.5" />{g.count} veículos</span>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline"><Link to="/carros">Ver estoque</Link></Button>
                    <Button size="sm" asChild className="bg-success hover:bg-success/90 text-white">
                      <a href={whatsappLink(g.whatsapp, `Olá ${g.name}, vi vocês no Portal da Serra.`)} target="_blank" rel="noreferrer">
                        <MessageCircle className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  </div>
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
