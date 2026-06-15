import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calculator, Send, TrendingDown, BadgeCheck } from "lucide-react";
import { brl } from "@/lib/format";
import {
  computeFinancing, DEFAULT_RATE, RATE_RANGE, INSTALLMENT_OPTIONS,
} from "@/lib/financing";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/simulador")({
  component: SimuladorPage,
  head: () => ({
    meta: [
      { title: "Simulador de Financiamento · Portal da Serra" },
      { name: "description", content: "Simule o financiamento do seu próximo carro em segundos. Calcule parcelas, juros e total a pagar com transparência." },
    ],
  }),
});

function SimuladorPage() {
  const [vehiclePrice, setVehiclePrice] = React.useState(80000);
  const [downPayment, setDownPayment] = React.useState(20000);
  const [installments, setInstallments] = React.useState(48);
  const [rate, setRate] = React.useState(DEFAULT_RATE);
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [vehicleOfInterest, setVehicleOfInterest] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const result = React.useMemo(
    () => computeFinancing({ vehiclePrice, downPayment, installments, monthlyRate: rate }),
    [vehiclePrice, downPayment, installments, rate],
  );

  async function sendLead(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || (!phone.trim() && !email.trim())) {
      toast.error("Informe seu nome e ao menos um contato (telefone ou e-mail).");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("financing_simulations").insert({
      name: name.trim(),
      phone: phone.trim() || null,
      email: email.trim() || null,
      vehicle_price: vehiclePrice,
      down_payment: downPayment,
      installments,
      interest_rate: rate,
      monthly_payment: result.monthlyPayment,
      total_amount: result.totalAmount,
      notes: vehicleOfInterest.trim() || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Não foi possível enviar agora. Tente novamente.");
      return;
    }
    toast.success("Simulação enviada! Vamos retornar em breve.");
    setName(""); setPhone(""); setEmail(""); setVehicleOfInterest("");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-6xl">
        <div className="flex items-center gap-3 mb-2">
          <Calculator className="h-5 w-5 text-secondary" />
          <span className="text-xs uppercase tracking-[0.2em] text-secondary">Ferramenta</span>
        </div>
        <h1 className="font-display font-black text-3xl md:text-4xl">Simulador de financiamento</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Calcule rapidamente a parcela do seu próximo carro. Ao enviar, nossa equipe entra em contato com
          condições reais dos bancos parceiros.
        </p>

        <div className="grid lg:grid-cols-5 gap-6 mt-8">
          {/* Calculadora */}
          <Card className="p-6 lg:col-span-3 space-y-6">
            <div>
              <div className="flex items-end justify-between mb-1">
                <Label>Valor do veículo</Label>
                <span className="font-display font-bold text-lg">{brl(vehiclePrice)}</span>
              </div>
              <Slider min={10000} max={1500000} step={1000} value={[vehiclePrice]}
                onValueChange={(v) => { setVehiclePrice(v[0]); if (downPayment > v[0] * 0.9) setDownPayment(Math.round(v[0] * 0.3)); }} />
            </div>

            <div>
              <div className="flex items-end justify-between mb-1">
                <Label>Entrada ({((downPayment / vehiclePrice) * 100).toFixed(0)}%)</Label>
                <span className="font-display font-bold text-lg">{brl(downPayment)}</span>
              </div>
              <Slider min={0} max={Math.max(1000, Math.floor(vehiclePrice * 0.9))} step={1000}
                value={[downPayment]} onValueChange={(v) => setDownPayment(v[0])} />
            </div>

            <div>
              <Label className="mb-2 block">Número de parcelas</Label>
              <div className="grid grid-cols-5 gap-2">
                {INSTALLMENT_OPTIONS.map((n) => (
                  <button key={n} type="button" onClick={() => setInstallments(n)}
                    className={`py-2 rounded-lg text-sm font-medium border transition ${
                      installments === n ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent"
                    }`}>
                    {n}x
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-end justify-between mb-1">
                <Label>Taxa mensal</Label>
                <span className="font-display font-bold text-lg">{rate.toFixed(2)}% a.m.</span>
              </div>
              <Slider min={RATE_RANGE.min} max={RATE_RANGE.max} step={0.05}
                value={[rate]} onValueChange={(v) => setRate(v[0])} />
              <p className="text-xs text-muted-foreground mt-1">
                Taxa de referência. A taxa final depende da análise de crédito.
              </p>
            </div>
          </Card>

          {/* Resultado */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/30">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Parcela mensal</div>
              <div className="font-display font-black text-4xl mt-1">{brl(result.monthlyPayment)}</div>
              <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">Valor financiado</div>
                  <div className="font-bold">{brl(result.financed)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Total a pagar</div>
                  <div className="font-bold">{brl(result.totalAmount)}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" /> Juros totais
                  </div>
                  <div className="font-bold">{brl(result.totalInterest)}</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <form onSubmit={sendLead} className="space-y-3">
                <div className="font-display font-bold text-lg">Receber proposta real</div>
                <p className="text-xs text-muted-foreground -mt-2">
                  Enviamos para um consultor entrar em contato.
                </p>
                <div>
                  <Label htmlFor="nm">Nome</Label>
                  <Input id="nm" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="ph">WhatsApp</Label>
                    <Input id="ph" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} placeholder="(49) 9..." />
                  </div>
                  <div>
                    <Label htmlFor="em">E-mail</Label>
                    <Input id="em" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={120} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="vi">Carro de interesse (opcional)</Label>
                  <Input id="vi" value={vehicleOfInterest} onChange={(e) => setVehicleOfInterest(e.target.value)} maxLength={200} placeholder="Ex.: Hilux 2022" />
                </div>
                <Button type="submit" disabled={submitting} className="w-full">
                  <Send className="h-4 w-4" />{submitting ? "Enviando..." : "Quero condições reais"}
                </Button>
                <div className="inline-flex items-center gap-2 text-xs text-muted-foreground pt-1">
                  <BadgeCheck className="h-3 w-3" /> Sem compromisso. Sem cobrança.
                </div>
              </form>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
