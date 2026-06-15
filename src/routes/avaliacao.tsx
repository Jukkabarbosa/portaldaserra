import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import * as React from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Sparkles, Loader2, TrendingUp, Lightbulb } from "lucide-react";
import { brl } from "@/lib/format";
import { VEHICLE_BRANDS, SERRA_CITIES } from "@/lib/mock";
import { evaluateVehicle } from "@/lib/evaluation.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/avaliacao")({
  component: AvaliacaoPage,
  head: () => ({
    meta: [
      { title: "Avaliação de Veículo por IA · Portal da Serra" },
      { name: "description", content: "Descubra o valor de mercado do seu carro em segundos com a Camila, nossa avaliadora inteligente. Avaliação grátis e sem compromisso." },
    ],
  }),
});

type Result = {
  estimated_min: number;
  estimated_avg: number;
  estimated_max: number;
  rationale: string;
  tips: string[];
};

function AvaliacaoPage() {
  const evaluate = useServerFn(evaluateVehicle);
  const [brand, setBrand] = React.useState("");
  const [model, setModel] = React.useState("");
  const [yearModel, setYearModel] = React.useState<number | "">("");
  const [mileage, setMileage] = React.useState<number | "">("");
  const [condition, setCondition] = React.useState<"excelente"|"bom"|"regular"|"ruim">("bom");
  const [city, setCity] = React.useState("Lages");
  const [options, setOptions] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<Result | null>(null);

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    if (!brand || !model || !yearModel || mileage === "") {
      toast.error("Preencha marca, modelo, ano e quilometragem.");
      return;
    }
    setLoading(true);
    setResult(null);
    const res = await evaluate({
      data: {
        brand, model,
        year_model: Number(yearModel),
        mileage: Number(mileage),
        condition, city,
        options: options.trim() || undefined,
      },
    });
    if (!res.ok) {
      setLoading(false);
      toast.error(res.error);
      return;
    }
    setResult(res.data as Result);
    // grava no banco (best-effort)
    await supabase.from("vehicle_evaluations").insert({
      email: email.trim() || null,
      brand, model,
      year_model: Number(yearModel),
      mileage: Number(mileage),
      condition, city,
      estimated_min: res.data.estimated_min,
      estimated_avg: res.data.estimated_avg,
      estimated_max: res.data.estimated_max,
      rationale: res.data.rationale,
    });
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-5xl">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-5 w-5 text-gold" />
          <span className="text-xs uppercase tracking-[0.2em] text-secondary">Avaliação inteligente</span>
        </div>
        <h1 className="font-display font-black text-3xl md:text-4xl">Quanto vale o seu carro?</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          A Camila, nossa avaliadora por IA, analisa marca, modelo, ano, km e estado de conservação
          para estimar o valor justo de mercado. Grátis e em segundos.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card className="p-6">
            <form onSubmit={handle} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Marca</Label>
                  <Select value={brand} onValueChange={setBrand}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {VEHICLE_BRANDS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="md">Modelo</Label>
                  <Input id="md" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Ex.: Corolla XEi" maxLength={80} />
                </div>
                <div>
                  <Label htmlFor="yr">Ano modelo</Label>
                  <Input id="yr" type="number" min={1980} max={2030}
                    value={yearModel} onChange={(e) => setYearModel(e.target.value ? Number(e.target.value) : "")} />
                </div>
                <div>
                  <Label htmlFor="km">Quilometragem</Label>
                  <Input id="km" type="number" min={0} value={mileage}
                    onChange={(e) => setMileage(e.target.value ? Number(e.target.value) : "")} placeholder="Ex.: 45000" />
                </div>
                <div>
                  <Label>Estado de conservação</Label>
                  <Select value={condition} onValueChange={(v) => setCondition(v as typeof condition)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excelente">Excelente</SelectItem>
                      <SelectItem value="bom">Bom</SelectItem>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="ruim">Ruim</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Cidade</Label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SERRA_CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="opt">Opcionais e observações (opcional)</Label>
                <Textarea id="opt" rows={3} value={options} onChange={(e) => setOptions(e.target.value)} maxLength={500}
                  placeholder="Ex.: teto solar, único dono, IPVA pago, pneus novos..." />
              </div>
              <div>
                <Label htmlFor="em">Seu e-mail (opcional, para receber a avaliação)</Label>
                <Input id="em" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={120} />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Camila está avaliando...</> : <><Sparkles className="h-4 w-4" />Avaliar com IA</>}
              </Button>
            </form>
          </Card>

          <div>
            {!result && !loading && (
              <Card className="p-8 h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                <Sparkles className="h-10 w-10 mb-3 text-gold" />
                <p className="text-sm">Preencha o formulário ao lado para receber uma estimativa de valor de mercado.</p>
              </Card>
            )}
            {loading && (
              <Card className="p-8 h-full flex flex-col items-center justify-center text-center">
                <Loader2 className="h-10 w-10 mb-3 animate-spin text-secondary" />
                <p className="text-sm text-muted-foreground">Camila está analisando dados de mercado e referências FIPE...</p>
              </Card>
            )}
            {result && (
              <div className="space-y-4">
                <Card className="p-6 bg-gradient-to-br from-gold/10 to-transparent border-gold/30">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Valor médio estimado</div>
                  <div className="font-display font-black text-4xl mt-1">{brl(result.estimated_avg)}</div>
                  <div className="flex items-center gap-2 mt-3 text-sm">
                    <TrendingUp className="h-4 w-4 text-secondary" />
                    <span className="text-muted-foreground">Faixa:</span>
                    <span className="font-bold">{brl(result.estimated_min)} — {brl(result.estimated_max)}</span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed">{result.rationale}</p>
                </Card>
                {result.tips?.length > 0 && (
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="h-4 w-4 text-gold" />
                      <span className="font-display font-bold">Dicas da Camila</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      {result.tips.map((t, i) => (
                        <li key={i} className="flex gap-2"><span className="text-gold">→</span>{t}</li>
                      ))}
                    </ul>
                  </Card>
                )}
                <div className="text-xs text-muted-foreground text-center">
                  Estimativa baseada em IA. O valor real depende de vistoria física e condições de mercado.
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
