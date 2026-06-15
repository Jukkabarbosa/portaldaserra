import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Bell, BellRing, Check } from "lucide-react";
import { VEHICLE_BRANDS, SERRA_CITIES } from "@/lib/mock";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/alertas")({
  component: AlertasPage,
  head: () => ({
    meta: [
      { title: "Alertas Inteligentes · Portal da Serra" },
      { name: "description", content: "Receba por e-mail os novos carros que combinam com o que você procura. Configure marca, faixa de preço, km e cidade." },
    ],
  }),
});

function AlertasPage() {
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [brand, setBrand] = React.useState<string>("any");
  const [model, setModel] = React.useState("");
  const [priceMin, setPriceMin] = React.useState<string>("");
  const [priceMax, setPriceMax] = React.useState<string>("");
  const [yearMin, setYearMin] = React.useState<string>("");
  const [mileageMax, setMileageMax] = React.useState<string>("");
  const [city, setCity] = React.useState<string>("any");
  const [submitting, setSubmitting] = React.useState(false);
  const [created, setCreated] = React.useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Informe seu e-mail.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("vehicle_alerts").insert({
      email: email.trim(),
      name: name.trim() || null,
      brand: brand === "any" ? null : brand,
      model: model.trim() || null,
      price_min: priceMin ? Number(priceMin) : null,
      price_max: priceMax ? Number(priceMax) : null,
      year_min: yearMin ? Number(yearMin) : null,
      mileage_max: mileageMax ? Number(mileageMax) : null,
      city: city === "any" ? null : city,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Não foi possível criar o alerta. Tente novamente.");
      return;
    }
    setCreated(true);
    toast.success("Alerta criado! Você será avisado por e-mail.");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-3xl">
        <div className="flex items-center gap-3 mb-2">
          <BellRing className="h-5 w-5 text-secondary" />
          <span className="text-xs uppercase tracking-[0.2em] text-secondary">Alerta inteligente</span>
        </div>
        <h1 className="font-display font-black text-3xl md:text-4xl">Te avisamos quando o carro certo aparecer</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Cadastre o que você procura. Quando um anúncio compatível for publicado, enviamos um e-mail com todos os detalhes.
        </p>

        {created ? (
          <Card className="p-10 mt-8 text-center">
            <div className="h-14 w-14 rounded-full bg-success/15 grid place-items-center mx-auto mb-4">
              <Check className="h-7 w-7 text-success" />
            </div>
            <h2 className="font-display font-bold text-xl">Pronto, alerta ativo!</h2>
            <p className="text-muted-foreground mt-2 text-sm max-w-md mx-auto">
              Vamos monitorar diariamente nossos anúncios e te avisar em <strong>{email}</strong> assim que aparecer algo que bate com seus filtros.
            </p>
            <Button variant="outline" className="mt-6" onClick={() => { setCreated(false); }}>
              Criar outro alerta
            </Button>
          </Card>
        ) : (
          <Card className="p-6 mt-8">
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="nm">Seu nome (opcional)</Label>
                  <Input id="nm" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="em">E-mail *</Label>
                  <Input id="em" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} maxLength={120} />
                </div>
              </div>

              <div className="pt-2">
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">O que você procura</div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label>Marca</Label>
                    <Select value={brand} onValueChange={setBrand}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Qualquer marca</SelectItem>
                        {VEHICLE_BRANDS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="mo">Modelo (opcional)</Label>
                    <Input id="mo" value={model} onChange={(e) => setModel(e.target.value)} maxLength={80} placeholder="Ex.: Corolla" />
                  </div>
                  <div>
                    <Label htmlFor="pmin">Preço mín. (R$)</Label>
                    <Input id="pmin" type="number" min={0} value={priceMin} onChange={(e) => setPriceMin(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="pmax">Preço máx. (R$)</Label>
                    <Input id="pmax" type="number" min={0} value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="ymin">Ano mínimo</Label>
                    <Input id="ymin" type="number" min={1980} max={2030} value={yearMin} onChange={(e) => setYearMin(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="kmax">Km máximo</Label>
                    <Input id="kmax" type="number" min={0} value={mileageMax} onChange={(e) => setMileageMax(e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Cidade</Label>
                    <Select value={city} onValueChange={setCity}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Toda a Serra Catarinense</SelectItem>
                        {SERRA_CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={submitting} className="w-full">
                <Bell className="h-4 w-4" />{submitting ? "Criando..." : "Ativar alerta"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Você pode cancelar a qualquer momento. Sem spam, só alertas relevantes.
              </p>
            </form>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}
